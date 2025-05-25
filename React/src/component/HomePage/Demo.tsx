import { useState, DragEvent, ChangeEvent } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  Avatar,
  Button,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DescriptionIcon from '@mui/icons-material/Description';
import CircleIcon from '@mui/icons-material/Circle';
import { useDispatch, useSelector } from 'react-redux';
import { extractKeyPoints, selectKeyPoints, summarizeLesson } from '../FileAndFolderStore/KeyPointsSlice';
import Swal from 'sweetalert2';

// ממשק עבור תכונות צעד בהדגמה
interface DemoStepProps {
  number: string;
  title: string;
  description: string;
}

// ממשק עבור תוצאות תמלול
interface TranscriptionResult {
  text: string;
}

// רכיב DemoStep להצגת צעדים בתהליך
const DemoStep: React.FC<DemoStepProps> = ({ number, title, description }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
      <Avatar
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          ml: 2, // שוליים משמאל בשביל תצוגה בעברית
          width: 30,
          height: 30,
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}
      >
        {number}
      </Avatar>
      <Box sx={{ 
        flexGrow: 1, 
        textAlign: 'left',  // יישור טקסט לימין
        '& > *': {
          textAlign: 'right',
          display: 'block',
          width: '100%'
        }
      }}>
        <Typography variant="h4" component="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

// עיבוד נקודות מפתח לרשימה עם נקודות
const formatKeyPoints = (keyPoints: string | null): string[] => {
  if (!keyPoints) return [];
  
  // מפצל לפי שורות חדשות ומסיר שורות ריקות
  return keyPoints
    .split('\n')
    .map(point => point.trim())
    .filter(point => point.length > 0);
};

