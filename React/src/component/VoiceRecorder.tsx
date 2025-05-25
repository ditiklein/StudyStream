import  { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader,
  Typography, 
  Stack, 
  TextField,
  Paper,
  Divider,
  Switch,
  FormControlLabel,
  Grid
} from '@mui/material';
import { 
  MicRounded, 
  PauseRounded, 
  PlayArrowRounded,
  StopRounded, 
  SaveRounded, 
  VolumeUpRounded,
  CloseRounded,
  TranscribeRounded,
  DownloadRounded,
  ContentCopyRounded
} from '@mui/icons-material';
import FileDialog from './PersonalAreaPage/FileDialog';
import { handleConfirmation } from './Confirmation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './FileAndFolderStore/FileStore';

interface Id {
  parentId: number | null;
}

// הרחבת Window interface לתמיכה ב-webkitSpeechRecognition
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export const VoiceRecorder: React.FC<Id> = ({ parentId }) => {
  const [recording, setRecording] = useState<boolean>(false);
  const [paused, setPaused] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [waveformValues, setWaveformValues] = useState<number[]>(Array(20).fill(5));
  const [lessonName, setLessonName] = useState<string>('');
  const [, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  
  // State חדש לתמלול
  const [transcriptionEnabled, setTranscriptionEnabled] = useState<boolean>(true);
  const [currentTranscript, setCurrentTranscript] = useState<string>('');
  const [finalTranscript, setFinalTranscript] = useState<string>('');
  const [isTranscriptionSupported, setIsTranscriptionSupported] = useState<boolean>(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const waveformTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const dispatch = useDispatch<AppDispatch>();

  // בדיקה אם Speech Recognition נתמך
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsTranscriptionSupported(true);
      speechRecognitionRef.current = new SpeechRecognition();
      
      // הגדרות בסיסיות
      speechRecognitionRef.current.continuous = true;
      speechRecognitionRef.current.interimResults = true;
      speechRecognitionRef.current.lang = 'he-IL'; // עברית
      
      // Event handlers לתמלול
      speechRecognitionRef.current.onresult = (event: any) => {
        let interim = '';
        let final = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript + ' ';
          } else {
            interim += transcript;
          }
        }
        
        setCurrentTranscript(interim);
        if (final) {
          setFinalTranscript(prev => prev + final);
        }
      };
      
      speechRecognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
      
      speechRecognitionRef.current.onend = () => {
        // אם ההקלטה עדיין פעילה, התחל מחדש את התמלול
        if (recording && !paused && transcriptionEnabled) {
          try {
            speechRecognitionRef.current.start();
          } catch (error) {
            console.error('Error restarting speech recognition:', error);
          }
        }
      };
    }
  }, []);

  const startTranscription = () => {
    if (speechRecognitionRef.current && transcriptionEnabled && isTranscriptionSupported) {
      try {
        speechRecognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const stopTranscription = () => {
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };

  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        console.log("הקלטה הסתיימה, נוצר URL:", audioUrl);
      };
      
      mediaRecorderRef.current.start();
      setRecording(true);
      setPaused(false);
      setAudioBlob(null);
      setAudioUrl(null);
      setRecordingTime(0);
      setCurrentTranscript('');
      setFinalTranscript('');
      
      // התחל תמלול
      if (transcriptionEnabled) {
        startTranscription();
      }
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      waveformTimerRef.current = setInterval(() => {
        const newValues: number[] = [];
        for (let i = 0; i < 20; i++) {
          newValues.push(Math.random() * 45 + 5);
        }
        setWaveformValues(newValues);
      }, 200);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };
  
  const pauseRecording = (): void => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.pause();
      if (timerRef.current) clearInterval(timerRef.current);
      if (waveformTimerRef.current) clearInterval(waveformTimerRef.current);
      stopTranscription();
      setPaused(true);
    }
  };
  
  const handleDialogClose = (): void => {
    setIsDialogOpen(false);
    if (uploadProgress > 0 && uploadProgress < 100) {
      setUploadProgress(0);
    }
    setIsVisible(true);
  };

  const resumeRecording = (): void => {
    if (mediaRecorderRef.current && paused) {
      mediaRecorderRef.current.resume();
      setPaused(false);
      
      // התחל תמלול מחדש
      if (transcriptionEnabled) {
        startTranscription();
      }
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      waveformTimerRef.current = setInterval(() => {
        const newValues: number[] = [];
        for (let i = 0; i < 20; i++) {
          newValues.push(Math.random() * 45 + 5);
        }
        setWaveformValues(newValues);
      }, 200);
    }
  };
  
  const stopRecording = (): void => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        
        console.log("הקלטה הסתיימה, נוצר URL:", audioUrl);
      };
      
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      if (waveformTimerRef.current) clearInterval(waveformTimerRef.current);
      
      // עצור תמלול
      stopTranscription();
      
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
      setRecording(false);
      setPaused(false);
    }
  };
  
