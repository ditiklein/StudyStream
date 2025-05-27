"use client"

import type React from "react"

import { Button, Stack } from "@mui/material"
import {
  MicRounded,
  PauseRounded,
  PlayArrowRounded,
  StopRounded,
  SaveRounded,
  VolumeUpRounded,
  CloseRounded,
} from "@mui/icons-material"

interface RecordingControlsHorizontalProps {
  recording: boolean
  paused: boolean
  audioUrl: string | null
  primaryColor: string
  onStartRecording: () => void
  onPauseRecording: () => void
  onResumeRecording: () => void
  onStopRecording: () => void
  onPlayRecording: () => void
  onSaveRecording: () => void
  onCancelRecording: () => void
}

export const RecordingControlsHorizontal: React.FC<RecordingControlsHorizontalProps> = ({
  recording,
  paused,
  audioUrl,
  primaryColor,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
  onPlayRecording,
  onSaveRecording,
  onCancelRecording,
}) => {
  if (!recording && !audioUrl) {
    return (
      <Button
        variant="contained"
        color="primary"
        startIcon={<MicRounded />}
        onClick={onStartRecording}
        size="large"
        dir="rtl"
        sx={{
          borderRadius: 28,
          px: 4,
          py: 1.5,
          bgcolor: primaryColor,
          "&:hover": {
            bgcolor: "#303f9f",
          },
          fontSize: "1.1rem",
        }}
      >
        התחל הקלטה
      </Button>
    )
  }

  if (recording) {
    return (
      <Stack direction="row" spacing={4} justifyContent="center">
        {!paused ? (
          <Button
            variant="contained"
            startIcon={<PauseRounded />}
            onClick={onPauseRecording}
            size="large"
            dir="rtl"
            sx={{
              borderRadius: 28,
              px: 3,
              bgcolor: primaryColor,
              "&:hover": {
                bgcolor: "#303f9f",
              },
            }}
          >
            השהה
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<PlayArrowRounded />}
            onClick={onResumeRecording}
            size="large"
            dir="rtl"
            sx={{
              borderRadius: 28,
              px: 3,
              bgcolor: primaryColor,
              "&:hover": {
                bgcolor: "#303f9f",
              },
            }}
          >
            המשך
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<StopRounded />}
          onClick={onStopRecording}
          size="large"
          dir="rtl"
          sx={{
            borderRadius: 28,
            px: 3,
            bgcolor: primaryColor,
            "&:hover": {
              bgcolor: "#303f9f",
            },
          }}
        >
          סיים
        </Button>
      </Stack>
    )
  }

  return (
    <Stack direction="row" spacing={4} justifyContent="center">
      <Button
        variant="contained"
        startIcon={<VolumeUpRounded />}
        onClick={onPlayRecording}
        dir="rtl"
        sx={{
          borderRadius: 28,
          px: 3,
          bgcolor: primaryColor,
          "&:hover": {
            bgcolor: "#303f9f",
          },
        }}
      >
        האזן
      </Button>
      <Button
        variant="contained"
        startIcon={<SaveRounded />}
        onClick={onSaveRecording}
        dir="rtl"
        sx={{
          borderRadius: 28,
          px: 3,
          bgcolor: primaryColor,
          "&:hover": {
            bgcolor: "#303f9f",
          },
        }}
      >
        שמור
      </Button>
      <Button
        variant="contained"
        startIcon={<CloseRounded />}
        onClick={onCancelRecording}
        dir="rtl"
        sx={{
          borderRadius: 28,
          px: 3,
          bgcolor: primaryColor,
          "&:hover": {
            bgcolor: "#303f9f",
          },
        }}
      >
        ביטול
      </Button>
    </Stack>
  )
}
