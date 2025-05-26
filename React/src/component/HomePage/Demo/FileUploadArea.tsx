import React from 'react';
import { Paper, Box, Typography, Button, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import { ProcessingStage } from './useTranscriptionProcess';
import { useFileUpload } from './useFileUpload ';

interface FileUploadAreaProps {
  isLoading: boolean;
  processingStage: ProcessingStage;
  onFileProcess: (file: File) => void;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  isLoading,
  processingStage,
  onFileProcess
}) => {
  const {
    file,
    fileName,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileChange,
    validateFile
  } = useFileUpload();

  const handleProcessClick = () => {
    if (validateFile() && file) {
      onFileProcess(file);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          {processingStage}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          תהליך זה עשוי להימשך מספר רגעים
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        minHeight: 350,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
        bgcolor: dragActive ? 'rgba(25, 118, 210, 0.05)' : 'white',
        transition: 'all 0.3s ease',
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <CloudUploadIcon sx={{ fontSize: 70, color: 'primary.main', mb: 2 }} />
      <Typography variant="h5" textAlign="center" gutterBottom>
        {fileName ? `הקובץ "${fileName}" נבחר` : 'גרור ושחרר קובץ שמע'}
      </Typography>
      <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
        או לחץ על הכפתור למטה כדי לבחור קובץ
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
          בחר קובץ
          <input type="file" hidden accept="audio/*,video/*" onChange={handleFileChange} />
        </Button>
        <Button 
          variant="contained" 
          onClick={handleProcessClick}
          startIcon={<DescriptionIcon />}
          disabled={!file}
        >
          עבד את הקובץ
        </Button>
      </Box>
      {fileName && (
        <Typography variant="body2" sx={{ mt: 2, color: 'success.main' }}>
          הקובץ מוכן להעלאה ותמלול
        </Typography>
      )}
    </Paper>
  );
};

