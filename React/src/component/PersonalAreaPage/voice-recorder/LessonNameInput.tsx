"use client"

import type React from "react"

import { TextField } from "@mui/material"

interface LessonNameInputProps {
  lessonName: string
  onChange: (name: string) => void
}

export const LessonNameInput: React.FC<LessonNameInputProps> = ({ lessonName, onChange }) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      label="שם השיעור"
      value={lessonName}
      onChange={(e) => onChange(e.target.value)}
      dir="rtl"
      sx={{ mb: 3 }}
      InputProps={{
        sx: { borderRadius: 2 },
      }}
    />
  )
}
