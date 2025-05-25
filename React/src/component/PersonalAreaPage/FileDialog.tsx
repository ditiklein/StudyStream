
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  LinearProgress,
  IconButton,
  Paper,
  Grid,
  alpha,
  useTheme,
} from "@mui/material"
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Image as ImageIcon,
  Description as FileTextIcon,
  InsertDriveFile as FileIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material"

interface FileDialogProps {
  open: boolean
  files: File[]
  onClose: () => void
  onConfirm: (files: File[], shouldUpload: boolean, descriptions: string[]) => void;
  uploadProgress: number
}

interface FileWithMetadata {
  file: File
  name: string
  description: string
  preview?: string
}

const FileDialog: React.FC<FileDialogProps> = ({ open, files, onClose, onConfirm, uploadProgress }) => {
  const theme = useTheme()
  const [filesWithMetadata, setFilesWithMetadata] = useState<FileWithMetadata[]>([])

  // Custom theme colors
  const primaryBlue = "#1976d2" // Primary blue color
  const accentPink = "#e91e63" // Accent pink color
  const gradientBackground = `linear-gradient(135deg, ${alpha(primaryBlue, 0.05)} 0%, ${alpha(accentPink, 0.05)} 100%)`
  const headerGradient = `linear-gradient(90deg, ${primaryBlue} 0%, ${accentPink} 100%)`

  useEffect(() => {
    // Initialize files with metadata when files prop changes
    const newFilesWithMetadata = files.map((file) => {
      // Create object URL for image previews
      const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined

      return {
        file,
        name: file.name,
        description: "",
        preview,
      }
    })

    setFilesWithMetadata(newFilesWithMetadata)

    // Cleanup function to revoke object URLs
    return () => {
      newFilesWithMetadata.forEach((item) => {
        if (item.preview) URL.revokeObjectURL(item.preview)
      })
    }
  }, [files])

  const handleNameChange = (index: number, newName: string) => {
    setFilesWithMetadata((prev) => prev.map((item, i) => (i === index ? { ...item, name: newName } : item)))
  }

  const handleDescriptionChange = (index: number, newDescription: string) => {
    setFilesWithMetadata((prev) =>
      prev.map((item, i) => (i === index ? { ...item, description: newDescription } : item)),
    )
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = [...filesWithMetadata]

    // Revoke object URL if it exists
    if (newFiles[index].preview) {
      URL.revokeObjectURL(newFiles[index].preview)
    }

    newFiles.splice(index, 1)
    setFilesWithMetadata(newFiles)

    // Update parent component with new files
    onConfirm(
      newFiles.map((item) => item.file),
      false,
      newFiles.map((item) => item.description)
    )
  }

  const handleConfirm = () => {
    // עכשיו אנחנו מעבירים גם את המערך של התיאורים
    onConfirm(
      filesWithMetadata.map((item) => item.file),
      true,
      filesWithMetadata.map((item) => item.description)
    )
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon sx={{ fontSize: 40, color: primaryBlue }} />
    } else if (file.type.includes("pdf")) {
      return <FileTextIcon sx={{ fontSize: 40, color: accentPink }} />
    } else {
      return <FileIcon sx={{ fontSize: 40, color: alpha(primaryBlue, 0.7) }} />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      dir="rtl"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
          maxHeight: "90vh",
          background: gradientBackground,
        },
      }}
    >
      <DialogTitle
        sx={{
          background: headerGradient,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: 0.5 }}>
          אישור העלאת קבצים
        </Typography>
        <IconButton edge="end" sx={{ color: "white" }} onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: "background.paper" }}>
        <Typography variant="body1" sx={{ mb: 3, fontWeight: 500, color: primaryBlue }}>
          הקבצים הבאים נבחרו להעלאה:
        </Typography>

        {filesWithMetadata.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              px: 2,
              borderRadius: 2,
              bgcolor: alpha(primaryBlue, 0.03),
              border: `1px dashed ${alpha(primaryBlue, 0.3)}`,
            }}
          >
            <UploadIcon sx={{ fontSize: 48, color: alpha(primaryBlue, 0.3), mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              לא נבחרו קבצים
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {filesWithMetadata.map((fileItem, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  bgcolor: "background.paper",
                  border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    boxShadow: `0 4px 12px ${alpha(primaryBlue, 0.1)}`,
                  },
                }}
              >
                <Grid container spacing={3} alignItems="flex-start">
                  {/* File preview/icon */}
                  <Grid item>
                    <Box
                      sx={{
                        width: 90,
                        height: 90,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        borderRadius: 2,
                        overflow: "hidden",
                        bgcolor: alpha(primaryBlue, 0.02),
                        position: "relative",
                      }}
                    >
                      {fileItem.preview ? (
                        <Box
                          component="img"
                          src={fileItem.preview}
                          alt={fileItem.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        getFileIcon(fileItem.file)
                      )}
                    </Box>
                  </Grid>

                  {/* File details */}
                  <Grid item xs>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                        שם הקובץ
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={fileItem.name}
                        onChange={(e) => handleNameChange(index, e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            "&.Mui-focused fieldset": {
                              borderColor: primaryBlue,
                            },
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 500 }}>
                        תיאור
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        size="small"
                        placeholder="הוסף תיאור לקובץ זה..."
                        value={fileItem.description}
                        onChange={(e) => handleDescriptionChange(index, e.target.value)}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1.5,
                            "&.Mui-focused fieldset": {
                              borderColor: primaryBlue,
                            },
                          },
                        }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: alpha(primaryBlue, 0.8),
                          bgcolor: alpha(primaryBlue, 0.05),
                          py: 0.5,
                          px: 1,
                          borderRadius: 5,
                          fontWeight: 500,
                        }}
                      >
                        {formatFileSize(fileItem.file.size)}
                      </Typography>
                      
                      <Typography
                        variant="caption"
                        sx={{
                          color: alpha(accentPink, 0.8),
                          bgcolor: alpha(accentPink, 0.05),
                          py: 0.5,
                          px: 1,
                          borderRadius: 5,
                          ml: 1,
                          fontWeight: 500,
                        }}
                      >
                        {fileItem.file.type.split("/")[1]?.toUpperCase() || "קובץ"}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* Remove button */}
                  <Grid item>
                    <IconButton
                      onClick={() => handleRemoveFile(index)}
                      size="small"
                      sx={{
                        color: alpha(theme.palette.text.secondary, 0.7),
                        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        borderRadius: 1.5,
                        p: 1,
                        "&:hover": {
                          color: accentPink,
                          bgcolor: alpha(accentPink, 0.05),
                        },
                      }}
                      title="הסר קובץ"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        )}

        {/* Upload progress */}
        {uploadProgress > 0 && (
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 3,
              borderRadius: 2,
              bgcolor: alpha(primaryBlue, 0.03),
              border: `1px solid ${alpha(primaryBlue, 0.1)}`,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5, alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <UploadIcon sx={{ color: primaryBlue, mr: 1, fontSize: 20 }} />
                <Typography variant="body2" sx={{ fontWeight: 500, color: primaryBlue }}>
                  מתבצעת העלאה
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: primaryBlue }}>
                {uploadProgress}%
              </Typography>
            </Box>
            <Box sx={{ position: "relative", mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: alpha(primaryBlue, 0.1),
                  "& .MuiLinearProgress-bar": {
                    background: headerGradient,
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Paper>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 2.5,
          bgcolor: "#f5f5f5", // סולידי במקום שקוף
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Button
          onClick={onClose}
          color="inherit"
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 3,
            borderColor: theme.palette.divider,
            color: theme.palette.text.primary,
            bgcolor: "white",
            "&:hover": {
              borderColor: theme.palette.divider,
              bgcolor: "#f0f0f0",
            },
          }}
        >
          ביטול
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={filesWithMetadata.length === 0 || uploadProgress > 0}
          startIcon={uploadProgress > 0 ? null : <UploadIcon />}
          endIcon={uploadProgress > 0 ? null : <CheckCircleIcon sx={{ ml: 0.5 }} />}
          sx={{
            borderRadius: 2,
            px: 3,
            background: headerGradient,
            boxShadow: `0 4px 12px ${alpha(primaryBlue, 0.3)}`,
            "&:hover": {
              background: headerGradient,
              boxShadow: `0 6px 16px ${alpha(primaryBlue, 0.4)}`,
              opacity: 0.9,
            },
            "&.Mui-disabled": {
              bgcolor: "#bdbdbd",
              color: "white",
              opacity: 0.7,
            },
          }}
        >
          {uploadProgress > 0 ? "מעלה..." : "העלאה"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default FileDialog
