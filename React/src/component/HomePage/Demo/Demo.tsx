import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert
} from '@mui/material';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { selectKeyPoints } from '../../FileAndFolderStore/KeyPointsSlice';
import { useTranscriptionProcess } from './useTranscriptionProcess';
import { TranscriptionResults } from './TranscriptionResults';
import { FileUploadArea } from './FileUploadArea';
import { DEMO_STEPS, DemoStep } from './DemoSteps';
const Demo: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const keyPointsState = useSelector(selectKeyPoints);
  const {
    isLoading,
    processingStage,
    transcriptionResult,
    error,
    processFile,
    clearError
  } = useTranscriptionProcess();

  const handleNewTranscription = () => {
    Swal.fire({
      title: 'הירשם עכשיו!',
      text: 'אתה צריך לפתוח אזור אישי אצלנו בשביל להמשיך להנות מהיכולות שלנו',
      icon: 'info',
      confirmButtonText: 'להרשמה',
      confirmButtonColor: theme.palette.primary.main,
      showCancelButton: true,
      cancelButtonText: 'לא עכשיו',
      cancelButtonColor: '#d33',
      customClass: {
        popup: 'swal-rtl'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/signup';
      }
    });
  };

  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }} dir="rtl">
      <Container>
        <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
          כיצד זה עובד
        </Typography>
        <Typography 
          variant="body1" 
          textAlign="center" 
          paragraph 
          sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}
        >
          הסתכל כיצד המערכת יכולה להפוך את ההקלטות שלך לטקסט מוכן לשימוש ולסכם את הנקודות החשובות בשיעור:
        </Typography>
        
        <Grid container spacing={4} direction={isMobile ? 'column' : 'row'}>
          <Grid item xs={12} md={6}>
            {transcriptionResult ? (
              <TranscriptionResults
                transcriptionResult={transcriptionResult}
                keyPoints={keyPointsState.keyPoints}
                summary={keyPointsState.summary}
                fileName="הקובץ שהועלה"
                onNewTranscription={handleNewTranscription}
              />
            ) : (
              <FileUploadArea
                isLoading={isLoading}
                processingStage={processingStage}
                onFileProcess={processFile}
              />
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'right' }}>
{DEMO_STEPS.map((step, index) => (
  <DemoStep key={index} {...step} />
))}
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={clearError}>
        <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!keyPointsState.error} 
        autoHideDuration={6000} 
        onClose={() => {/* dispatch clear error action */}}
      >
        <Alert severity="warning" sx={{ width: '100%' }}>
          {keyPointsState.error || "שגיאה בעיבוד נקודות חשובות או סיכום"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Demo;