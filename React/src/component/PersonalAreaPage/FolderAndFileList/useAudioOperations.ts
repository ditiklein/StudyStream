"use client"

import { useState } from "react"
import Swal from "sweetalert2"
import api from "../../FileAndFolderStore/Api"

export const useAudioOperations = () => {
  const [openAudioModal, setOpenAudioModal] = useState<boolean>(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [openAudioEditModal, setOpenAudioEditModal] = useState<boolean>(false)
  const [audioEditUrl, setAudioEditUrl] = useState<string | null>(null)
  const [audioEditFileName, setAudioEditFileName] = useState<string>("")

  const handlePlayAudio = async (name: string) => {
    try {
      const downloadResponse = await api.get<string>(`/upload/download-url/${name}`)

      if (downloadResponse?.data) {
        setAudioUrl(downloadResponse.data)
        setOpenAudioModal(true)
      } else {
        throw new Error("Invalid response")
      }
    } catch (error) {
      console.error("שגיאה בהפעלת קובץ שמע:", error)
      await Swal.fire({
        icon: "error",
        title: "שגיאה",
        text: "אירעה שגיאה בעת ניסיון להפעיל את קובץ השמע",
        confirmButtonText: "אישור",
      })
    }
  }

  const handleEditAudio = async (fileName: string) => {
    try {
      const downloadResponse = await api.get<string>(`/upload/download-url/${fileName}`)

      if (downloadResponse?.data) {
        setAudioEditUrl(downloadResponse.data)
        setAudioEditFileName(fileName)
        setOpenAudioEditModal(true)
      } else {
        throw new Error("Invalid response")
      }
    } catch (error) {
      console.error("שגיאה בפתיחת עריכת קובץ שמע:", error)
      await Swal.fire({
        icon: "error",
        title: "שגיאה",
        text: "אירעה שגיאה בעת ניסיון לפתוח את קובץ השמע לעריכה",
        confirmButtonText: "אישור",
      })
    }
  }

  return {
    openAudioModal,
    setOpenAudioModal,
    audioUrl,
    openAudioEditModal,
    setOpenAudioEditModal,
    audioEditUrl,
    audioEditFileName,
    handlePlayAudio,
    handleEditAudio,
  }
}
