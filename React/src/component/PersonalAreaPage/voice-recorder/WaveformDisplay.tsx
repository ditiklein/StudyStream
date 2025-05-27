import type React from "react"
import { Box } from "@mui/material"

interface WaveformDisplayProps {
  waveformValues: number[]
  primaryColor: string
}

export const WaveformDisplay: React.FC<WaveformDisplayProps> = ({ waveformValues, primaryColor }) => {
  return (
    <Box
      sx={{
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
        }}
      >
        {waveformValues.map((value, index) => (
          <Box
            key={index}
            sx={{
              height: `${value}%`,
              width: 6,
              bgcolor: primaryColor,
              borderRadius: 4,
              transition: "height 0.2s ease",
            }}
          />
        ))}
      </Box>
    </Box>
  )
}
