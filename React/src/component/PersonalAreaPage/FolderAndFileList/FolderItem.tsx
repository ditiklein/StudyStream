"use client"

import type React from "react"
import { Box, Grid, TextField, IconButton } from "@mui/material"
import LongMenu from "../Menu"
import { FolderImage, FolderImageContainer, ItemName, ItemWrapper } from "./FolderAndFileStyle"
import { Folder } from "../../../Modles/Folder"
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';


interface FolderItemProps {
  folder: Folder
  folderImagePath: string
  currentFolder: number | null
  editingFolderId: number | null
  newFolderName: string
  onFolderClick: (folderId: number, folderName: string) => void
  onStartEditing: (folderId: number, currentName: string) => void
  onSaveName: (id: number) => void
  onCancelEditing: () => void
  onNameChange: (name: string) => void
  onKeyDown: (e: React.KeyboardEvent, id: number) => void
}

export const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  folderImagePath,
  currentFolder,
  editingFolderId,
  newFolderName,
  onFolderClick,
  onStartEditing,
  onSaveName,
  onCancelEditing,
  onNameChange,
  onKeyDown,
}) => {
  const isEditing = editingFolderId === folder.id

  const handleFolderClick = () => {
    if (isEditing) return
    onFolderClick(folder.id, folder.name || "")
  }

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
          <LongMenu
            id={folder.id}
            onEdit={() => onStartEditing(folder.id, folder.name || "")}
            folder={folder}
            currentFolder={currentFolder}
          />
        </Box>

        <ItemWrapper onClick={handleFolderClick}>
          <FolderImageContainer>
            <FolderImage src={folderImagePath} alt="תיקייה" />
          </FolderImageContainer>

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
                    onSaveName(folder.id)
                  }}
                  color="primary"
                  sx={{ padding: "2px" }}
                  aria-label="שמור שם תיקייה"
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
                value={newFolderName}
                onChange={(e) => onNameChange(e.target.value)}
                onKeyDown={(e) => onKeyDown(e, folder.id)}
                variant="outlined"
                size="small"
                autoFocus
                fullWidth
                onClick={(e) => e.stopPropagation()}
                aria-label="עריכת שם תיקייה"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px",
                    height: "32px",
                  },
                }}
              />
            </Box>
          ) : (
            <ItemName variant="body2">{folder.name}</ItemName>
          )}
        </ItemWrapper>
      </Box>
    </Grid>
  )
}
