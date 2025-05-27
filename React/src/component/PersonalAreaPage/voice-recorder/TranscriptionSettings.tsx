"use client"

import type React from "react"

import { Box, FormControlLabel, Switch, Typography } from "@mui/material"
import { TranscribeRounded } from "@mui/icons-material"

interface TranscriptionSettingsProps {
  isTranscriptionSupported: boolean
  transcriptionEnabled: boolean
  onChange: (enabled: boolean) => void
}

export const TranscriptionSettings: React.FC<TranscriptionSettingsProps> = ({
  isTranscriptionSupported,
  transcriptionEnabled,
  onChange,
}) => {
  if (!isTranscriptionSupported) return null

  return (
    <Box sx={{ mb: 3 }}>
      <FormControlLabel
        control={<Switch checked={transcriptionEnabled} onChange={(e) => onChange(e.target.checked)} color="primary" />}
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TranscribeRounded />
            <Typography>תמלול בזמן אמת</Typography>
          </Box>
        }
        sx={{ direction: "rtl" }}
      />
    </Box>
  )
}
