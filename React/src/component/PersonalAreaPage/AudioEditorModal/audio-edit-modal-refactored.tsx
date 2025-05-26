"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogActions, Button, Box, Typography, IconButton, Alert } from "@mui/material"
import { Close, Save } from "@mui/icons-material"
import axios from "axios"

import { WaveformCanvas } from "./waveform-canvas"
import { AudioControls } from "./audio-controls"
import { EditControls } from "./edit-controls"
import { useAudioContext } from "./useAudioContext"
import { useAudioPlayer } from "./useAudioPlayer"
import { useAudioSelection } from "./useAudioSelection"
import { useAudioProcessing } from "./useAudioProcessing"

interface AudioEditModalProps {
  open: boolean
  onClose: () => void
  audioUrl: string | null
  fileName?: string
}

const AudioEditModal: React.FC<AudioEditModalProps> = ({ open, onClose, audioUrl, fileName = "קובץ שמע" }) => {
  const [editMode, setEditMode] = useState<"cut" | "delete">("cut")
  const [saveError, setSaveError] = useState<string | null>(null)

  // Custom hooks
  const audioContext = useAudioContext()
  const audioPlayer = useAudioPlayer()
  const audioSelection = useAudioSelection(audioPlayer.duration)
  const audioProcessing = useAudioProcessing()

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      audioPlayer.cleanup()
      audioSelection.resetSelection()
      setEditMode("cut")
      setSaveError(null)

      if (audioUrl) {
        loadAudio()
      }
    } else {
      audioContext.cleanup()
      audioPlayer.cleanup()
    }

    return () => {
      audioContext.cleanup()
      audioPlayer.cleanup()
    }
  }, [open, audioUrl])

  // Update selection when duration changes
  useEffect(() => {
    if (audioPlayer.duration > 0) {
      audioSelection.setEndTime(audioPlayer.duration)
    }
  }, [audioPlayer.duration])

  // Update waveform when selection changes
  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (audioSelection.isDragging) {
        const canvas = document.querySelector("canvas")
        if (canvas) {
          const rect = canvas.getBoundingClientRect()
          const relativeX = event.clientX - rect.left
          const ratio = relativeX / canvas.offsetWidth
          const time = Math.max(0, Math.min(audioPlayer.duration, ratio * audioPlayer.duration))
          audioSelection.handleSelectionMove(time)
        }
      }
    }

    const handleGlobalMouseUp = () => {
      if (audioSelection.isDragging) {
        audioSelection.handleSelectionEnd()
      }
    }

    if (audioSelection.isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove)
      document.addEventListener("mouseup", handleGlobalMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove)
      document.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [audioSelection.isDragging, audioPlayer.duration])

  const loadAudio = async () => {
    try {
      const buffer = await audioContext.loadAudioFromUrl(audioUrl!)
      audioPlayer.setDuration(buffer.duration)
      audioSelection.setEndTime(buffer.duration)

      console.log("Audio loaded successfully:", {
        duration: buffer.duration,
        sampleRate: buffer.sampleRate,
        channels: buffer.numberOfChannels,
      })
    } catch (err) {
      console.error("Audio loading error:", err)
    }
  }

  const handlePlayPause = async () => {
    try {
      await audioPlayer.handlePlayPause()
    } catch (err) {
      audioContext.setError(err instanceof Error ? err.message : "שגיאה בהפעלת השמע")
    }
  }

  const canExecuteEdit = () => {
    return (
      audioContext.audioBuffer &&
      audioContext.audioContext &&
      audioSelection.isValidSelection() &&
      !audioContext.isLoading &&
      !audioProcessing.isProcessing
    )
  }

  const handleExecuteEdit = async () => {
    if (!canExecuteEdit()) {
      audioContext.setError("אנא הגדר זמני התחלה וסיום תקינים")
      return
    }

    try {
      let newBuffer: AudioBuffer

      if (editMode === "cut") {
        newBuffer = await audioProcessing.cutAudio(
          audioContext.audioBuffer!,
          audioContext.audioContext!,
          audioSelection.startTime,
          audioSelection.endTime,
        )
      } else {
        newBuffer = await audioProcessing.deleteAudio(
          audioContext.audioBuffer!,
          audioContext.audioContext!,
          audioSelection.startTime,
          audioSelection.endTime,
        )
      }

      // Update state with new buffer
      audioContext.setAudioBuffer(newBuffer)
      audioPlayer.setDuration(newBuffer.duration)
      audioPlayer.setCurrentTime(0)
      audioSelection.resetSelection()

      // Update player with new audio
      updatePlayerWithNewAudio(newBuffer)
    } catch (err) {
      audioContext.setError(err instanceof Error ? err.message : "שגיאה בעריכת השמע")
    }
  }

  const updatePlayerWithNewAudio = (newBuffer: AudioBuffer) => {
    try {
      const { data, mimeType } = audioProcessing.convertToFormat(newBuffer, fileName)
      const blob = new Blob([data], { type: mimeType })
      const newUrl = URL.createObjectURL(blob)
      audioPlayer.updateAudioSource(newUrl)
    } catch (err) {
      console.warn("Could not update player preview:", err)
    }
  }

  const handleSave = async () => {
    if (!audioContext.audioBuffer) {
      setSaveError("אין נתוני שמע לשמירה")
      return
    }

    try {
      setSaveError(null)
      const { data, mimeType } = audioProcessing.convertToFormat(audioContext.audioBuffer, fileName)
      const blob = new Blob([data], { type: mimeType })

      const fileNameToUse = fileName || "audio_file.wav"
      const presignedUrl = `https://studystreamserver.onrender.com/api/upload/presigned-url?fileName=${encodeURIComponent(fileNameToUse)}&contentType=${encodeURIComponent(mimeType)}`

      const presignedResponse = await fetch(presignedUrl)
      if (!presignedResponse.ok) {
        throw new Error(`Failed to get presigned URL: ${presignedResponse.status}`)
      }

      const { url } = await presignedResponse.json()
      const uploadResponse = await axios.put(url, blob, {
        headers: { "Content-Type": mimeType },
      })

      if (uploadResponse.status !== 200) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`)
      }

      onClose()
    } catch (err) {
      setSaveError(`שגיאה בשמירת הקובץ: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }

  const displayFileName = fileName.split(".").slice(0, -1).join(".")

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      dir="rtl"
      sx={{
        "& .MuiDialog-paper": {
          maxHeight: "90vh",
          height: "auto",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#1976d2",
          color: "white",
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: "#1976d2",
            backgroundColor: "white",
            px: 3,
            py: 1,
            borderRadius: 2,
          }}
        >
          עריכת שמע
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "white",
            position: "absolute",
            left: 16,
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
          }}
          aria-label="סגור"
        >
          <Close />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent
        sx={{
          p: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Error Display */}
        {(audioContext.error || saveError) && (
          <Alert severity="error" sx={{ m: 3, mb: 0 }}>
            {audioContext.error || saveError}
          </Alert>
        )}

        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 3,
            display: "flex",
            gap: 3,
            minHeight: 0,
          }}
        >
          {/* Hidden Audio Element */}
          {audioUrl && (
            <audio
              ref={audioPlayer.audioRef}
              src={audioUrl}
              onTimeUpdate={audioPlayer.handleTimeUpdate}
              onPlay={() => audioPlayer.setIsPlaying(true)}
              onPause={() => audioPlayer.setIsPlaying(false)}
              onEnded={() => audioPlayer.setIsPlaying(false)}
              onLoadedMetadata={() => {
                if (audioPlayer.audioRef.current) {
                  const audioDuration = audioPlayer.audioRef.current.duration
                  if (isFinite(audioDuration) && audioDuration > 0) {
                    if (!isFinite(audioPlayer.duration) || audioPlayer.duration <= 0) {
                      audioPlayer.setDuration(audioDuration)
                      audioSelection.setEndTime(audioDuration)
                    }
                  }
                  audioPlayer.audioRef.current.volume = audioPlayer.volume / 100
                }
              }}
              style={{ display: "none" }}
            />
          )}

          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            {/* File Name */}
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
              {displayFileName}
            </Typography>

            {/* Waveform */}
            <WaveformCanvas
              audioBuffer={audioContext.audioBuffer}
              startTime={audioSelection.startTime}
              endTime={audioSelection.endTime}
              currentTime={audioPlayer.currentTime}
              duration={audioPlayer.duration}
              isLoading={audioContext.isLoading}
              onSelectionStart={audioSelection.handleSelectionStart}
              onSelectionMove={audioSelection.handleSelectionMove}
              onSelectionEnd={audioSelection.handleSelectionEnd}
              isDragging={audioSelection.isDragging}
            />

            {/* Audio Controls */}
            <AudioControls
              isPlaying={audioPlayer.isPlaying}
              currentTime={audioPlayer.currentTime}
              duration={audioPlayer.duration}
              onPlayPause={handlePlayPause}
              onStop={audioPlayer.handleStop}
              disabled={!audioContext.audioBuffer}
            />
          </Box>

          {/* Edit Controls */}
          <Box sx={{ width: "400px", display: "flex", flexDirection: "column" }}>
            <EditControls
              editMode={editMode}
              startTime={audioSelection.startTime}
              endTime={audioSelection.endTime}
              duration={audioPlayer.duration}
              isLoading={audioContext.isLoading || audioProcessing.isProcessing}
              canExecuteEdit={canExecuteEdit()}
              onEditModeChange={setEditMode}
              onStartTimeChange={audioSelection.setStartTime}
              onEndTimeChange={audioSelection.setEndTime}
              onExecuteEdit={handleExecuteEdit}
            />
          </Box>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: "1px solid #e0e0e0",
          gap: 1,
        }}
      >
        <Button onClick={onClose} variant="outlined" size="large">
          סגור
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<Save />}
          disabled={audioContext.isLoading || !audioContext.audioBuffer}
          size="large"
        >
          שמור שינויים
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AudioEditModal
