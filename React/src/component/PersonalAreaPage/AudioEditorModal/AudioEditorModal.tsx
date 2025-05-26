// import { useRef, useState, useEffect } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogActions,
//   Button,
//   Box,
//   Typography,
//   IconButton,
//   TextField,
//   Alert
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import PlayArrowIcon from '@mui/icons-material/PlayArrow';
// import PauseIcon from '@mui/icons-material/Pause';
// import StopIcon from '@mui/icons-material/Stop';
// import ContentCutIcon from '@mui/icons-material/ContentCut';
// import SaveIcon from '@mui/icons-material/Save';
// import DeleteIcon from '@mui/icons-material/Delete';
// import axios from 'axios';

// // הגדרת types עבור lamejs על window
// declare global {
//   interface Window {
//     lamejs: {
//       Mp3Encoder: new (channels: number, sampleRate: number, bitRate: number) => {
//         encodeBuffer: (left: Int16Array, right?: Int16Array) => Uint8Array;
//         flush: () => Uint8Array;
//       };
//     };
//   }
// }

// interface AudioEditModalProps {
//   open: boolean;
//   onClose: () => void;
//   audioUrl: string | null;
//   fileName?: string;
// }

// const AudioEditModal: React.FC<AudioEditModalProps> = ({
//   open,
//   onClose,
//   audioUrl,
//   fileName = 'קובץ שמע'
// }) => {
//   const audioRef = useRef<HTMLAudioElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const animationRef = useRef<number>(0);
  
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [duration, setDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [startTime, setStartTime] = useState(0);
//   const [endTime, setEndTime] = useState(0);
//   const [volume, setVolume] = useState(50);
//   const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
//   const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragType, setDragType] = useState<'start' | 'end' | null>(null);
//   const [editMode, setEditMode] = useState<'cut' | 'delete'>('cut');

//   // בדיקה שlamejs זמין
//   const isLamejsAvailable = () => {
//     return typeof window !== 'undefined' && window.lamejs && window.lamejs.Mp3Encoder;
//   };

//   // איפוס המצב כשפותחים את המודל
//   useEffect(() => {
//     if (open) {
//       setIsPlaying(false);
//       setDuration(0);
//       setCurrentTime(0);
//       setStartTime(0);
//       setEndTime(0);
//       setVolume(50);
//       setAudioBuffer(null);
//       setIsLoading(false);
//       setError(null);
//       setIsDragging(false);
//       setDragType(null);
//       setEditMode('cut');
      
//       // בדיקה שlamejs זמין
//       if (!isLamejsAvailable()) {
//         console.warn('lamejs not available - MP3 encoding will fallback to WAV');
//       } else {
//         console.log('✅ lamejs is available - MP3 encoding supported');
//       }
      
//       if (audioUrl) {
//         loadAudio();
//       }
//     }
    
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//       if (audioContext) {
//         audioContext.close();
//         setAudioContext(null);
//       }
//     };
//   }, [open]);

//   // פונקציה לעדכון הזמן הנוכחי באופן רציף
//   const updateCurrentTime = () => {
//     const audio = audioRef.current;
//     if (audio && isPlaying) {
//       setCurrentTime(audio.currentTime);
//     }
//     if (isPlaying) {
//       animationRef.current = requestAnimationFrame(updateCurrentTime);
//     }
//   };

//   // התחלת/עצירת עדכון הזמן
//   useEffect(() => {
//     if (isPlaying) {
//       animationRef.current = requestAnimationFrame(updateCurrentTime);
//     } else {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     }
    
//     return () => {
//       if (animationRef.current) {
//         cancelAnimationFrame(animationRef.current);
//       }
//     };
//   }, [isPlaying]);

//   const loadAudio = async () => {
//     try {
//       setIsLoading(true);
//       setError(null);

//       const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
//       setAudioContext(ctx);

//       const response = await fetch(audioUrl!);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const arrayBuffer = await response.arrayBuffer();
      
//       if (arrayBuffer.byteLength === 0) {
//         throw new Error('Empty audio file');
//       }
      
//       const buffer = await ctx.decodeAudioData(arrayBuffer);
      
//       const validDuration = buffer.duration;
//       if (!isFinite(validDuration) || validDuration <= 0) {
//         throw new Error('Invalid audio duration');
//       }
      
//       console.log('Audio loaded successfully:', {
//         duration: validDuration,
//         sampleRate: buffer.sampleRate,
//         channels: buffer.numberOfChannels,
//         length: buffer.length
//       });
      
//       setAudioBuffer(buffer);
//       setDuration(validDuration);
//       setEndTime(validDuration);
      
//       drawWaveform(buffer);
      
//       setIsLoading(false);
//     } catch (err) {
//       setError(`שגיאה בטעינת קובץ השמע: ${err instanceof Error ? err.message : 'Unknown error'}`);
//       setIsLoading(false);
//       console.error('Audio loading error:', err);
//     }
//   };

//   // ציור צורת הגל על קנבס
//   const drawWaveform = (buffer: AudioBuffer) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d')!;
//     const width = canvas.width = canvas.offsetWidth;
//     const height = canvas.height = 150;
    
//     ctx.clearRect(0, 0, width, height);
    
//     const data = buffer.getChannelData(0);
//     const step = Math.ceil(data.length / width);
//     const amp = height / 2;
    
//     ctx.fillStyle = '#e91e63';
//     ctx.beginPath();
    
//     for (let i = 0; i < width; i++) {
//       let min = 1.0;
//       let max = -1.0;
      
//       for (let j = 0; j < step; j++) {
//         const datum = data[(i * step) + j];
//         if (datum < min) min = datum;
//         if (datum > max) max = datum;
//       }
      
//       ctx.fillRect(i, (1 + min) * amp, 1, Math.max(1, (max - min) * amp));
//     }
//   };

//   // ציור האזור הנבחר ומחוון הזמן הנוכחי
//   const drawSelectedRegion = () => {
//     const canvas = canvasRef.current;
//     if (!canvas || !isFinite(duration) || duration <= 0) return;

//     const ctx = canvas.getContext('2d')!;
//     const width = canvas.width;
//     const height = canvas.height;
    
//     if (audioBuffer) {
//       drawWaveform(audioBuffer);
//     }
    
//     if (startTime < endTime && isFinite(startTime) && isFinite(endTime)) {
//       const startX = (startTime / duration) * width;
//       const endX = (endTime / duration) * width;
      
//       ctx.fillStyle = 'rgba(255, 87, 34, 0.3)';
//       ctx.fillRect(startX, 0, endX - startX, height);
      
//       ctx.strokeStyle = '#ff5722';
//       ctx.lineWidth = 2;
//       ctx.beginPath();
//       ctx.moveTo(startX, 0);
//       ctx.lineTo(startX, height);
//       ctx.moveTo(endX, 0);
//       ctx.lineTo(endX, height);
//       ctx.stroke();
//     }
    
//     if (isFinite(currentTime) && currentTime >= 0 && currentTime <= duration) {
//       const currentX = (currentTime / duration) * width;
      
//       ctx.strokeStyle = '#2196f3';
//       ctx.lineWidth = 3;
//       ctx.beginPath();
//       ctx.moveTo(currentX, 0);
//       ctx.lineTo(currentX, height);
//       ctx.stroke();
//     }
//   };

//   useEffect(() => {
//     drawSelectedRegion();
//   }, [startTime, endTime, audioBuffer, currentTime]);

//   // פונקציות עבור גרירה על הקנבס
//   const getTimeFromX = (x: number) => {
//     const canvas = canvasRef.current;
//     if (!canvas || !duration) return 0;
//     const rect = canvas.getBoundingClientRect();
//     const relativeX = x - rect.left;
//     const ratio = relativeX / canvas.offsetWidth;
//     return Math.max(0, Math.min(duration, ratio * duration));
//   };

//   const handleCanvasMouseDown = (event: React.MouseEvent) => {
//     if (!duration) return;
    
//     const time = getTimeFromX(event.clientX);
//     const startDiff = Math.abs(time - startTime);
//     const endDiff = Math.abs(time - endTime);
    
//     if (startDiff < endDiff && startDiff < duration * 0.05) {
//       setDragType('start');
//       setIsDragging(true);
//     } else if (endDiff < duration * 0.05) {
//       setDragType('end');
//       setIsDragging(true);
//     } else {
//       setStartTime(time);
//       setEndTime(time);
//       setDragType('end');
//       setIsDragging(true);
//     }
//   };

//   const handleCanvasMouseMove = (event: React.MouseEvent) => {
//     if (!isDragging || !dragType) return;
    
//     const time = getTimeFromX(event.clientX);
    
//     if (dragType === 'start') {
//       setStartTime(Math.max(0, Math.min(time, endTime - 0.1)));
//     } else if (dragType === 'end') {
//       setEndTime(Math.max(startTime + 0.1, Math.min(time, duration)));
//     }
//   };

//   const handleCanvasMouseUp = () => {
//     setIsDragging(false);
//     setDragType(null);
//   };

//   useEffect(() => {
//     if (isDragging) {
//       const handleGlobalMouseMove = (event: MouseEvent) => {
//         if (!canvasRef.current) return;
//         const fakeEvent = {
//           clientX: event.clientX
//         } as React.MouseEvent;
//         handleCanvasMouseMove(fakeEvent);
//       };

//       const handleGlobalMouseUp = () => {
//         handleCanvasMouseUp();
//       };

//       document.addEventListener('mousemove', handleGlobalMouseMove);
//       document.addEventListener('mouseup', handleGlobalMouseUp);

//       return () => {
//         document.removeEventListener('mousemove', handleGlobalMouseMove);
//         document.removeEventListener('mouseup', handleGlobalMouseUp);
//       };
//     }
//   }, [isDragging, dragType, startTime, endTime, duration]);

//   // פונקציות בקרה
//   const handlePlayPause = () => {
//     const audio = audioRef.current;
//     if (!audio || !audioBuffer) return;

//     if (isPlaying) {
//       audio.pause();
//     } else {
//       if (audio.readyState >= 2) {
//         audio.play().catch(err => {
//           console.error('Play error:', err);
//           setError('שגיאה בהפעלת השמע');
//         });
//       } else {
//         setError('השמע עדיין לא נטען');
//       }
//     }
//   };

//   const handleStop = () => {
//     const audio = audioRef.current;
//     if (!audio) return;
    
//     audio.pause();
//     audio.currentTime = 0;
//     setCurrentTime(0);
//   };

//   const handleTimeUpdate = () => {
//     const audio = audioRef.current;
//     if (audio) {
//       setCurrentTime(audio.currentTime);
//     }
//   };

//   const handleStartTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = Math.max(0, Math.min(parseFloat(event.target.value) || 0, endTime));
//     setStartTime(value);
//   };

//   const handleEndTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const value = Math.max(startTime, Math.min(parseFloat(event.target.value) || duration, duration));
//     setEndTime(value);
//   };

//   // בדיקה שהערכים תקינים לפני ביצוע פעולה
//   const canExecuteEdit = () => {
//     return audioBuffer && 
//            audioContext && 
//            isFinite(duration) && 
//            duration > 0 &&
//            isFinite(startTime) && 
//            isFinite(endTime) &&
//            startTime < endTime && 
//            startTime >= 0 && 
//            endTime <= duration && 
//            (endTime - startTime) >= 0.1 &&
//            !isLoading;
//   };

//   // פונקציה לזיהוי פורמט הקובץ
//   const getFileFormat = (fileName: string): string => {
//     const extension = fileName?.split('.').pop()?.toLowerCase();
//     return extension || 'wav';
//   };

//   // פונקציה להמרת AudioBuffer ל-MP3
//   const audioBufferToMp3 = (audioBuffer: AudioBuffer, bitRate: number = 128): ArrayBuffer => {
//     if (!isLamejsAvailable()) {
//       throw new Error('lamejs library not available');
//     }

//     try {
//       const sampleRate = audioBuffer.sampleRate;
//       const numChannels = audioBuffer.numberOfChannels;
      
//       const mp3encoder = new window.lamejs.Mp3Encoder(numChannels, sampleRate, bitRate);
//       const mp3Data: Uint8Array[] = [];
      
//       if (numChannels === 1) {
//         // מונו
//         const channelData = audioBuffer.getChannelData(0);
//         const samples = new Int16Array(audioBuffer.length);
        
//         for (let i = 0; i < audioBuffer.length; i++) {
//           samples[i] = Math.max(-32768, Math.min(32767, channelData[i] * 32767));
//         }
        
//         const mp3buf = mp3encoder.encodeBuffer(samples);
//         if (mp3buf.length > 0) {
//           mp3Data.push(mp3buf);
//         }
//       } else {
//         // סטריאו
//         const left = audioBuffer.getChannelData(0);
//         const right = audioBuffer.getChannelData(1);
//         const leftSamples = new Int16Array(audioBuffer.length);
//         const rightSamples = new Int16Array(audioBuffer.length);
        
//         for (let i = 0; i < audioBuffer.length; i++) {
//           leftSamples[i] = Math.max(-32768, Math.min(32767, left[i] * 32767));
//           rightSamples[i] = Math.max(-32768, Math.min(32767, right[i] * 32767));
//         }
        
//         const mp3buf = mp3encoder.encodeBuffer(leftSamples, rightSamples);
//         if (mp3buf.length > 0) {
//           mp3Data.push(mp3buf);
//         }
//       }
      
//       // סיום הקידוד
//       const mp3buf = mp3encoder.flush();
//       if (mp3buf.length > 0) {
//         mp3Data.push(mp3buf);
//       }
      
//       // המרה ל-ArrayBuffer
//       const totalLength = mp3Data.reduce((acc, buf) => acc + buf.length, 0);
//       const result = new Uint8Array(totalLength);
//       let offset = 0;
      
//       for (const buf of mp3Data) {
//         result.set(buf, offset);
//         offset += buf.length;
//       }
      
//       return result.buffer;
//     } catch (err) {
//       console.error('MP3 encoding error:', err);
//       throw new Error('שגיאה בהמרה ל-MP3');
//     }
//   };

//   // המרה ל-WAV
//   const audioBufferToWav = (buffer: AudioBuffer) => {
//     const length = buffer.length;
//     const numberOfChannels = buffer.numberOfChannels;
//     const sampleRate = buffer.sampleRate;
//     const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
//     const view = new DataView(arrayBuffer);
    
//     const writeString = (offset: number, string: string) => {
//       for (let i = 0; i < string.length; i++) {
//         view.setUint8(offset + i, string.charCodeAt(i));
//       }
//     };
    
//     writeString(0, 'RIFF');
//     view.setUint32(4, 36 + length * numberOfChannels * 2, true);
//     writeString(8, 'WAVE');
//     writeString(12, 'fmt ');
//     view.setUint32(16, 16, true);
//     view.setUint16(20, 1, true);
//     view.setUint16(22, numberOfChannels, true);
//     view.setUint32(24, sampleRate, true);
//     view.setUint32(28, sampleRate * numberOfChannels * 2, true);
//     view.setUint16(32, numberOfChannels * 2, true);
//     view.setUint16(34, 16, true);
//     writeString(36, 'data');
//     view.setUint32(40, length * numberOfChannels * 2, true);
    
//     let offset = 44;
//     for (let i = 0; i < length; i++) {
//       for (let channel = 0; channel < numberOfChannels; channel++) {
//         const sample = buffer.getChannelData(channel)[i];
//         const intSample = Math.max(-1, Math.min(1, sample)) * 0x7FFF;
//         view.setInt16(offset, intSample, true);
//         offset += 2;
//       }
//     }
    
//     return arrayBuffer;
//   };

//   // מחיקת חלק מהאמצע
//   const handleDeleteAudio = async () => {
//     if (!canExecuteEdit()) {
//       setError('אנא הגדר זמני התחלה וסיום תקינים');
//       return;
//     }

//     try {
//       setIsLoading(true);
      
//       const sampleRate = audioBuffer!.sampleRate;
//       const startSample = Math.floor(startTime * sampleRate);
//       const endSample = Math.floor(endTime * sampleRate);
      
//       const beforeLength = startSample;
//       const afterLength = audioBuffer!.length - endSample;
//       const newLength = beforeLength + afterLength;
      
//       if (newLength <= 0) {
//         setError('לא ניתן למחוק את כל השמע');
//         setIsLoading(false);
//         return;
//       }
      
//       const newBuffer = audioContext!.createBuffer(
//         audioBuffer!.numberOfChannels,
//         newLength,
//         sampleRate
//       );
      
//       for (let channel = 0; channel < audioBuffer!.numberOfChannels; channel++) {
//         const oldData = audioBuffer!.getChannelData(channel);
//         const newData = newBuffer.getChannelData(channel);
        
//         for (let i = 0; i < beforeLength; i++) {
//           newData[i] = oldData[i];
//         }
        
//         for (let i = 0; i < afterLength; i++) {
//           newData[beforeLength + i] = oldData[endSample + i];
//         }
//       }
      
//       setAudioBuffer(newBuffer);
//       setDuration(newBuffer.duration);
//       setStartTime(0);
//       setEndTime(newBuffer.duration);
//       setCurrentTime(0);
      
//       drawWaveform(newBuffer);
      
//       // עדכון הנגן עם הנתונים החדשים
//       updatePlayerWithNewAudio(newBuffer);
      
//       setIsLoading(false);
      
//     } catch (err) {
//       setError('שגיאה במחיקת השמע');
//       setIsLoading(false);
//       console.error('Delete audio error:', err);
//     }
//   };

//   const handleCutAudio = async () => {
//     if (!canExecuteEdit()) {
//       setError('אנא הגדר זמני התחלה וסיום תקינים');
//       return;
//     }

//     try {
//       setIsLoading(true);
      
//       const sampleRate = audioBuffer!.sampleRate;
//       const startSample = Math.floor(startTime * sampleRate);
//       const endSample = Math.floor(endTime * sampleRate);
//       const newLength = endSample - startSample;
      
//       const newBuffer = audioContext!.createBuffer(
//         audioBuffer!.numberOfChannels,
//         newLength,
//         sampleRate
//       );
      
//       for (let channel = 0; channel < audioBuffer!.numberOfChannels; channel++) {
//         const oldData = audioBuffer!.getChannelData(channel);
//         const newData = newBuffer.getChannelData(channel);
//         for (let i = 0; i < newLength; i++) {
//           newData[i] = oldData[startSample + i];
//         }
//       }
      
//       setAudioBuffer(newBuffer);
//       setDuration(newBuffer.duration);
//       setStartTime(0);
//       setEndTime(newBuffer.duration);
//       setCurrentTime(0);
      
//       drawWaveform(newBuffer);
      
//       // עדכון הנגן עם הנתונים החדשים
//       updatePlayerWithNewAudio(newBuffer);
      
//       setIsLoading(false);
      
//     } catch (err) {
//       setError('שגיאה בחיתוך השמע');
//       setIsLoading(false);
//       console.error('Cut audio error:', err);
//     }
//   };

//   // פונקציה לעדכון הנגן עם נתוני אודיו חדשים
//   const updatePlayerWithNewAudio = (newBuffer: AudioBuffer) => {
//     try {
//       const originalFormat = getFileFormat(fileName);
      
//       // המרה לפורמט המקורי לתצוגה מקדימה
//       let audioData: ArrayBuffer;
//       let mimeType: string;
      
//       if (originalFormat === 'mp3' && isLamejsAvailable()) {
//         audioData = audioBufferToMp3(newBuffer);
//         mimeType = 'audio/mpeg';
//       } else {
//         audioData = audioBufferToWav(newBuffer);
//         mimeType = 'audio/wav';
//       }
      
//       const blob = new Blob([audioData], { type: mimeType });
//       const newUrl = URL.createObjectURL(blob);
      
//       if (audioRef.current) {
//         audioRef.current.src = newUrl;
//         audioRef.current.load();
//       }
//     } catch (err) {
//       console.warn('Could not update player preview:', err);
//       // אם נכשל, נשתמש ב-WAV כ-fallback
//       const wavData = audioBufferToWav(newBuffer);
//       const blob = new Blob([wavData], { type: 'audio/wav' });
//       const newUrl = URL.createObjectURL(blob);
      
//       if (audioRef.current) {
//         audioRef.current.src = newUrl;
//         audioRef.current.load();
//       }
//     }
//   };

//   // שמירת הקובץ בפורמט המקורי - הפונקציה המושלמת!
//   const handleSave = async () => {
//     if (!audioBuffer) {
//       setError('אין נתוני שמע לשמירה');
//       return;
//     }

//     try {
//       setIsLoading(true);
      
//       // זיהוי פורמט הקובץ המקורי
//       const originalFormat = getFileFormat(fileName);
//       console.log(`🔍 Original format: ${originalFormat}`);
//       console.log(`🔍 Original filename: ${fileName}`);
      
//       // המרה לפורמט המקורי
//       let audioData: ArrayBuffer;
//       let mimeType: string;
      
//       if (originalFormat === 'mp3' && isLamejsAvailable()) {
//         console.log(`🎵 Converting back to MP3`);
//         audioData = audioBufferToMp3(audioBuffer);
//         mimeType = 'audio/mpeg'; // MIME type תקני של MP3
//       } else if (originalFormat === 'wav') {
//         console.log(`🎵 Converting back to WAV`);
//         audioData = audioBufferToWav(audioBuffer);
//         mimeType = 'audio/wav';
//       } else {
//         // fallback ל-WAV אם לא מצליח
//         console.log(`⚠️ Fallback to WAV format`);
//         audioData = audioBufferToWav(audioBuffer);
//         mimeType = 'audio/wav';
        
//         // עדכן את שם הקובץ ל-WAV אם עשינו fallback
//         const baseName = fileName?.replace(/\.[^/.]+$/, "") || 'audio_file';
//         fileName = `${baseName}.wav`;
//       }
      
//       const blob = new Blob([audioData], { type: mimeType });
      
//       // שמור עם אותו שם קובץ - להחליף את המקורי
//       const fileNameToUse = fileName || 'audio_file.wav';
      
//       console.log(`📤 Saving: ${fileNameToUse}`);
//       console.log(`📦 Format: ${originalFormat} → ${mimeType}`);
//       console.log(`📦 Blob size: ${blob.size} bytes`);
      
//       // קבלת Presigned URL עם הפורמט הנכון
//       const presignedUrl = `http://localhost:5220/api/upload/presigned-url?fileName=${encodeURIComponent(fileNameToUse)}&contentType=${encodeURIComponent(mimeType)}`;
//       console.log(`🌐 Requesting: ${presignedUrl}`);
      
//       const presignedResponse = await fetch(presignedUrl);
      
//       if (!presignedResponse.ok) {
//         const errorText = await presignedResponse.text();
//         console.error(`❌ Presigned URL failed:`, errorText);
//         throw new Error(`Failed to get presigned URL: ${presignedResponse.status} - ${errorText}`);
//       }
      
//       const { url } = await presignedResponse.json();
//       console.log(`✅ Got presigned URL for ${mimeType}`);
      
//       // העלאת הקובץ
//       const uploadResponse = await axios.put(url, blob, { 
//         headers: { 
//           "Content-Type": mimeType,
//         }, 
//       });
      
//       if (uploadResponse.status !== 200) {
//         console.error(`❌ Upload failed:`, {
//           status: uploadResponse.status,
//           statusText: uploadResponse.statusText
//         });
//         throw new Error(`Upload failed with status: ${uploadResponse.status}`);
//       }
      
//       console.log(`✅ File saved successfully: ${fileNameToUse} (${originalFormat})`);
      
//       setIsLoading(false);
//       onClose();
      
//     } catch (err) {
//       setError(`שגיאה בשמירת הקובץ: ${err instanceof Error ? err.message : 'Unknown error'}`);
//       setIsLoading(false);
//       console.error('❌ Save error:', err);
//     }
//   };

//   // פורמט זמן
//   const formatTime = (seconds: number) => {
//     if (!isFinite(seconds) || seconds < 0) {
//       return '0:00';
//     }
//     const mins = Math.floor(seconds / 60);
//     const secs = Math.floor(seconds % 60);
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="lg"
//       fullWidth
//       dir="rtl"
//       sx={{
//         '& .MuiDialog-paper': {
//           maxHeight: '90vh',
//           height: 'auto'
//         }
//       }}
//     >
//       <Box sx={{
//         bgcolor: '#1976d2',
//         color: 'white',
//         p: 3,
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         position: 'relative'
//       }}>
//         <Typography variant="h5" sx={{ fontWeight: 600, color: '#1976d2', backgroundColor: 'white', px: 3, py: 1, borderRadius: 2 }}>
//           עריכת שמע
//         </Typography>
//         <IconButton
//           onClick={onClose}
//           size="small"
//           sx={{ 
//             color: 'white',
//             position: 'absolute',
//             left: 16,
//             '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </Box>
      
//       <DialogContent 
//         sx={{ 
//           p: 0,
//           overflow: 'hidden',
//           display: 'flex',
//           flexDirection: 'column'
//         }}
//       >
//         {error && (
//           <Alert severity="error" sx={{ m: 3, mb: 0 }}>
//             {error}
//           </Alert>
//         )}
        
//         <Box sx={{ 
//           flex: 1,
//           overflowY: 'auto',
//           p: 3,
//           display: 'flex', 
//           gap: 3,
//           minHeight: 0
//         }}>
//           {audioUrl && (
//             <audio
//               ref={audioRef}
//               src={audioUrl}
//               onTimeUpdate={handleTimeUpdate}
//               onPlay={() => setIsPlaying(true)}
//               onPause={() => setIsPlaying(false)}
//               onEnded={() => setIsPlaying(false)}
//               onLoadedMetadata={() => {
//                 if (audioRef.current) {
//                   const audioDuration = audioRef.current.duration;
//                   console.log('Audio element loaded:', {
//                     duration: audioDuration,
//                     readyState: audioRef.current.readyState,
//                     src: audioRef.current.src
//                   });
                  
//                   if (isFinite(audioDuration) && audioDuration > 0) {
//                     if (!isFinite(duration) || duration <= 0) {
//                       setDuration(audioDuration);
//                       setEndTime(audioDuration);
//                     }
//                   }
//                   audioRef.current.volume = volume / 100;
//                 }
//               }}
//               style={{ display: 'none' }}
//             />
//           )}

//           <Box sx={{ 
//             flex: 1,
//             display: 'flex',
//             flexDirection: 'column',
//             gap: 3
//           }}>
//             <Box>
//               <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
//                {fileName.split('.').slice(0, -1).join('.')}
//               </Typography>
//               <Box sx={{ 
//                 border: '1px solid #e0e0e0',
//                 borderRadius: 2,
//                 p: 2,
//                 bgcolor: '#fafafa'
//               }}>
//                 <canvas
//                   ref={canvasRef}
//                   onMouseDown={handleCanvasMouseDown}
//                   onMouseMove={handleCanvasMouseMove}
//                   onMouseUp={handleCanvasMouseUp}
//                   style={{
//                     width: '100%',
//                     height: '150px',
//                     display: 'block',
//                     borderRadius: '4px',
//                     backgroundColor: '#ffffff',
//                     cursor: isDragging ? 'grabbing' : 'grab'
//                   }}
//                 />
//                 {isLoading && (
//                   <Typography variant="body2" sx={{ textAlign: 'center', mt: 2, color: 'text.secondary' }}>
//                     טוען...
//                   </Typography>
//                 )}
//               </Box>
//             </Box>

//             <Box sx={{ 
//               display: 'flex', 
//               alignItems: 'center', 
//               justifyContent: 'center',
//               gap: 2,
//               p: 3,
//               bgcolor: '#f5f5f5',
//               borderRadius: 2
//             }}>
//               <IconButton 
//                 onClick={handlePlayPause} 
//                 color="primary" 
//                 size="large"
//                 disabled={!audioBuffer}
//                 sx={{ 
//                   bgcolor: 'primary.main',
//                   color: 'white',
//                   '&:hover': { bgcolor: 'primary.dark' },
//                   '&:disabled': { bgcolor: 'grey.300' },
//                   width: 60,
//                   height: 60
//                 }}
//               >
//                 {isPlaying ? <PauseIcon sx={{ fontSize: 32 }} /> : <PlayArrowIcon sx={{ fontSize: 32 }} />}
//               </IconButton>
//               <IconButton 
//                 onClick={handleStop} 
//                 size="large"
//                 disabled={!audioBuffer}
//                 sx={{ 
//                   bgcolor: 'grey.200',
//                   '&:hover': { bgcolor: 'grey.300' },
//                   '&:disabled': { bgcolor: 'grey.100' },
//                   width: 50,
//                   height: 50
//                 }}
//               >
//                 <StopIcon sx={{ fontSize: 28 }} />
//               </IconButton>
//               <Box sx={{ textAlign: 'center', ml: 2 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 600 }}>
//                   {formatTime(currentTime)}
//                 </Typography>
//                 <Typography variant="body2" sx={{ color: 'text.secondary' }}>
//                   / {formatTime(duration)}
//                 </Typography>
//               </Box>
//             </Box>
//           </Box>

//           <Box sx={{ 
//             width: '400px',
//             display: 'flex',
//             flexDirection: 'column'
//           }}>
//             <Box sx={{ 
//               border: '2px solid #e3f2fd', 
//               borderRadius: 2, 
//               p: 3,
//               bgcolor: '#f8f9fa',
//               height: 'fit-content'
//             }}>
//               <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
//                 עריכת שמע
//               </Typography>
              
//               <Box sx={{ mb: 3 }}>
//                 <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
//                   בחר פעולה:
//                 </Typography>
//                 <Box sx={{ display: 'flex', gap: 1 }}>
//                   <Button
//                     variant={editMode === 'cut' ? 'contained' : 'outlined'}
//                     onClick={() => setEditMode('cut')}
//                     size="small"
//                     sx={{ flex: 1, py: 1 }}
//                   >
//                     חיתוך
//                   </Button>
//                   <Button
//                     variant={editMode === 'delete' ? 'contained' : 'outlined'}
//                     onClick={() => setEditMode('delete')}
//                     size="small"
//                     color="error"
//                     sx={{ flex: 1, py: 1 }}
//                   >
//                     מחיקה
//                   </Button>
//                 </Box>
//               </Box>

//               <Box sx={{ mb: 3 }}>
//                 <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
//                   הגדרות זמן:
//                 </Typography>
//                 <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//                   <TextField
//                     label="התחלה"
//                     type="number"
//                     value={startTime.toFixed(1)}
//                     onChange={handleStartTimeChange}
//                     inputProps={{
//                       min: 0,
//                       max: duration,
//                       step: 0.1
//                     }}
//                     size="small"
//                     sx={{ flex: 1 }}
//                   />
//                   <TextField
//                     label="סיום"
//                     type="number"
//                     value={endTime.toFixed(1)}
//                     onChange={handleEndTimeChange}
//                     inputProps={{
//                       min: 0,
//                       max: duration,
//                       step: 0.1
//                     }}
//                     size="small"
//                     sx={{ flex: 1 }}
//                   />
//                 </Box>
//                 <Typography variant="caption" sx={{ color: 'text.secondary' }}>
//                   נבחר: {formatTime(endTime - startTime)} ({((endTime - startTime) / duration * 100).toFixed(1)}%)
//                 </Typography>
//               </Box>

//               <Button
//                 variant="contained"
//                 onClick={editMode === 'cut' ? handleCutAudio : handleDeleteAudio}
//                 startIcon={editMode === 'cut' ? <ContentCutIcon /> : <DeleteIcon />}
//                 disabled={isLoading || startTime >= endTime || !audioBuffer}
//                 fullWidth
//                 size="medium"
//                 sx={{ py: 1.5 }}
//                 color={editMode === 'cut' ? 'primary' : 'error'}
//               >
//                 {editMode === 'cut' ? 'חתוך שמע' : 'מחק קטע'}
//               </Button>
//             </Box>
//           </Box>
//         </Box>
//       </DialogContent>
      
//       <DialogActions sx={{ 
//         px: 3, 
//         py: 2,
//         borderTop: '1px solid #e0e0e0',
//         gap: 1
//       }}>
//         <Button 
//           onClick={onClose} 
//           variant="outlined"
//           size="large"
//         >
//           סגור
//         </Button>
//         <Button 
//           variant="contained" 
//           onClick={handleSave}
//           startIcon={<SaveIcon />}
//           disabled={isLoading || !audioBuffer}
//           size="large"
//         >
//           שמור שינויים
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AudioEditModal;