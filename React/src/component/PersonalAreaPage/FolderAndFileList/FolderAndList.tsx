"use client"

import type React from "react"
import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Box, Typography, CircularProgress, Grid } from "@mui/material"
import { fetchRootFolders, fetchSubFoldersAndFiles, searchFiles, searchFolders, selectFoldersAndFiles } from "../../FileAndFolderStore/FilesSlice"
import { AppDispatch } from "../../FileAndFolderStore/FileStore"
import { EmptyState } from "./FolderAndFileStyle"
import { FolderItem } from "./FolderItem"
import { FileItem } from "./FileItem"
import AudioModal from "../AudioModel"
import { useAudioOperations } from "./useAudioOperations"
import { useFolderFileOperations } from "./useFolderFileOperations"
import Swal from "sweetalert2"
import api from "../../FileAndFolderStore/Api"
import AudioEditModal from "../AudioEditorModal/audio-edit-modal-refactored"

interface FolderAndFileListProps {
  currentFolderId: number | null
  onFolderClick: (folderId: number, folderName: string) => void
  folderImagePath?: string
  fileImagePath?: string
  currentFolder: number | null
  isSearchMode?: boolean
  searchQuery?: string
}

const FolderAndFileList: React.FC<FolderAndFileListProps> = ({
  currentFolderId,
  onFolderClick,
  folderImagePath = "/f.png",
  fileImagePath = "/e.png",
  currentFolder,
  isSearchMode = false,
  searchQuery = "",
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const { folders, files, searchFoldersResults, searchFilesResults, loading, error } =
    useSelector(selectFoldersAndFiles)

  // Get user from session storage
  const user = useMemo(() => {
    const storedUser = sessionStorage.getItem("User")
    return storedUser ? JSON.parse(storedUser) : null
  }, [])

  // Custom hooks for operations
  const folderFileOps = useFolderFileOperations({
    currentFolderId,
    userId: user?.id,
    folders,
    files,
  })

  const audioOps = useAudioOperations()
const handleFileDownload = async (fileName: string) => {
  try {
    const a = document.createElement('a');
    const downloadResponse = await api.get<string>(`/upload/download-url/${fileName}`);
    a.href = downloadResponse.data;
    a.download = fileName;
    a.click();
  } catch (error) {
    console.error("שגיאה בהורדת קובץ:", error);
    Swal.fire({
      icon: 'error',
      title: 'שגיאה בהורדת הקובץ',
      text: 'אירעה שגיאה בעת ניסיון להוריד את הקובץ. נסה שנית.',
      confirmButtonText: 'אישור'
    });
  }
};
  // Determine which data to display
  const displayFolders = isSearchMode ? searchFoldersResults : folders
  const displayFiles = isSearchMode ? searchFilesResults : files

  // Data fetching effect
  useEffect(() => {
    if (!user?.id) return

    if (isSearchMode && searchQuery.trim() !== "") {
      dispatch(
        searchFolders({
          userId: user.id,
          currentFolderId,
          query: searchQuery,
        }),
      )

      dispatch(
        searchFiles({
          userId: user.id,
          currentFolderId,
          query: searchQuery,
        }),
      )
    } else if (!isSearchMode) {
      if (currentFolderId === null) {
        dispatch(fetchRootFolders(user.id))
      } else {
        dispatch(
          fetchSubFoldersAndFiles({
            parentFolderId: currentFolderId,
            ownerId: user.id,
          }),
        )
      }
    }
  }, [dispatch, currentFolderId, user?.id, isSearchMode, searchQuery])

  // Event handlers
  const handleFolderKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === "Enter") {
      folderFileOps.saveNewFolderName(id)
    } else if (e.key === "Escape") {
      folderFileOps.cancelEditingFolder()
    }
  }

  const handleFileKeyDown = (e: React.KeyboardEvent, file: any) => {
    if (e.key === "Enter") {
      folderFileOps.saveNewFileName(file.id)
    } else if (e.key === "Escape") {
      folderFileOps.cancelEditingFile()
    }
  }

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress aria-label="טוען..." />
      </Box>
    )
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 3, color: "error.main" }} role="alert">
        <Typography>{error}</Typography>
      </Box>
    )
  }

  // Empty state
  if (displayFolders.length === 0 && displayFiles.length === 0) {
    return (
      <EmptyState>
        {isSearchMode ? (
          <Typography variant="body1" sx={{ mb: 1 }}>
            לא נמצאו תוצאות עבור "{searchQuery}"
          </Typography>
        ) : (
          <>
            <Typography variant="body1" sx={{ mb: 1 }}>
              התיקייה ריקה
            </Typography>
            <Typography variant="body2">צור תיקייה חדשה או העלה קבצים כדי להתחיל</Typography>
          </>
        )}
      </EmptyState>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Folders Section */}
      {displayFolders.length > 0 && (
        <Box sx={{ mb: 4 }} role="region" aria-label="תיקיות">
          <Typography variant="h6" sx={{ mb: 2 }}>
            תיקיות
          </Typography>
          <Grid container spacing={2}>
            {displayFolders.map((folder) => (
              <FolderItem
                key={folder.id}
                folder={folder}
                folderImagePath={folderImagePath}
                currentFolder={currentFolder}
                editingFolderId={folderFileOps.editingFolderId}
                newFolderName={folderFileOps.newFolderName}
                onFolderClick={onFolderClick}
                onStartEditing={folderFileOps.startEditingFolder}
                onSaveName={folderFileOps.saveNewFolderName}
                onCancelEditing={folderFileOps.cancelEditingFolder}
                onNameChange={folderFileOps.setNewFolderName}
                onKeyDown={handleFolderKeyDown}
              />
            ))}
          </Grid>
        </Box>
      )}

      {/* Files Section */}
      {displayFiles.length > 0 && (
        <Box role="region" aria-label="קבצים">
          <Typography variant="h6" sx={{ mb: 2 }}>
            קבצים
          </Typography>
          <Grid container spacing={2}>
            {displayFiles.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                fileImagePath={fileImagePath}
                currentFolder={currentFolder}
                editingFileId={folderFileOps.editingFileId}
                newFileName={folderFileOps.newFileName}
                onEdit={folderFileOps.startEditingFile}
                onDownload={handleFileDownload}
                onPlayAudio={audioOps.handlePlayAudio}
                onEditAudio={audioOps.handleEditAudio}
                onSaveName={folderFileOps.saveNewFileName}
                onCancelEditing={folderFileOps.cancelEditingFile}
                onNameChange={folderFileOps.setNewFileName}
                onKeyDown={handleFileKeyDown}
              />
            ))}
          </Grid>
        </Box>
      )}

      {/* Audio Modals */}
      <AudioModal
        open={audioOps.openAudioModal}
        onClose={() => audioOps.setOpenAudioModal(false)}
        audioUrl={audioOps.audioUrl}
      />

      <AudioEditModal
        open={audioOps.openAudioEditModal}
        onClose={() => audioOps.setOpenAudioEditModal(false)}
        audioUrl={audioOps.audioEditUrl}
        fileName={audioOps.audioEditFileName}
      />
    </Box>
  )
}

export default FolderAndFileList
