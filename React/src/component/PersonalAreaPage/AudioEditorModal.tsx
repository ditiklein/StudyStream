import  { useRef, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  TextField,
  Alert
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '../FileAndFolderStore/FileStore';
import axios from 'axios';

interface AudioEditModalProps {
  open: boolean;
  onClose: () => void;
  audioUrl: string | null;
  fileName?: string;
}

const AudioEditModal: React.FC<AudioEditModalProps> = ({
  open,
  onClose,
  audioUrl,
  fileName = 'קובץ שמע'
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'start' | 'end' | null>(null);
  const [editMode, setEditMode] = useState<'cut' | 'delete'>('cut');
//   const dispatch = useDispatch<AppDispatch>();

  // איפוס המצב כשפותחים את המודל
  useEffect(() => {
    if (open) {
      // איפוס כל המצבים
      setIsPlaying(false);
      setDuration(0);
      setCurrentTime(0);
      setStartTime(0);
      setEndTime(0);
      setVolume(50);
      setAudioBuffer(null);
      setIsLoading(false);
      setError(null);
      setIsDragging(false);
      setDragType(null);
      setEditMode('cut');
      
      // טעינת השמע
      if (audioUrl) {
        loadAudio();
      }
    }
    
    return () => {
      // ניקוי animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      // ניקוי אודיו קונטקסט כשסוגרים
      if (audioContext) {
        audioContext.close();
        setAudioContext(null);
      }
    };
  }, [open]);

  // פונקציה לעדכון הזמן הנוכחי באופן רציף
  const updateCurrentTime = () => {
    const audio = audioRef.current;
    if (audio && isPlaying) {
      setCurrentTime(audio.currentTime);
    }
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateCurrentTime);
    }
  };

  // התחלת/עצירת עדכון הזמן
  useEffect(() => {
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateCurrentTime);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // יצירת אודיו קונטקסט
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);

      // טעינת הקובץ
      const response = await fetch(audioUrl!);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      
      if (arrayBuffer.byteLength === 0) {
        throw new Error('Empty audio file');
      }
      
      const buffer = await ctx.decodeAudioData(arrayBuffer);
      
      // בדיקה שה-duration תקין
      const validDuration = buffer.duration;
      if (!isFinite(validDuration) || validDuration <= 0) {
        throw new Error('Invalid audio duration');
      }
      
      console.log('Audio loaded successfully:', {
        duration: validDuration,
        sampleRate: buffer.sampleRate,
        channels: buffer.numberOfChannels,
        length: buffer.length
      });
      
      setAudioBuffer(buffer);
      setDuration(validDuration);
      setEndTime(validDuration);
      
      // ציור הגרף
      drawWaveform(buffer);
      
      setIsLoading(false);
    } catch (err) {
      setError(`שגיאה בטעינת קובץ השמע: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
      console.error('Audio loading error:', err);
    }
  };

  // ציור צורת הגל על קנבס עם מחוון זמן
  const drawWaveform = (buffer: AudioBuffer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 150;
    
    ctx.clearRect(0, 0, width, height);
    
    const data = buffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;
    
    ctx.fillStyle = '#e91e63';
    ctx.beginPath();
    
    for (let i = 0; i < width; i++) {
      let min = 1.0;
      let max = -1.0;
      
      for (let j = 0; j < step; j++) {
        const datum = data[(i * step) + j];
        if (datum < min) min = datum;
        if (datum > max) max = datum;
      }
      
      ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
    }
  };

  // ציור האזור הנבחר ומחוון הזמן הנוכחי
  const drawSelectedRegion = () => {
    const canvas = canvasRef.current;
    if (!canvas || !isFinite(duration) || duration <= 0) return;

    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;
    
    // ציור מחדש של הגל
    if (audioBuffer) {
      drawWaveform(audioBuffer);
    }
    
    // ציור האזור הנבחר
    if (startTime < endTime && isFinite(startTime) && isFinite(endTime)) {
      const startX = (startTime / duration) * width;
      const endX = (endTime / duration) * width;
      
      ctx.fillStyle = 'rgba(255, 87, 34, 0.3)';
      ctx.fillRect(startX, 0, endX - startX, height);
      
      ctx.strokeStyle = '#ff5722';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startX, 0);
      ctx.lineTo(startX, height);
      ctx.moveTo(endX, 0);
      ctx.lineTo(endX, height);
      ctx.stroke();
    }
    
    // ציור מחוון הזמן הנוכחי
    if (isFinite(currentTime) && currentTime >= 0 && currentTime <= duration) {
      const currentX = (currentTime / duration) * width;
      
      ctx.strokeStyle = '#2196f3';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(currentX, 0);
      ctx.lineTo(currentX, height);
      ctx.stroke();
    }
  };

  // עדכון הקנבס כשמשנים זמנים או זמן נוכחי
  useEffect(() => {
    drawSelectedRegion();
  }, [startTime, endTime, audioBuffer, currentTime]);

  // פונקציות עבור גרירה על הקנבס
  const getTimeFromX = (x: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !duration) return 0;
    const rect = canvas.getBoundingClientRect();
    const relativeX = x - rect.left;
    const ratio = relativeX / canvas.offsetWidth;
    return Math.max(0, Math.min(duration, ratio * duration));
  };

  const handleCanvasMouseDown = (event: React.MouseEvent) => {
    if (!duration) return;
    
    const time = getTimeFromX(event.clientX);
    const startDiff = Math.abs(time - startTime);
    const endDiff = Math.abs(time - endTime);
    
    // בחירה של הנקודה הקרובה יותר
    if (startDiff < endDiff && startDiff < duration * 0.05) {
      setDragType('start');
      setIsDragging(true);
    } else if (endDiff < duration * 0.05) {
      setDragType('end');
      setIsDragging(true);
    } else {
      // יצירת בחירה חדשה
      setStartTime(time);
      setEndTime(time);
      setDragType('end');
      setIsDragging(true);
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !dragType) return;
    
    const time = getTimeFromX(event.clientX);
    
    if (dragType === 'start') {
      setStartTime(Math.max(0, Math.min(time, endTime - 0.1)));
    } else if (dragType === 'end') {
      setEndTime(Math.max(startTime + 0.1, Math.min(time, duration)));
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
  };

  // הוספת event listeners גלובליים לגרירה
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (event: MouseEvent) => {
        if (!canvasRef.current) return;
        // const rect = canvasRef.current.getBoundingClientRect();
        const fakeEvent = {
          clientX: event.clientX
        } as React.MouseEvent;
        handleCanvasMouseMove(fakeEvent);
      };

      const handleGlobalMouseUp = () => {
        handleCanvasMouseUp();
      };

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging, dragType, startTime, endTime, duration]);

  // פונקציות בקרה
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !audioBuffer) return;

    if (isPlaying) {
      audio.pause();
    } else {
      // וידוא שהאודיו טעון
      if (audio.readyState >= 2) {
        audio.play().catch(err => {
          console.error('Play error:', err);
          setError('שגיאה בהפעלת השמע');
        });
      } else {
        setError('השמע עדיין לא נטען');
      }
    }
  };

  const handleStop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.pause();
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setCurrentTime(audio.currentTime);
    }
  };

//   const handleVolumeChange = (_: Event, newValue: number | number[]) => {
//     const vol = newValue as number;
//     setVolume(vol);
//     if (audioRef.current) {
//       audioRef.current.volume = vol / 100;
//     }
//   };

  const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(parseFloat(event.target.value) || 0, endTime));
    setStartTime(value);
  };

  const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(startTime, Math.min(parseFloat(event.target.value) || duration, duration));
    setEndTime(value);
  };

  // בדיקה שהערכים תקינים לפני ביצוע פעולה
  const canExecuteEdit = () => {
    return audioBuffer && 
           audioContext && 
           isFinite(duration) && 
           duration > 0 &&
           isFinite(startTime) && 
           isFinite(endTime) &&
           startTime < endTime && 
           startTime >= 0 && 
           endTime <= duration && 
           (endTime - startTime) >= 0.1 && // מינימום 0.1 שניות
           !isLoading;
  };

  // מחיקת חלק מהאמצע
  const handleDeleteAudio = async () => {
    if (!canExecuteEdit()) {
      setError('אנא הגדר זמני התחלה וסיום תקינים');
      return;
    }

    try {
      setIsLoading(true);
      
      const sampleRate = audioBuffer!.sampleRate;
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.floor(endTime * sampleRate);
      
      // חישוב האורך החדש (ללא החלק הנמחק)
      const beforeLength = startSample;
      const afterLength = audioBuffer!.length - endSample;
      const newLength = beforeLength + afterLength;
      
      if (newLength <= 0) {
        setError('לא ניתן למחוק את כל השמע');
        setIsLoading(false);
        return;
      }
      
      // יצירת buffer חדש
      const newBuffer = audioContext!.createBuffer(
        audioBuffer!.numberOfChannels,
        newLength,
        sampleRate
      );
      
      // העתקת הדאטה (לפני + אחרי, בלי האמצע)
      for (let channel = 0; channel < audioBuffer!.numberOfChannels; channel++) {
        const oldData = audioBuffer!.getChannelData(channel);
        const newData = newBuffer.getChannelData(channel);
        
        // העתקת החלק לפני המחיקה
        for (let i = 0; i < beforeLength; i++) {
          newData[i] = oldData[i];
        }
        
        // העתקת החלק אחרי המחיקה
        for (let i = 0; i < afterLength; i++) {
          newData[beforeLength + i] = oldData[endSample + i];
        }
      }
      
      // עדכון המצב
      setAudioBuffer(newBuffer);
      setDuration(newBuffer.duration);
      setStartTime(0);
      setEndTime(newBuffer.duration);
      setCurrentTime(0);
      
      // ציור הגל החדש
      drawWaveform(newBuffer);
      
      // יצירת URL חדש לנגן
      const wav = audioBufferToWav(newBuffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      const newUrl = URL.createObjectURL(blob);
      
      if (audioRef.current) {
        audioRef.current.src = newUrl;
        audioRef.current.load();
      }
      
      setIsLoading(false);
      
    } catch (err) {
      setError('שגיאה במחיקת השמע');
      setIsLoading(false);
      console.error('Delete audio error:', err);
    }
  };

  const handleCutAudio = async () => {
    if (!canExecuteEdit()) {
      setError('אנא הגדר זמני התחלה וסיום תקינים');
      return;
    }

    try {
      setIsLoading(true);
      
      const sampleRate = audioBuffer!.sampleRate;
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.floor(endTime * sampleRate);
      const newLength = endSample - startSample;
      
      // יצירת buffer חדש
      const newBuffer = audioContext!.createBuffer(
        audioBuffer!.numberOfChannels,
        newLength,
        sampleRate
      );
      
      // העתקת הדאטה
      for (let channel = 0; channel < audioBuffer!.numberOfChannels; channel++) {
        const oldData = audioBuffer!.getChannelData(channel);
        const newData = newBuffer.getChannelData(channel);
        for (let i = 0; i < newLength; i++) {
          newData[i] = oldData[startSample + i];
        }
      }
      
      // עדכון המצב
      setAudioBuffer(newBuffer);
      setDuration(newBuffer.duration);
      setStartTime(0);
      setEndTime(newBuffer.duration);
      setCurrentTime(0);
      
      // ציור הגל החדש
      drawWaveform(newBuffer);
      
      // יצירת URL חדש לנגן
      const wav = audioBufferToWav(newBuffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      const newUrl = URL.createObjectURL(blob);
      
      if (audioRef.current) {
        audioRef.current.src = newUrl;
        audioRef.current.load();
      }
      
      setIsLoading(false);
      
    } catch (err) {
      setError('שגיאה בחיתוך השמע');
      setIsLoading(false);
      console.error('Cut audio error:', err);
    }
  };

  // המרה ל-WAV
  const audioBufferToWav = (buffer: AudioBuffer) => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);
    
    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = buffer.getChannelData(channel)[i];
        const intSample = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }
    
    return arrayBuffer;
  };

  // שמירת הקובץ
  const handleSave = async () => {
    if (!audioBuffer) {
      setError('אין נתוני שמע לשמירה');
      return;
    }

    try {
      setIsLoading(true);
      
      // המרת AudioBuffer ל-WAV
      const wav = audioBufferToWav(audioBuffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      
      // שימוש בשם הקובץ הקיים - לא יוצרים שם חדש!
      const fileNameToUse = fileName || 'audio_file.wav';
      
      // קבלת Presigned URL עם שם הקובץ הקיים
      const presignedResponse = await fetch(`http://localhost:5220/api/upload/presigned-url?fileName=${encodeURIComponent(fileNameToUse)}`);
      
      if (!presignedResponse.ok) {
        throw new Error("Failed to get presigned URL");
      }
      
      const { url } = await presignedResponse.json();
      console.log("Presigned URL for existing file:", url);
      
      // העלאת הקובץ ל-S3 - יחליף את הקובץ הקיים
      const uploadResponse = await axios.put(url, blob, { 
        headers: { 
          "Content-Type": "audio/wav",
        }, 
      });
      
      if (uploadResponse.status !== 200) {
        throw new Error(`Upload failed with status: ${uploadResponse.status}`);
      }
      
      console.log("File updated successfully");
      
      // הצלחה - סגירת המודל
      setIsLoading(false);
      onClose();
      
    } catch (err) {
      setError('שגיאה בשמירת הקובץ');
      setIsLoading(false);
      console.error('Save error:', err);
    }
  };

  // פורמט זמן - עם הגנה מפני ערכים לא תקינים
  const formatTime = (seconds: number) => {
    if (!isFinite(seconds) || seconds < 0) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      dir="rtl"
      sx={{
        '& .MuiDialog-paper': {
          maxHeight: '90vh',
          height: 'auto'
        }
      }}
    >
      {/* Header כחול */}
      <Box sx={{
        bgcolor: '#1976d2',
        color: 'white',
        p: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2', backgroundColor: 'white', px: 3, py: 1, borderRadius: 2 }}>
          עריכת שמע
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ 
            color: 'white',
            position: 'absolute',
            left: 16,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
   
      <DialogContent 
        sx={{ 
          p: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {error && (
          <Alert severity="error" sx={{ m: 3, mb: 0 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ 
          flex: 1,
          overflowY: 'auto',
          p: 3,
          display: 'flex', 
          gap: 3,
          minHeight: 0
        }}>
          {/* נגן השמע */}
          {audioUrl && (
            <audio
              ref={audioRef}
              src={audioUrl}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onLoadedMetadata={() => {
                if (audioRef.current) {
                  const audioDuration = audioRef.current.duration;
                  console.log('Audio element loaded:', {
                    duration: audioDuration,
                    readyState: audioRef.current.readyState,
                    src: audioRef.current.src
                  });
                  
                  // בדיקה שה-duration תקין מה-audio element
                  if (isFinite(audioDuration) && audioDuration > 0) {
                    // אם ה-Web Audio API לא הצליח לקבוע duration, נשתמש בזה של ה-audio element
                    if (!isFinite(duration) || duration <= 0) {
                      setDuration(audioDuration);
                      setEndTime(audioDuration);
                    }
                  }
                  audioRef.current.volume = volume / 100;
                }
              }}
              style={{ display: 'none' }}
            />
          )}

          {/* צד שמאל - נגן ועוצמה */}
          <Box sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            {/* תצוגת צורת הגל */}
            <Box>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
               {fileName}
              </Typography>
              <Box sx={{ 
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                p: 2,
                bgcolor: '#fafafa'
              }}>
                <canvas
                  ref={canvasRef}
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                  style={{
                    width: '100%',
                    height: '150px',
                    display: 'block',
                    borderRadius: '4px',
                    backgroundColor: '#ffffff',
                    cursor: isDragging ? 'grabbing' : 'grab'
                  }}
                />
                {isLoading && (
                  <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
                    טוען...
                  </Typography>
                )}
              </Box>
            </Box>

            {/* בקרות נגינה */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: 2,
              p: 3,
              bgcolor: '#f5f5f5',
              borderRadius: 2
            }}>
              <IconButton 
                onClick={handlePlayPause} 
                color="primary" 
                size="large"
                disabled={!audioBuffer}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&:disabled': { bgcolor: 'grey.300' },
                  width: 60,
                  height: 60
                }}
              >
                {isPlaying ? <PauseIcon sx={{ fontSize: 32 }} /> : <PlayArrowIcon sx={{ fontSize: 32 }} />}
              </IconButton>
              <IconButton 
                onClick={handleStop} 
                size="large"
                disabled={!audioBuffer}
                sx={{ 
                  bgcolor: 'grey.200',
                  '&:hover': { bgcolor: 'grey.300' },
                  '&:disabled': { bgcolor: 'grey.100' },
                  width: 50,
                  height: 50
                }}
              >
                <StopIcon sx={{ fontSize: 28 }} />
              </IconButton>
              <Box sx={{ textAlign: 'center', ml: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {formatTime(currentTime)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  / {formatTime(duration)}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* צד ימין - פיצ'רי עריכה */}
          <Box sx={{ 
            width: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* בחירת אזור לחיתוך או מחיקה */}
            <Box sx={{ 
              border: '2px solid #e3f2fd', 
              borderRadius: 2, 
              p: 3,
              bgcolor: '#f8f9fa',
              height: 'fit-content'
            }}>
              <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
                עריכת שמע
              </Typography>
              
              {/* בחירת מצב עריכה */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  בחר פעולה:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant={editMode === 'cut' ? 'contained' : 'outlined'}
                    onClick={() => setEditMode('cut')}
                    size="small"
                    sx={{ flex: 1, py: 1 }}
                  >
                    חיתוך
                  </Button>
                  <Button
                    variant={editMode === 'delete' ? 'contained' : 'outlined'}
                    onClick={() => setEditMode('delete')}
                    size="small"
                    color="error"
                    sx={{ flex: 1, py: 1 }}
                  >
                    מחיקה
                  </Button>
                </Box>
              

              </Box>

              {/* הגדרות זמן */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  הגדרות זמן:
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <TextField
                    label="התחלה"
                    type="number"
                    value={startTime}
                    onChange={handleStartTimeChange}
                    inputProps={{
                      min: 0,
                      max: duration,
                      step: 0.1
                    }}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                  <TextField
                    label="סיום"
                    type="number"
                    value={endTime}
                    onChange={handleEndTimeChange}
                    inputProps={{
                      min: 0,
                      max: duration,
                      step: 0.1
                    }}
                    size="small"
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Box>

              {/* כפתור ביצוע */}
              <Button
                variant="contained"
                onClick={editMode === 'cut' ? handleCutAudio : handleDeleteAudio}
                startIcon={editMode === 'cut' ? <ContentCutIcon /> : <DeleteIcon />}
                disabled={isLoading || startTime >= endTime || !audioBuffer}
                fullWidth
                size="medium"
                sx={{ py: 1.5 }}
                color={editMode === 'cut' ? 'primary' : 'error'}
              >
                {editMode === 'cut' ? 'חתוך שמע' : 'מחק קטע'}
              </Button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ 
        px: 3, 
        py: 2,
        borderTop: '1px solid #e0e0e0',
        gap: 1
      }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          size="large"
        >
          סגור
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSave}
          startIcon={<SaveIcon />}
          disabled={isLoading || !audioBuffer}
          size="large"
        >
          שמור שינויים
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AudioEditModal;