const saveRecording = (): void => {
  if (audioBlob) {
    const fileName = lessonName.trim() 
      ? `${lessonName.trim()}.wav`
      : `recording-${new Date().toISOString()}.wav`;
    
    const file = new File([audioBlob], fileName, { type: 'audio/wav' });
    
    setFiles([file]);
    setSelectedFiles([file]);
    
    setIsVisible(false);
    setIsDialogOpen(true);
  }
};  const cancelRecording = (): void => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (waveformTimerRef.current) clearInterval(waveformTimerRef.current);
    
    stopTranscription();
    
    setRecording(false);
    setPaused(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setWaveformValues(Array(20).fill(5));
    setCurrentTranscript('');
    setFinalTranscript('');
  };
  
  const playRecording = (): void => {
    if (audioRef.current && audioUrl) {
      console.log("מנסה לנגן אודיו מ-URL:", audioUrl);
      audioRef.current.src = audioUrl;
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("הניגון התחיל בהצלחה");
          })
          .catch(error => {
            console.error("שגיאה בניגון האודיו:", error);
            
            if (error.name === "NotAllowedError") {
              console.log("מנסה לטעון מחדש את האודיו");
              audioRef.current?.load();
              audioRef.current?.play();
            }
          });
      }
    } else {
      console.error("לא ניתן לנגן: audioRef או audioUrl לא זמינים", {
        audioRef: audioRef.current ? "קיים" : "לא קיים",
        audioUrl: audioUrl ? audioUrl : "לא קיים"
      });
    }
  };
  
  const copyTranscript = (): void => {
    const fullTranscript = finalTranscript + currentTranscript;
    if (fullTranscript.trim()) {
      navigator.clipboard.writeText(fullTranscript.trim())
        .then(() => {
          // יכול להוסיף הודעת הצלחה אם רוצה
          console.log('התמלול הועתק בהצלחה');
        })
        .catch(error => {
          console.error('שגיאה בהעתקת התמלול:', error);
        });
    }
  };

  const downloadTranscript = (): void => {
    const fullTranscript = finalTranscript + currentTranscript;
    if (fullTranscript.trim()) {
      const fileName = `${lessonName || 'transcript'}-${new Date().toISOString().split('T')[0]}.txt`;
      const blob = new Blob([fullTranscript.trim()], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (waveformTimerRef.current) clearInterval(waveformTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      stopTranscription();
    };
  }, [audioUrl]);
  
  const primaryColor = "#3f51b5";
  
  if (!isVisible) {
    return (
      <FileDialog
        open={isDialogOpen}
        files={selectedFiles}
        onClose={handleDialogClose}
        onConfirm={(files, shouldUpload,descriptions) =>
          handleConfirmation(
            files,
            shouldUpload,
            parentId,
            dispatch,
            setUploadProgress,
            setIsDialogOpen,
            setSelectedFiles,
            descriptions
          )
        }
        uploadProgress={uploadProgress}
      />
    );
  }
  
  return (
    <Card sx={{
      maxHeight: '80vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <CardHeader 
        title={
          <Typography variant="h5" component="div" align="center" dir="rtl" fontWeight="bold" >
            הקלטת שיעור
          </Typography>
        }
        sx={{ bgcolor: '#1976d2', color: 'white', pb: 1, flexShrink: 0 }}
      />
      
      <CardContent sx={{ 
        pt: 3, 
        overflow: 'auto', 
        flex: 1 
      }}>
        <TextField
          fullWidth
          variant="outlined"
          label="שם השיעור"
          value={lessonName}
          onChange={(e) => setLessonName(e.target.value)}
          dir="rtl"
          sx={{ mb: 3 }}
          InputProps={{
            sx: { borderRadius: 2 }
          }}
        />

        {/* הגדרת תמלול */}
        {isTranscriptionSupported && (
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={transcriptionEnabled}
                  onChange={(e) => setTranscriptionEnabled(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TranscribeRounded />
                  <Typography>תמלול בזמן אמת</Typography>
                </Box>
              }
              sx={{ direction: 'rtl' }}
            />
          </Box>
        )}

        {/* פריסה מותנית - אם תמלול מופעל ויש תוכן להציג */}
        {transcriptionEnabled && isTranscriptionSupported && (recording || finalTranscript) ? (
          <Grid container spacing={3}>
            {/* חלק ראשון - הקלטה ופסים */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h4" align="center" sx={{ fontFamily: 'monospace', color: primaryColor, mb: 2 }}>
                  {formatTime(recordingTime)}
                </Typography>
                
                <Box 
                  sx={{ 
                    height: 100, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 3,
                    overflow: 'hidden'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      px: 2
                    }}
                  >
                    {waveformValues.map((value, index) => (
                      <Box
                        key={index}
                        sx={{
                          height: `${value}%`,
                          width: 6,
                          bgcolor: primaryColor,
                          borderRadius: 4,
                          transition: 'height 0.2s ease'
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', flexGrow: 1, alignItems: 'center' }}>
                  {!recording && !audioUrl ? (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<MicRounded />}
                      onClick={startRecording}
                      size="large"
                      dir="rtl"
                      sx={{ 
                        borderRadius: 28, 
                        px: 4, 
                        py: 1.5,
                        bgcolor: primaryColor,
                        '&:hover': {
                          bgcolor: '#303f9f'
                        },
                        fontSize: '1.1rem' 
                      }}
                    >
                      התחל הקלטה
                    </Button>
                  ) : recording ? (
                    <Stack 
                      direction="column" 
                      spacing={2}
                      alignItems="center"
                    >
                      {!paused ? (
                        <Button
                          variant="contained"
                          startIcon={<PauseRounded />}
                          onClick={pauseRecording}
                          size="large"
                          dir="rtl"
                          sx={{ 
                            borderRadius: 28, 
                            px: 3, 
                            bgcolor: primaryColor,
                            '&:hover': {
                              bgcolor: '#303f9f'
                            }
                          }}
                        >
                          השהה
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          startIcon={<PlayArrowRounded />}
                          onClick={resumeRecording}
                          size="large"
                          dir="rtl"
                          sx={{ 
                            borderRadius: 28, 
                            px: 3, 
                            bgcolor: primaryColor,
                            '&:hover': {
                              bgcolor: '#303f9f'
                            }
                          }}
                        >
                          המשך
                        </Button>
                      )}
                      <Button
                        variant="contained"
                        startIcon={<StopRounded />}
                        onClick={stopRecording}
                        size="large"
                        dir="rtl"
                        sx={{ 
                          borderRadius: 28, 
                          px: 3, 
                          bgcolor: primaryColor,
                          '&:hover': {
                            bgcolor: '#303f9f'
                          }
                        }}
                      >
                        סיים
                      </Button>
                    </Stack>
                  ) : (
                    <Stack 
                      direction="column" 
                      spacing={2}
                      alignItems="center"
                    >
                      <Button
                        variant="contained"
                        startIcon={<VolumeUpRounded />}
                        onClick={playRecording}
                        dir="rtl"
                        sx={{ 
                          borderRadius: 28, 
                          px: 3, 
                          bgcolor: primaryColor,
                          '&:hover': {
                            bgcolor: '#303f9f'
                          }
                        }}
                      >
                        האזן
                      </Button>
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="contained"
                          startIcon={<SaveRounded />}
                          onClick={saveRecording}
                          dir="rtl"
                          sx={{ 
                            borderRadius: 28, 
                            px: 3, 
                            bgcolor: primaryColor,
                            '&:hover': {
                              bgcolor: '#303f9f'
                            }
                          }}
                        >
                          שמור
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<CloseRounded />}
                          onClick={cancelRecording}
                          dir="rtl"
                          sx={{ 
                            borderRadius: 28, 
                            px: 3, 
                            bgcolor: primaryColor,
                            '&:hover': {
                              bgcolor: '#303f9f'
                            }
                          }}
                        >
                          ביטול
                        </Button>
                      </Stack>
                    </Stack>
                  )}
                </Box>
              </Box>
            </Grid>

            {/* חלק שני - תמלול */}
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  height: '100%',
                  minHeight: 300,
                  bgcolor: '#f5f5f5',
                  border: `2px solid ${primaryColor}`,
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: primaryColor, 
                    fontWeight: 'bold', 
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TranscribeRounded fontSize="small" />
                    תמלול:
                  </Box>
                  {(finalTranscript || currentTranscript) && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="text"
                        startIcon={<ContentCopyRounded fontSize="small" />}
                        onClick={copyTranscript}
                        sx={{ 
                          minWidth: 'auto',
                          fontSize: '0.75rem',
                          color: primaryColor,
                          '&:hover': {
                            bgcolor: 'rgba(63, 81, 181, 0.1)'
                          }
                        }}
                      >
                        העתק
                      </Button>
                      <Button
                        size="small"
                        variant="text"
                        startIcon={<DownloadRounded fontSize="small" />}
                        onClick={downloadTranscript}
                        sx={{ 
                          minWidth: 'auto',
                          fontSize: '0.75rem',
                          color: primaryColor,
                          '&:hover': {
                            bgcolor: 'rgba(63, 81, 181, 0.1)'
                          }
                        }}
                      >
                        הורד
                      </Button>
                    </Box>
                  )}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                  <Typography 
                    variant="body1" 
                    dir="rtl" 
                    sx={{ 
                      lineHeight: 1.6,
                      fontSize: '1rem'
                    }}
                  >
                    {finalTranscript}
                    <span style={{ color: '#666', fontStyle: 'italic' }}>
                      {currentTranscript}
                    </span>
                    {recording && (
                      <Box 
                        component="span" 
                        sx={{ 
                          display: 'inline-block',
                          width: 2,
                          height: 20,
                          bgcolor: primaryColor,
                          ml: 0.5,
                          animation: 'blink 1s infinite'
                        }}
                      />
                    )}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        ) : (
          // פריסה רגילה כאשר תמלול לא מופעל או אין תוכן
          <>
            <Typography variant="h4" align="center" sx={{ fontFamily: 'monospace', color: primaryColor, mt: 1, mb: 2 }}>
              {formatTime(recordingTime)}
            </Typography>
            
            <Box 
              sx={{ 
                height: 100, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                my: 2,
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 2
                }}
              >
                {waveformValues.map((value, index) => (
                  <Box
                    key={index}
                    sx={{
                      height: `${value}%`,
                      width: 6,
                      bgcolor: primaryColor,
                      borderRadius: 4,
                      transition: 'height 0.2s ease'
                    }}
                  />
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              {!recording && !audioUrl ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<MicRounded />}
                  onClick={startRecording}
                  size="large"
                  dir="rtl"
                  sx={{ 
                    borderRadius: 28, 
                    px: 4, 
                    py: 1.5,
                    bgcolor: primaryColor,
                    '&:hover': {
                      bgcolor: '#303f9f'
                    },
                    fontSize: '1.1rem' 
                  }}
                >
                  התחל הקלטה
                </Button>
              ) : recording ? (
                <Stack 
                  direction="row" 
                  spacing={4}
                  justifyContent="center"
                >
                  {!paused ? (
                    <Button
                      variant="contained"
                      startIcon={<PauseRounded />}
                      onClick={pauseRecording}
                      size="large"
                      dir="rtl"
                      sx={{ 
                        borderRadius: 28, 
                        px: 3, 
                        bgcolor: primaryColor,
                        '&:hover': {
                          bgcolor: '#303f9f'
                        }
                      }}
                    >
                      השהה
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<PlayArrowRounded />}
                      onClick={resumeRecording}
                      size="large"
                      dir="rtl"
                      sx={{ 
                        borderRadius: 28, 
                        px: 3, 
                        bgcolor: primaryColor,
                        '&:hover': {
                          bgcolor: '#303f9f'
                        }
                      }}
                    >
                      המשך
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    startIcon={<StopRounded />}
                    onClick={stopRecording}
                    size="large"
                    dir="rtl"
                    sx={{ 
                      borderRadius: 28, 
                      px: 3, 
                      bgcolor: primaryColor,
                      '&:hover': {
                        bgcolor: '#303f9f'
                      }
                    }}
                  >
                    סיים
                  </Button>
                </Stack>
              ) : (
                <Stack 
                  direction="row" 
                  spacing={4}
                  justifyContent="center"
                >
                  <Button
                    variant="contained"
                    startIcon={<VolumeUpRounded />}
                    onClick={playRecording}
                    dir="rtl"
                    sx={{ 
                      borderRadius: 28, 
                      px: 3, 
                      bgcolor: primaryColor,
                      '&:hover': {
                        bgcolor: '#303f9f'
                      }
                    }}
                  >
                    האזן
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<SaveRounded />}
                    onClick={saveRecording}
                    dir="rtl"
                    sx={{ 
                      borderRadius: 28, 
                      px: 3, 
                      bgcolor: primaryColor,
                      '&:hover': {
                        bgcolor: '#303f9f'
                      }
                    }}
                  >
                    שמור
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<CloseRounded />}
                    onClick={cancelRecording}
                    dir="rtl"
                    sx={{ 
                      borderRadius: 28, 
                      px: 3, 
                      bgcolor: primaryColor,
                      '&:hover': {
                        bgcolor: '#303f9f'
                      }
                    }}
                  >
                    ביטול
                  </Button>
                </Stack>
              )}
            </Box>
          </>
        )}

        {audioUrl && (
          <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'center' }}>
            <audio 
              ref={audioRef} 
              src={audioUrl} 
              controls 
              style={{ width: '80%' }} 
            />
          </Box>
        )}
      </CardContent>

      {/* CSS Animation for cursor */}
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
    </Card>
  );
}
                