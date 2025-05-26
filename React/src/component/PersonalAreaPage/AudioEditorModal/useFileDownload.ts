"use client"

import Swal from "sweetalert2"
import api from "../../FileAndFolderStore/Api"

export const useFileDownload = () => {
  const handleFileDownload = async (fileName: string) => {
    try {
      const a = document.createElement("a")
      const downloadResponse = await api.get<string>(`/upload/download-url/${fileName}`)

      if (!downloadResponse.data) {
        throw new Error("Invalid download URL")
      }

      a.href = downloadResponse.data
      a.download = fileName
      a.click()

      // Clean up
      a.remove()
    } catch (error) {
      console.error("שגיאה בהורדת קובץ:", error)
      await Swal.fire({
        icon: "error",
        title: "שגיאה בהורדת הקובץ",
        text: "אירעה שגיאה בעת ניסיון להוריד את הקובץ. נסה שנית.",
        confirmButtonText: "אישור",
      })
    }
  }

  return {
    handleFileDownload,
  }
}
