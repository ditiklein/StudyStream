import type React from "react"
import { Typography } from "@mui/material"

interface RecordingTimerProps {
  recordingTime: number
  primaryColor: string
}

export const RecordingTimer: React.FC<RecordingTimerProps> = ({ recordingTime, primaryColor }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0")
    return `${mins}:${secs}`
  }

  return (
    <Typography
      variant="h4"
      align="center"
      sx={{
        fontFamily: "monospace",
        color: primaryColor,
        mb: 2,
      }}
    >
      {formatTime(recordingTime)}
    </Typography>
  )
}
