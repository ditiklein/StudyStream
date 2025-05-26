"use client"

import type React from "react"
import { useEffect } from "react"
import { Box, Typography } from "@mui/material"
import { useWaveform } from "./useWaveform"

interface WaveformCanvasProps {
  audioBuffer: AudioBuffer | null
  startTime: number
  endTime: number
  currentTime: number
  duration: number
  isLoading: boolean
  onSelectionStart: (time: number) => void
  onSelectionMove: (time: number) => void
  onSelectionEnd: () => void
  isDragging: boolean
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
  audioBuffer,
  startTime,
  endTime,
  currentTime,
  duration,
  isLoading,
  onSelectionStart,
  onSelectionMove,
  onSelectionEnd,
  isDragging,
}) => {
  const { canvasRef, drawSelectedRegion, getTimeFromX } = useWaveform()

  useEffect(() => {
    drawSelectedRegion(audioBuffer, startTime, endTime, currentTime, duration)
  }, [audioBuffer, startTime, endTime, currentTime, duration, drawSelectedRegion])

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!duration) return
    const time = getTimeFromX(event.clientX, duration)
    onSelectionStart(time)
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return
    const time = getTimeFromX(event.clientX, duration)
    onSelectionMove(time)
  }

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: 2,
        p: 2,
        bgcolor: "#fafafa",
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={onSelectionEnd}
        style={{
          width: "100%",
          height: "150px",
          display: "block",
          borderRadius: "4px",
          backgroundColor: "#ffffff",
          cursor: isDragging ? "grabbing" : "grab",
        }}
      />
      {isLoading && (
        <Typography variant="body2" sx={{ textAlign: "center", mt: 2, color: "text.secondary" }}>
          טוען...
        </Typography>
      )}
    </Box>
  )
}
