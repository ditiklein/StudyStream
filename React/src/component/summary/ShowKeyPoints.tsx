import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import StarIcon from "@mui/icons-material/Star";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface ShowKeyPointsProps {
  keyPointsText: string;
  lessonName: string;
  onClose: () => void;
  onDownload?: () => void;
}

const ShowKeyPoints: React.FC<ShowKeyPointsProps> = ({
  keyPointsText,
  lessonName,
  onClose,
  onDownload,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    // Parse key points from text
    const points = keyPointsText
      .split(/\n+/)
      .filter(point => point.trim().length > 0)
      .map(point => point.trim().replace(/^\d+[\.\)]\s*/, ''));
    
    setKeyPoints(points);
    
    const delay = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(delay);
  }, [keyPointsText]);

  const handleCopy = (index: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

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
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  נקודות חשובות
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {lessonName}
                </Typography>
                <Chip 
                  label={`${keyPoints.length} נקודות`} 
                  size="small" 
                  sx={{ mt: 1, bgcolor: '#4361ee20', color: '#4361ee' }} 
                />
              </Box>
              
              <Box
                sx={{
                  p: 3,
                  overflowY: "auto",
                  flex: 1,
                }}
              >
                <List>
                  {keyPoints.map((point, index) => (
                    <React.Fragment key={index}>
                      <ListItem 
                        alignItems="flex-start"
                        sx={{ 
                          py: 2,
                          backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa',
                          borderRadius: 1,
                          mb: 1
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: '40px' }}>
                          <StarIcon sx={{ color: '#f72585' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={point}
                        />
                        <Tooltip title={copied === index ? "הועתק!" : "העתק נקודה"}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleCopy(index, point)}
                            sx={{ 
                              ml: 1,
                              color: copied === index ? 'green' : 'inherit'
                            }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ShowKeyPoints;