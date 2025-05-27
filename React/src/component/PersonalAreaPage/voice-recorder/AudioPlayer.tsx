"use client"

import type React from "react"

import { Box } from "@mui/material"
import { useRef } from "react"

interface AudioPlayerProps {
  audioUrl: string | null
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  if (!audioUrl) return null

  return (
    <Box sx={{ width: "100%", mt: 2, display: "flex", justifyContent: "center" }}>
      <audio ref={audioRef} src={audioUrl} controls style={{ width: "80%" }} />
    </Box>
  )
}
