"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import Swal from "sweetalert2"
import { Lesson } from "../../../Modles/File"
import { Folder } from "../../../Modles/Folder"
import { AppDispatch } from "../../FileAndFolderStore/FileStore"
import { fetchRootFolders, fetchSubFoldersAndFiles, updateFile, updateFolder } from "../../FileAndFolderStore/FilesSlice"

interface UseFolderFileOperationsProps {
  currentFolderId: number | null
  userId: number
  folders: Folder[]
  files: Lesson[]
}

export const useFolderFileOperations = ({ currentFolderId, userId, folders, files }: UseFolderFileOperationsProps) => {
  const dispatch = useDispatch<AppDispatch>()

  // Folder editing state
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null)
  const [newFolderName, setNewFolderName] = useState<string>("")

  // File editing state
  const [editingFileId, setEditingFileId] = useState<number | null>(null)
  const [newFileName, setNewFileName] = useState<string>("")

  const startEditingFolder = (folderId: number, currentName: string) => {
    setEditingFolderId(folderId)
    setNewFolderName(currentName)
  }

  const saveNewFolderName = async (id: number) => {
    if (!editingFolderId || !newFolderName.trim()) return

    const isNameTaken = folders.some((folder) => folder.id !== id && folder.name === newFolderName.trim())

    if (isNameTaken) {
      await Swal.fire({
        icon: "error",
        title: "שגיאה",
        text: "שם התיקייה כבר קיים!",
        confirmButtonText: "אישור",
      })
      return
    }

    try {
      await dispatch(
        updateFolder({
          id,
          name: newFolderName.trim(),
          ownerId: userId,
          parentFolderId: currentFolderId,
        }),
      ).unwrap()

      // Refresh data
      if (currentFolderId === null) {
        dispatch(fetchRootFolders(userId))
      } else {
        dispatch(fetchSubFoldersAndFiles({ parentFolderId: currentFolderId, ownerId: userId }))
      }

      setEditingFolderId(null)
      setNewFolderName("")
    } catch (error) {
      console.error("שגיאה בעדכון שם התיקייה:", error)
      await Swal.fire({
        icon: "error",
        title: "שגיאה",
        text: "אירעה שגיאה בעת עדכון שם התיקייה",
        confirmButtonText: "אישור",
      })
    }
  }

  const cancelEditingFolder = () => {
    setEditingFolderId(null)
    setNewFolderName("")
  }

  const startEditingFile = (fileId: number) => {
    const fileToEdit = files.find((file) => file.id === fileId)
    if (fileToEdit?.lessonName) {
      setEditingFileId(fileId)
      const fileNameWithoutExtension = fileToEdit.lessonName.replace(/\.[^/.]+$/, "")
      setNewFileName(fileNameWithoutExtension)
    }
  }

  const saveNewFileName = async (_fileId: number) => {
    if (!editingFileId || !newFileName.trim()) return

    const currentFile = files.find((f) => f.id === editingFileId)
    if (!currentFile) {
      console.error("לא נמצא הקובץ לעריכה")
      return
    }

    const fileExtension = currentFile.urlName?.includes(".")
      ? currentFile.urlName.substring(currentFile.urlName.lastIndexOf("."))
      : ""

    const finalFileName = newFileName.includes(".") ? newFileName : newFileName + fileExtension

    try {
      await dispatch(
        updateFile({
          id: currentFile.id,
          lessonName: finalFileName,
          folderId: currentFolderId,
          ownerId: userId,
          fileType: currentFile.fileType || "",
          url: currentFile.urlName || "",
          isDeleted: currentFile.isDeleted,
        }),
      ).unwrap()

      // Refresh data
      if (currentFolderId === null) {
        dispatch(fetchRootFolders(userId))
      } else {
        dispatch(fetchSubFoldersAndFiles({ parentFolderId: currentFolderId, ownerId: userId }))
      }

      setEditingFileId(null)
      setNewFileName("")
    } catch (error) {
      console.error("שגיאה בעדכון שם הקובץ:", error)
      await Swal.fire({
        icon: "error",
        title: "שגיאה",
        text: "אירעה שגיאה בעת עדכון שם הקובץ",
        confirmButtonText: "אישור",
      })
    }
  }

  const cancelEditingFile = () => {
    setEditingFileId(null)
    setNewFileName("")
  }

  return {
    // Folder operations
    editingFolderId,
    newFolderName,
    setNewFolderName,
    startEditingFolder,
    saveNewFolderName,
    cancelEditingFolder,

    // File operations
    editingFileId,
    newFileName,
    setNewFileName,
    startEditingFile,
    saveNewFileName,
    cancelEditingFile,
  }
}
