import  { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  Tooltip,
  Chip,
  Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import SummarizeIcon from "@mui/icons-material/Summarize";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface ShowSummaryProps {
  summaryText: string;
  lessonName: string;
  onClose: () => void;
  onDownload?: () => void;
}

const ShowSummary: React.FC<ShowSummaryProps> = ({
  summaryText,
  lessonName,
  onClose,
  onDownload,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const delay = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(delay);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // מפצל את הטקסט לפסקאות
  const paragraphs = summaryText
    .split(/\n\n+/)
    .filter(p => p.trim().length > 0);

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <Box
          onClick={onClose}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.85)",
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              width: "800px",
              maxWidth: "100%",
              maxHeight: "90vh",
              position: "relative",
              boxShadow: 10,
              overflow: "hidden",
              display: "flex",
            }}
          >
            {/* סרגל כפתורים בצד שמאל */}
            <Box
              sx={{
                width: "60px",
                backgroundColor: "#f5f5f5",
                borderRight: "1px solid #ccc",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                pt: 2,
                gap: 1,
              }}
            >
              {onDownload && (
                <Tooltip title="הורד כקובץ טקסט" placement="right">
                  <IconButton onClick={onDownload}>
                    <FileDownloadOutlinedIcon />
                  </IconButton>
                </Tooltip>
              )}
              <Tooltip title="העתק הכל" placement="right">
                <IconButton onClick={handleCopy}>
                  <ContentCopyIcon color={copied ? "success" : "inherit"} />
                </IconButton>
              </Tooltip>
              <Tooltip title="סגור" placement="right">
                <IconButton onClick={onClose}>
                  <CloseIcon sx={{ color: "red" }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* תוכן המסמך */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '90vh',
              }}
            >
              <Box
                sx={{
                  p: 3,
                  borderBottom: '1px solid #eee',
                  backgroundColor: '#f9f9f9',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SummarizeIcon sx={{ mr: 1, color: '#4361ee' }} />
                  <Typography variant="h5" fontWeight="bold">
                    סיכום השיעור
                  </Typography>
                </Box>
                <Typography variant="subtitle1" color="text.secondary">
                  {lessonName}
                </Typography>
                <Chip 
                  label={`${paragraphs.length} פסקאות`} 
                  size="small" 
                  sx={{ mt: 1, bgcolor: '#4361ee20', color: '#4361ee' }} 
                />
                {copied && (
                  <Chip 
                    label="הועתק!" 
                    size="small" 
                    color="success" 
                    sx={{ mt: 1, ml: 1 }} 
                  />
                )}
              </Box>
              
              <Box
                sx={{
                  p: 3,
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                {paragraphs.map((paragraph, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      borderRadius: 2,
                      border: '1px solid #eee'
                    }}
                  >
                    <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                      {paragraph}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ShowSummary;