"use client"

import type React from "react"

import { Box, Button, Divider, Paper, Typography } from "@mui/material"
import { TranscribeRounded, ContentCopyRounded, DownloadRounded } from "@mui/icons-material"

interface TranscriptionPanelProps {
  finalTranscript: string
  currentTranscript: string
  recording: boolean
  primaryColor: string
  lessonName: string
  onCopyTranscript: () => void
  onDownloadTranscript: () => void
}

export const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({
  finalTranscript,
  currentTranscript,
  recording,
  primaryColor,
  lessonName,
  onCopyTranscript,
  onDownloadTranscript,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        height: "100%",
        minHeight: 300,
        bgcolor: "#f5f5f5",
        border: `2px solid ${primaryColor}`,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          color: primaryColor,
          fontWeight: "bold",
          mb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TranscribeRounded fontSize="small" />
          תמלול:
        </Box>
        {(finalTranscript || currentTranscript) && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              size="small"
              variant="text"
              startIcon={<ContentCopyRounded fontSize="small" />}
              onClick={onCopyTranscript}
              sx={{
                minWidth: "auto",
                fontSize: "0.75rem",
                color: primaryColor,
                "&:hover": {
                  bgcolor: "rgba(63, 81, 181, 0.1)",
                },
              }}
            >
              העתק
            </Button>
            <Button
              size="small"
              variant="text"
              startIcon={<DownloadRounded fontSize="small" />}
              onClick={onDownloadTranscript}
              sx={{
                minWidth: "auto",
                fontSize: "0.75rem",
                color: primaryColor,
                "&:hover": {
                  bgcolor: "rgba(63, 81, 181, 0.1)",
                },
              }}
            >
              הורד
            </Button>
          </Box>
        )}
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Box sx={{ flexGrow: 1, overflow: "auto" }}>
        <Typography
          variant="body1"
          dir="rtl"
          sx={{
            lineHeight: 1.6,
            fontSize: "1rem",
          }}
        >
          {finalTranscript}
          <span style={{ color: "#666", fontStyle: "italic" }}>{currentTranscript}</span>
          {recording && (
            <Box
              component="span"
              sx={{
                display: "inline-block",
                width: 2,
                height: 20,
                bgcolor: primaryColor,
                ml: 0.5,
                animation: "blink 1s infinite",
              }}
            />
          )}
        </Typography>
      </Box>
    </Paper>
  )
}
