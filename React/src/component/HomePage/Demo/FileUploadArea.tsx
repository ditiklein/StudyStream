
import React from 'react';
import { Paper, Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { ProcessingStage } from './useTranscriptionProcess';
import { useFileUpload } from './useFileUpload ';

interface FileUploadAreaProps {
  isLoading: boolean;
  processingStage: ProcessingStage;
  onFileProcess: (file: File) => void;
  hasUsedDemo: boolean;
}

export const FileUploadArea: React.FC<FileUploadAreaProps> = ({
  isLoading,
  processingStage,
  onFileProcess,
  hasUsedDemo
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

  const handleSignupRedirect = () => {
    window.location.href = '/signup';
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

  // אם המשתמש כבר השתמש בדמו
  if (hasUsedDemo) {
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
          bgcolor: 'grey.50',
          border: '2px solid #e0e0e0',
          direction: 'rtl',
          textAlign: 'center'
        }}
      >
        <LockIcon sx={{ fontSize: 70, color: 'warning.main', mb: 2 }} />
        
        <Typography variant="h5" gutterBottom sx={{ color: 'text.primary' }}>
          סיימת את הדמו!
        </Typography>
        
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3, 
            maxWidth: 400,
            direction: 'rtl',
            '& .MuiAlert-message': {
              textAlign: 'right'
            }
          }}
        >
          <Typography variant="body1"display={'flex'} alignItems={'end'}>
            כבר השתמשת בגרסת הניסיון שלנו. 
            כדי להמשיך ולהנות מכל היכולות של המערכת, אנא הירשם.
          </Typography>
        </Alert>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            ההרשמה חינמית ומקנה לך גישה מלאה לכל התכונות
          </Typography>
          
          <Button 
            variant="contained" 
            size="large"
            startIcon={<PersonAddIcon />}
            onClick={handleSignupRedirect}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontSize: '1.1rem'
            }}
          >
            הירשם עכשיו חינם
          </Button>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            ההרשמה לוקחת פחות מדקה
          </Typography>
        </Box>
      </Paper>
    );
  }

  // הטופס הרגיל להעלאת קבצים
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
        direction: 'rtl',
        textAlign: 'center'
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
        <Button variant="outlined" component="label"          sx={{ flexDirection: 'row-reverse' }}
 startIcon={<CloudUploadIcon /> }>
          בחר קובץ
          <input type="file" hidden accept="audio/*,video/*" onChange={handleFileChange} />
        </Button>
        <Button 
          variant="contained" 
          onClick={handleProcessClick}
          startIcon={<DescriptionIcon />}
          disabled={!file}
          sx={{ flexDirection: 'row-reverse' }}

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