// רכיב TranscriptionResult להצגת תוצאות התמלול
const TranscriptionResultView: React.FC<{ 
  transcriptionResult: TranscriptionResult | null, 
  keyPoints: string | null, 
  summary: string | null 
}> = ({ transcriptionResult, keyPoints, summary }) => {
  if (!transcriptionResult) return null;
  
  const keyPointsList = formatKeyPoints(keyPoints);
  const theme = useTheme();
  const primaryBlue = theme.palette.primary.main;
  
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h3" component="h3" gutterBottom>
        תוצאות התמלול
      </Typography>
      
      {summary && (
        <Accordion 
          defaultExpanded 
          sx={{ 
            mb: 2,
            '& .MuiAccordionSummary-root': {
              bgcolor: primaryBlue,
              color: 'white',
            }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography variant="h6">סיכום</Typography>
          </AccordionSummary>
          <AccordionDetails 
            sx={{ 
              bgcolor: `${primaryBlue}10`, 
              borderTop: 'none',
              pt: 2,
              pb: 2
            }}
          >
            <Typography color={primaryBlue} sx={{ fontWeight: 500 }}>{summary}</Typography>
          </AccordionDetails>
        </Accordion>
      )}
      
      {keyPoints && (
        <Accordion 
          defaultExpanded 
          sx={{ 
            mb: 2,
            '& .MuiAccordionSummary-root': {
              bgcolor: primaryBlue,
              color: 'white',
            }
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
            <Typography variant="h6">נקודות מפתח</Typography>
          </AccordionSummary>
          <AccordionDetails 
            sx={{ 
              bgcolor: `${primaryBlue}10`, 
              borderTop: 'none',
              pt: 0,
              pb: 2
            }}
          >
            <List>
              {keyPointsList.map((point, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: '30px' }}>
                    <CircleIcon sx={{ fontSize: 8, color: primaryBlue }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography color={primaryBlue} sx={{ fontWeight: 500 }}>{point}</Typography>} 
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}
      
      <Accordion 
        sx={{ 
          '& .MuiAccordionSummary-root': {
            bgcolor: primaryBlue,
            color: 'white',
          }
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />}>
          <Typography variant="h6">תמלול מלא</Typography>
        </AccordionSummary>
        <AccordionDetails 
          sx={{ 
            bgcolor: `${primaryBlue}10`, 
            borderTop: 'none',
            pt: 2,
            pb: 2
          }}
        >
          <Typography 
            sx={{ 
              whiteSpace: 'pre-wrap',
              color: primaryBlue,
              fontWeight: 500 
            }}
          >
            {transcriptionResult.text}
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

// רכיב Demo הראשי
const Demo: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>("");
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Redux
  const dispatch = useDispatch();
  const keyPointsState = useSelector(selectKeyPoints);

  // צעדים להדגמת תהליך העלאת הקובץ
  const steps: DemoStepProps[] = [
    {
      number: '1',
      title: 'העלה את הקלטת השיעור',
      description: 'פשוט גרור ושחרר את קובץ השמע או הווידאו לאזור ההעלאה.'
    },
    {
      number: '2',
      title: 'המערכת מעבדת את הקובץ',
      description: 'הבינה המלאכותית שלנו ממירה את השמע לטקסט ומזהה נקודות חשובות.'
    },
    {
      number: '3',
      title: 'קבל את התוצאות',
      description: 'הטקסט המלא והסיכום מוכנים לשימוש, לשיתוף או לעריכה נוספת.'
    },
    {
      number: '4',
      title: 'ארגן בקלות',
      description: 'המערכת מציעה לך אוטומטית תיקיות ותגיות מתאימות לחומר.'
    }
  ];

  // טיפול באירועי גרירה
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // טיפול בשחרור קובץ גרור
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  // טיפול בשינוי קובץ דרך בחירה
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // שליחת הקובץ לתמלול ואז לחילוץ נקודות חשובות וסיכום
  const handleUploadAndProcessFile = async () => {
    if (!file) {
      setError("אנא בחר קובץ לפני השליחה");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // שלב 1: תמלול הקובץ
      setProcessingStage("מתמלל את הקובץ...");
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("http://localhost:5220/api/transcription/transcribe-full", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`שגיאת שרת בתמלול: ${response.status}`);
      }
      
      const transcriptionData = await response.json();
      
      // שמירת התמלול במצב המקומי
      setTranscriptionResult({
        text: transcriptionData.text || "אין תמלול זמין"
      });
      
      // שלב 2: חילוץ נקודות חשובות
      if (transcriptionData.text) {
        setProcessingStage("מחלץ נקודות חשובות...");
        await dispatch(extractKeyPoints(transcriptionData.text) as any);
        
        // שלב 3: יצירת סיכום
        setProcessingStage("מכין סיכום...");
        await dispatch(summarizeLesson(transcriptionData.text) as any);
      }
      
    } catch (err) {
      console.error("שגיאה בתהליך:", err);
      setError(err instanceof Error ? err.message : "אירעה שגיאה בתהליך");
    } finally {
      setIsLoading(false);
      setProcessingStage("");
    }
  };

  // סגירת הודעת שגיאה
  const handleCloseError = () => {
    setError(null);
  };

  // טיפול בלחיצה על "תמלול חדש" - הצגת הודעת SweetAlert
  const handleReset = () => {
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
})
.then((result) => {
      if (result.isConfirmed) {
        // כאן אפשר להפנות למסך ההרשמה
        window.location.href = '/signup'; // דוגמה להפניה לעמוד הרשמה
      }
    });
    
  };

  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper' }} dir="rtl">
      <Container>
        <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
          כיצד זה עובד
        </Typography>
        <Typography variant="body1" textAlign="center" paragraph sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}>
          הסתכל כיצד המערכת יכולה להפוך את ההקלטות שלך לטקסט מוכן לשימוש ולסכם את הנקודות החשובות בשיעור:
        </Typography>
        
        <Grid container spacing={4} direction={isMobile ? 'column' : 'row'}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                height: '100%',
                minHeight: 350,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: transcriptionResult ? 'flex-start' : 'center',
                alignItems: 'center',
                border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
                bgcolor: dragActive ? 'rgba(25, 118, 210, 0.05)' : 'white',
                transition: 'all 0.3s ease',
                overflow: 'auto'
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {isLoading ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CircularProgress size={60} />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {processingStage || "מעבד..."}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    תהליך זה עשוי להימשך מספר רגעים
                  </Typography>
                </Box>
              ) : transcriptionResult ? (
                <Box sx={{ width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5">
                      תמלול של: {fileName}
                    </Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={handleReset}
                    >
                      תמלול חדש
                    </Button>
                  </Box>
                  <TranscriptionResultView 
                    transcriptionResult={transcriptionResult}
                    keyPoints={keyPointsState.keyPoints} 
                    summary={keyPointsState.summary}
                  />
                </Box>
              ) : (
                <>
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
                      onClick={handleUploadAndProcessFile}
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
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'right' }}>
              {steps.map((step, index) => (
                <DemoStep key={index} {...step} />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* הודעת שגיאה */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      
      {/* הודעת שגיאה עבור נקודות חשובות וסיכום */}
      <Snackbar 
        open={!!keyPointsState.error} 
        autoHideDuration={6000} 
        onClose={() => dispatch({ type: 'keyPoints/clearError' })}
      >
        <Alert onClose={() => dispatch({ type: 'keyPoints/clearError' })} severity="warning" sx={{ width: '100%' }}>
          {keyPointsState.error || "שגיאה בעיבוד נקודות חשובות או סיכום"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Demo;