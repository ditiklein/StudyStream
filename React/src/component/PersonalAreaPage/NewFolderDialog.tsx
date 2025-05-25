import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import Swal from "sweetalert2"

import { Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,CircularProgress,Box,IconButton,styled,
} from "@mui/material"
import { FolderOutlined, Close, Error } from "@mui/icons-material"
import type { AppDispatch } from "../FileAndFolderStore/FileStore"
import { addFolder, selectFoldersAndFiles } from "../FileAndFolderStore/FilesSlice"

// Styled components for custom styling
const GradientDialogTitle = styled(DialogTitle)(() => ({
  backgroundColor: "#1976d2",
  color: "white",
  padding: "16px 24px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
}))

const AnimatedIconWrapper = styled(motion.div)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
})

const ErrorMessage = styled(motion.div)(() => ({
  color: "#ef4444",
  fontSize: "0.875rem",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  marginTop: "8px",
}))

// יצירת motion component עבור הכפתור
const MotionButton = motion(Button)

const GradientButton = styled(MotionButton)(() => ({
  backgroundColor: "#1976d2",
  color: "white",
  "&:hover": {
    backgroundColor: "#115293", // גוון כהה יותר לכפתור בעת ריחוף
  },
}))

interface NewFolderDialogProps {
  open: boolean
  onClose: () => void
  onSuccess?: () => void
  parentFolderId: number | null
}

const NewFolderDialog: React.FC<NewFolderDialogProps> = ({ open, onClose, onSuccess, parentFolderId }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [folderName, setFolderName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const storedUser = sessionStorage.getItem("User")
  const user = storedUser ? JSON.parse(storedUser) : null
  const { folders } = useSelector(selectFoldersAndFiles)

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setFolderName("")
      setError("")
    }
  }, [open])

  const handleSubmit = async () => {
    if (!folderName.trim()) {
      setError("אנא הכנס שם תיקייה")
      return
    }

    // בדיקה אם התיקייה קיימת כבר
    const folderExists = folders.some(
      (folder) => folder.name === folderName && folder.parentFolderId === parentFolderId,
    )

    if (folderExists) {
      onClose()
      Swal.fire({
        icon: "error",
        title: "שגיאה",
        text: "שם התיקייה כבר קיים!",
        confirmButtonColor: "#d33",
      })
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await dispatch(
        addFolder({
          name: folderName,
          parentFolderId: parentFolderId,
          ownerId: user.id,
        }),
      ).unwrap()

      setFolderName("")
      setIsSubmitting(false)

      Swal.fire({
        icon: "success",
        title: "התיקייה נוצרה בהצלחה!",
        timer: 1500,
        showConfirmButton: false,
      })

      if (onSuccess) {
        onSuccess()
      } else {
        onClose()
      }
    } catch (err) {
      setError("שגיאה ביצירת התיקייה")
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFolderName("")
    setError("")
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      dir="rtl"
      PaperProps={{
        style: {
          borderRadius: "12px",
          overflow: "hidden",
          maxWidth: "450px",
          width: "100%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        },
        component: motion.div,
        // @ts-ignore - framer-motion props
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { type: "spring", damping: 15 },
      }}
    >
      <GradientDialogTitle>
        <AnimatedIconWrapper
          initial={{ rotate: -20, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", damping: 10, delay: 0.2 }}
        >
          <FolderOutlined fontSize="large" sx={{ color: "#fdd835" }} />
        </AnimatedIconWrapper>
        <span>צור תיקייה חדשה</span>
      </GradientDialogTitle>

      <DialogContent sx={{ padding: "24px", paddingTop: "20px" }}>
        <Box sx={{ position: "relative" }}>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="שם התיקייה"
            type="text"
            fullWidth
            variant="outlined"
            value={folderName}
            onChange={(e) => {
              setFolderName(e.target.value)
              if (error) setError("")
            }}
            error={!!error}
            sx={{mt: 3, mb: 2 }}
            inputProps={{ dir: "rtl" }}
          />
          <AnimatePresence>
            {folderName && (
              <IconButton
                component={motion.button}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                size="small"
                sx={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)" }}
                onClick={() => setFolderName("")}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
          </AnimatePresence>
        </Box>

        <AnimatePresence>
          {error && (
            <ErrorMessage initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <Error fontSize="small" />
              {error}
            </ErrorMessage>
          )}
        </AnimatePresence>
      </DialogContent>

      <DialogActions sx={{ padding: "16px 24px 24px" }}>
        <Button onClick={handleClose} color="inherit" disabled={isSubmitting}>
          ביטול
        </Button>
        <GradientButton
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          sx={{ position: "relative", minWidth: "120px" }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "צור תיקייה"}
          </Box>
        </GradientButton>
      </DialogActions>
    </Dialog>
  )
}

export default NewFolderDialog