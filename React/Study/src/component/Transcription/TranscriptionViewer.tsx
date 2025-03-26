import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Download as DownloadIcon,
  Save as SaveIcon,
  Mic as MicIcon
} from '@mui/icons-material';
import * as signalR from '@microsoft/signalr';

// הגדרת ממשקים
interface Lesson {
  lessonName: string;
  url?: string;
}

interface TranscriptionViewerProps {
  selectedLesson?: Lesson | null;
}

const TranscriptionViewer: React.FC<TranscriptionViewerProps> = ({ selectedLesson }) => {
  const [transcriptionText, setTranscriptionText] = useState<string>('');
  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('info');

  useEffect(() => {
    // יצירת חיבור SignalR
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7147/transcriptionHub")
      .withAutomaticReconnect()
      .build();

    newConnection.on("Connected", (connectionId: string) => {
      setConnectionId(connectionId);
      console.log("Connected with ID:", connectionId);
    });

    newConnection.on("ReceiveTranscription", (data: { text: string }) => {
      setTranscriptionText(prev => prev + " " + data.text);
    });

    newConnection.on("TranscriptionComplete", (message: string) => {
      showSnackbar(message, 'success');
    });

    newConnection.on("TranscriptionError", (errorMessage: string) => {
      showSnackbar(errorMessage, 'error');
    });

    newConnection.start()
      .then(() => {
        setConnection(newConnection);
        showSnackbar('חיבור הושלם', 'success');
      })
      .catch(err => {
        console.error('SignalR Connection Error:', err);
        showSnackbar('שגיאה בהתחברות', 'error');
      });

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleTranscription = async () => {
    if (!selectedLesson || !selectedLesson.url) {
      showSnackbar('לא נבחר קובץ שמע', 'error');
      return;
    }
  
    try {
      const response = await fetch(selectedLesson.url);
      const blob = await response.blob();
      
      const formData = new FormData();
      formData.append('audioFile', blob, selectedLesson.lessonName);

      const uploadResponse = await fetch(`https://localhost:7147/api/AudioTranscription/upload?connectionId=${connectionId}`, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('שגיאה בשליחת הקובץ');
      }

      await uploadResponse.json();
      showSnackbar('הקובץ נשלח לתמלול', 'success');
    } catch (error) {
      console.error('Error:', error);
      showSnackbar('שגיאה בתמלול', 'error');
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const removeFileExtension = (filename: string): string => {
    return filename.split('.').slice(0, -1).join('.');
  };

  return (
    <Box sx={{ width: '100%', py: 4 }}>
      {selectedLesson && (
        <Container 
          maxWidth="md" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            mb: 4,
            gap: 2 
          }}
        >
          <Typography
            variant="h3"
            sx={{
              background: 'linear-gradient(45deg, #FF69B4, #1E90FF, #40E0D0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
              textAlign: 'center'
            }}
          >
            {removeFileExtension(selectedLesson.lessonName)}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<MicIcon />}
            onClick={handleTranscription}
            sx={{ 
              textTransform: 'none',
              bgcolor: '#1E90FF', 
              '&:hover': {
                bgcolor: '#1565c0'
              }
            }}
          >
            תמלול
          </Button>
        </Container>
      )}

      <Container maxWidth="md" sx={{ position: 'relative' }}>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity} 
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default TranscriptionViewer;
