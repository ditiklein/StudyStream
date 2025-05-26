"use client"

import type React from "react"
import { Box, Grid, TextField, IconButton } from "@mui/material"
import { Lesson } from "../../../Modles/File"
import FileMenu from "../MenuFile"
import { FileContainer, FileImage, ItemName, ItemWrapper } from "./FolderAndFileStyle"
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface FileItemProps {
  file: Lesson
  fileImagePath: string
  currentFolder: number | null
  editingFileId: number | null
  newFileName: string
  onEdit: (fileId: number) => void
  onDownload: (fileName: string) => void
  onPlayAudio: (fileName: string) => void
  onEditAudio: (fileName: string) => void
  onSaveName: (fileId: number) => void
  onCancelEditing: () => void
  onNameChange: (name: string) => void
  onKeyDown: (e: React.KeyboardEvent, file: Lesson) => void
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  fileImagePath,
  currentFolder,
  editingFileId,
  newFileName,
  onEdit,
  onDownload,
  onPlayAudio,
  onEditAudio,
  onSaveName,
  onCancelEditing,
  onNameChange,
  onKeyDown,
}) => {
  const isEditing = editingFileId === file.id
  const displayName = file.urlName ? file.urlName.replace(/\.[^/.]+$/, "") : file.lessonName

  return (
    <Grid item xs={6} sm={4} md={3} lg={2}>
      <Box
        sx={{
          position: "relative",
          "&:hover .menu-icon": { display: "block" },
        }}
      >
        <Box
          className="menu-icon"
          sx={{
            position: "absolute",
            top: "5px",
            right: "5px",
            zIndex: 10,
            display: "none",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <FileMenu
            id={file.id}
            onEdit={() => onEdit(file.id)}
            onUpload={() => onDownload(file.lessonName || "")}
            onPlayAudio={() => onPlayAudio(file.lessonName || "")}
            onEditAudio={() => onEditAudio(file.lessonName || "")}
            file={file}
            currentFolder={currentFolder}
          />
        </Box>

        <ItemWrapper>
          <FileContainer>
            <FileImage src={fileImagePath} alt={file.lessonName || "קובץ"} />
          </FileContainer>

          {isEditing ? (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                mt: 1,
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: -20,
                  left: 0,
                  display: "flex",
                  zIndex: 1,
                }}
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSaveName(file.id)
                  }}
                  color="primary"
                  sx={{ padding: "2px" }}
                  aria-label="שמור שם קובץ"
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation()
                    onCancelEditing()
                  }}
                  color="error"
                  sx={{ padding: "2px" }}
                  aria-label="בטל עריכה"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
              <TextField
                value={newFileName}
                onChange={(e) => onNameChange(e.target.value)}
                onKeyDown={(e) => onKeyDown(e, file)}
                variant="outlined"
                size="small"
                autoFocus
                fullWidth
                onClick={(e) => e.stopPropagation()}
                aria-label="עריכת שם קובץ"
                sx={{
                  direction: "rtl",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px",
                    height: "32px",
                  },
                }}
              />
            </Box>
          ) : (
            <ItemName variant="body2">{displayName}</ItemName>
          )}
        </ItemWrapper>
      </Box>
    </Grid>
  )
}
