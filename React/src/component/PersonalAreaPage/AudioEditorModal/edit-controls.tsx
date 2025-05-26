"use client"

import type React from "react"
import { Box, Button, TextField, Typography } from "@mui/material"
import { ContentCut, Delete } from "@mui/icons-material"

interface EditControlsProps {
  editMode: "cut" | "delete"
  startTime: number
  endTime: number
  duration: number
  isLoading: boolean
  canExecuteEdit: boolean|null
  onEditModeChange: (mode: "cut" | "delete") => void
  onStartTimeChange: (time: number) => void
  onEndTimeChange: (time: number) => void
  onExecuteEdit: () => void
}

export const EditControls: React.FC<EditControlsProps> = ({
  editMode,
  startTime,
  endTime,
  duration,
  isLoading,
  canExecuteEdit,
  onEditModeChange,
  onStartTimeChange,
  onEndTimeChange,
  onExecuteEdit,
}) => {
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) {
      return "0:00"
    }
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(Number.parseFloat(event.target.value) || 0, endTime))
    onStartTimeChange(value)
  }

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(startTime, Math.min(Number.parseFloat(event.target.value) || duration, duration))
    onEndTimeChange(value)
  }

  return (
    <Box
      sx={{
        border: "2px solid #e3f2fd",
        borderRadius: 2,
        p: 3,
        bgcolor: "#f8f9fa",
        height: "fit-content",
      }}
    >
      <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600, color: "primary.main" }}>
        עריכת שמע
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          בחר פעולה:
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant={editMode === "cut" ? "contained" : "outlined"}
            onClick={() => onEditModeChange("cut")}
            size="small"
            sx={{ flex: 1, py: 1 }}
          >
            חיתוך
          </Button>
          <Button
            variant={editMode === "delete" ? "contained" : "outlined"}
            onClick={() => onEditModeChange("delete")}
            size="small"
            color="error"
            sx={{ flex: 1, py: 1 }}
          >
            מחיקה
          </Button>
        </Box>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          הגדרות זמן:
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="התחלה"
            type="number"
            value={startTime.toFixed(1)}
            onChange={handleStartTimeChange}
            inputProps={{
              min: 0,
              max: duration,
              step: 0.1,
            }}
            size="small"
            sx={{ flex: 1 }}
          />
          <TextField
            label="סיום"
            type="number"
            value={endTime.toFixed(1)}
            onChange={handleEndTimeChange}
            inputProps={{
              min: 0,
              max: duration,
              step: 0.1,
            }}
            size="small"
            sx={{ flex: 1 }}
          />
        </Box>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          נבחר: {formatTime(endTime - startTime)} ({(((endTime - startTime) / duration) * 100).toFixed(1)}%)
        </Typography>
      </Box>

      <Button
        variant="contained"
        onClick={onExecuteEdit}
        startIcon={editMode === "cut" ? <ContentCut /> : <Delete />}
        disabled={isLoading || !canExecuteEdit}
        fullWidth
        size="medium"
        sx={{ py: 1.5 }}
        color={editMode === "cut" ? "primary" : "error"}
      >
        {editMode === "cut" ? "חתוך שמע" : "מחק קטע"}
      </Button>
    </Box>
  )
}
