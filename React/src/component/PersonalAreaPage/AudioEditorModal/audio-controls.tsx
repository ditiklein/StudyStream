"use client"

import type React from "react"
import { Box, IconButton, Typography } from "@mui/material"
import { PlayArrow, Pause, Stop } from "@mui/icons-material"

interface AudioControlsProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  onPlayPause: () => void
  onStop: () => void
  disabled?: boolean
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onStop,
  disabled = false,
}) => {
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) {
      return "0:00"
    }
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 3,
        bgcolor: "#f5f5f5",
        borderRadius: 2,
      }}
    >
      <IconButton
        onClick={onPlayPause}
        color="primary"
        size="large"
        disabled={disabled}
        sx={{
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" },
          "&:disabled": { bgcolor: "grey.300" },
          width: 60,
          height: 60,
        }}
        aria-label={isPlaying ? "השהה" : "נגן"}
      >
        {isPlaying ? <Pause sx={{ fontSize: 32 }} /> : <PlayArrow sx={{ fontSize: 32 }} />}
      </IconButton>
      <IconButton
        onClick={onStop}
        size="large"
        disabled={disabled}
        sx={{
          bgcolor: "grey.200",
          "&:hover": { bgcolor: "grey.300" },
          "&:disabled": { bgcolor: "grey.100" },
          width: 50,
          height: 50,
        }}
        aria-label="עצור"
      >
        <Stop sx={{ fontSize: 28 }} />
      </IconButton>
      <Box sx={{ textAlign: "center", ml: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formatTime(currentTime)}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          / {formatTime(duration)}
        </Typography>
      </Box>
    </Box>
  )
}
