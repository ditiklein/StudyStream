// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   Box, 
//   Button, 
//   Card, 
//   CardContent, 
//   CardHeader,
//   Typography, 
//   Stack, 
//   TextField
// } from '@mui/material';
// import { 
//   MicRounded, 
//   PauseRounded, 
//   PlayArrowRounded,
//   StopRounded, 
//   SaveRounded, 
//   VolumeUpRounded,
//   CloseRounded
// } from '@mui/icons-material';
// import FileDialog from './PersonalAreaPage/FileDialog';
// import { handleConfirmation } from './Confirmation';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from './FileAndFolderStore/FileStore';

// interface Id {
//   parentId: number | null;
// }
// export const VoiceRecorder = ({parentId}:Id) => {
//   const [recording, setRecording] = useState(false);
//   const [paused, setPaused] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [audioUrl, setAudioUrl] = useState(null);
//   const [recordingTime, setRecordingTime] = useState(0);
//   const [waveformValues, setWaveformValues] = useState(Array(20).fill(5));
//   const [lessonName, setLessonName] = useState('');
//   const [showFileDialog, setShowFileDialog] = useState(false);
//   const [files, setFiles] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState<number>(0);
//   const [aaa, setaaa] = useState(false);;

//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
//   const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
//   const mediaRecorderRef = useRef(null);
//   const audioChunksRef = useRef([]);
//   const timerRef = useRef(null);
//   const waveformTimerRef = useRef(null);
//   const audioRef = useRef(null);
//   const dispatch = useDispatch<AppDispatch>();

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaRecorderRef.current = new MediaRecorder(stream);
//       audioChunksRef.current = [];
      
//       mediaRecorderRef.current.ondataavailable = (event) => {
//         audioChunksRef.current.push(event.data);
//       };
      
//       mediaRecorderRef.current.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
//         const audioUrl = URL.createObjectURL(audioBlob);
//         setAudioBlob(audioBlob);
//         setAudioUrl(audioUrl);
//       };
      
//       mediaRecorderRef.current.start();
//       setRecording(true);
//       setPaused(false);
//       setAudioBlob(null);
//       setAudioUrl(null);
//       setRecordingTime(0);
      
//       timerRef.current = setInterval(() => {
//         setRecordingTime(prev => prev + 1);
//       }, 1000);
      
//       waveformTimerRef.current = setInterval(() => {
//         const newValues = [];
//         for (let i = 0; i < 20; i++) {
//           newValues.push(Math.random() * 45 + 5);
//         }
//         setWaveformValues(newValues);
//       }, 200);
//     } catch (error) {
//       console.error('Error accessing microphone:', error);
//     }
//   };
  
//   const pauseRecording = () => {
//     if (mediaRecorderRef.current && recording) {
//       mediaRecorderRef.current.pause();
//       clearInterval(timerRef.current);
//       clearInterval(waveformTimerRef.current);
//       setPaused(true);
//     }
//   };
//   const handleDialogClose = () => {
//     setIsDialogOpen(false);
//     if (uploadProgress > 0 && uploadProgress < 100) {
//       setUploadProgress(0);
//     }
//   };

//   const resumeRecording = () => {
//     if (mediaRecorderRef.current && paused) {
//       mediaRecorderRef.current.resume();
//       setPaused(false);
      
//       timerRef.current = setInterval(() => {
//         setRecordingTime(prev => prev + 1);
//       }, 1000);
      
//       waveformTimerRef.current = setInterval(() => {
//         const newValues = [];
//         for (let i = 0; i < 20; i++) {
//           newValues.push(Math.random() * 45 + 5);
//         }
//         setWaveformValues(newValues);
//       }, 200);
//     }
//   };
  
//   const stopRecording = () => {
//     if (mediaRecorderRef.current && recording) {
//       mediaRecorderRef.current.stop();
//       clearInterval(timerRef.current);
//       clearInterval(waveformTimerRef.current);
      
//       mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      
//       setRecording(false);
//       setPaused(false);
  
  
            
    
//     }
//   };
//   const saveRecording = () => {
//     if (audioBlob) {
//       const fileName = `${lessonName || 'recording'}-${new Date().toISOString()}.wav`;
//       const file = new File([audioBlob], fileName, { type: 'audio/wav' });
      
//       // עדכון מערך הקבצים
//       setFiles([file]);
//       setSelectedFiles([file]); // Set the selected file
//       setIsDialogOpen(true); // Open the dialog
//     }
//   };

//   const cancelRecording = () => {
//     if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
//       mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
//     }
    
//     if (timerRef.current) clearInterval(timerRef.current);
//     if (waveformTimerRef.current) clearInterval(waveformTimerRef.current);
    
//     setRecording(false);
//     setPaused(false);
//     setAudioBlob(null);
//     setAudioUrl(null);
//     setRecordingTime(0);
//     setWaveformValues(Array(20).fill(5));
//   };
  
//   const playRecording = () => {
//     if (audioRef.current && audioUrl) {
//       audioRef.current.play();
//     }
//   };
  
  
  
//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
//     const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
//     return `${mins}:${secs}`;
//   };
  
//   useEffect(() => {
//     return () => {
//       if (timerRef.current) clearInterval(timerRef.current);
//       if (waveformTimerRef.current) clearInterval(waveformTimerRef.current);
//       if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
//         mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
//       }
//       if (audioUrl) URL.revokeObjectURL(audioUrl);
//     };
//   }, [audioUrl]);
  
//   const primaryColor = "#3f51b5";
  
//   return (
//     <Card 
//     >
//       <CardHeader 
//         title={
//           <Typography variant="h5" component="div" align="center" dir="rtl" fontWeight="bold">
//             הקלטת שיעור
//           </Typography>
//         }
//         sx={{ bgcolor: primaryColor, color: 'white', pb: 1 }}
//       />
      
//       <CardContent sx={{ pt: 3 }}>
//         <TextField
//           fullWidth
//           variant="outlined"
//           label="שם השיעור"
//           value={lessonName}
//           onChange={(e) => setLessonName(e.target.value)}
//           dir="rtl"
//           sx={{ mb: 3 }}
//           InputProps={{
//             sx: { borderRadius: 2 }
//           }}
//         />
        
//         <Typography variant="h4" align="center" sx={{ fontFamily: 'monospace', color: primaryColor, mt: 1, mb: 2 }}>
//           {formatTime(recordingTime)}
//         </Typography>
        
//         <Box 
//           sx={{ 
//             height: 100, 
//             display: 'flex', 
//             alignItems: 'center', 
//             justifyContent: 'center',
//             my: 2,
//             overflow: 'hidden'
//           }}
//         >
//           <Box 
//             sx={{ 
//               width: '100%', 
//               height: '100%', 
//               display: 'flex', 
//               alignItems: 'center',
//               justifyContent: 'space-between',
//               px: 2
//             }}
//           >
//             {waveformValues.map((value, index) => (
//               <Box
//                 key={index}
//                 sx={{
//                   height: `${value}%`,
//                   width: 6,
//                   bgcolor: primaryColor,
//                   borderRadius: 4,
//                   transition: 'height 0.2s ease'
//                 }}
//               />
//             ))}
//           </Box>
//         </Box>
        
//         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//           {!recording && !audioUrl ? (
//             <Button
//               variant="contained"
//               color="primary"
//               startIcon={<MicRounded />}
//               onClick={startRecording}
//               size="large"
//               dir="rtl"
//               sx={{ 
//                 borderRadius: 28, 
//                 px: 4, 
//                 py: 1.5,
//                 bgcolor: primaryColor,
//                 '&:hover': {
//                   bgcolor: '#303f9f'
//                 },
//                 fontSize: '1.1rem' 
//               }}
//             >
//               התחל הקלטה
//             </Button>
//           ) : recording ? (
//             <Stack 
//               direction="row" 
//               spacing={4}  // Increased spacing between buttons
//               justifyContent="center"
//             >
//               {!paused ? (
//                 <Button
//                   variant="contained"
//                   startIcon={<PauseRounded />}
//                   onClick={pauseRecording}
//                   size="large"
//                   dir="rtl"
//                   sx={{ 
//                     borderRadius: 28, 
//                     px: 3, 
//                     bgcolor: primaryColor,
//                     '&:hover': {
//                       bgcolor: '#303f9f'
//                     }
//                   }}
//                 >
//                   השהה
//                 </Button>
//               ) : (
//                 <Button
//                   variant="contained"
//                   startIcon={<PlayArrowRounded />}
//                   onClick={resumeRecording}
//                   size="large"
//                   dir="rtl"
//                   sx={{ 
//                     borderRadius: 28, 
//                     px: 3, 
//                     bgcolor: primaryColor,
//                     '&:hover': {
//                       bgcolor: '#303f9f'
//                     }
//                   }}
//                 >
//                   המשך
//                 </Button>
//               )}
//               <Button
//                 variant="contained"
//                 startIcon={<StopRounded />}
//                 onClick={stopRecording}
//                 size="large"
//                 dir="rtl"
//                 sx={{ 
//                   borderRadius: 28, 
//                   px: 3, 
//                   bgcolor: primaryColor,
//                   '&:hover': {
//                     bgcolor: '#303f9f'
//                   }
//                 }}
//               >
//                 סיים
//               </Button>
//             </Stack>
//           ) : (
//             <Stack 
//               direction="row" 
//               spacing={4}  // Increased spacing between buttons
//               justifyContent="center"
//             >
//               <Button
//                 variant="contained"
//                 startIcon={<VolumeUpRounded />}
//                 onClick={playRecording}
//                 dir="rtl"
//                 sx={{ 
//                   borderRadius: 28, 
//                   px: 3, 
//                   bgcolor: primaryColor,
//                   '&:hover': {
//                     bgcolor: '#303f9f'
//                   }
//                 }}
//               >
//                 האזן
//               </Button>
//               <Button
//                 variant="contained"
//                 startIcon={<SaveRounded />}
//                 onClick={saveRecording}
//                 dir="rtl"
//                 sx={{ 
//                   borderRadius: 28, 
//                   px: 3, 
//                   bgcolor: primaryColor,
//                   '&:hover': {
//                     bgcolor: '#303f9f'
//                   }
//                 }}
//               >
//                 שמור
//               </Button>
//               <Button
//                  variant="contained"
//                  startIcon={<CloseRounded />}
//                   onClick={cancelRecording}  // שינוי מ-saveRecording ל-cancelRecording
//                 dir="rtl"
//                 sx={{ 
//                borderRadius: 28, 
//                 px: 3, 
//                bgcolor: primaryColor,
//               '&:hover': {
//                bgcolor: '#303f9f'
//              }
//   }}
// >
//   ביטול
//    </Button>

//             </Stack>
//           )}
//         </Box>

//      {audioUrl && (
//   <audio ref={audioRef} src={audioUrl} style={{ display: 'none' }} />
// )}
//     {isDialogOpen&&<FileDialog
//         open={isDialogOpen}
//         files={selectedFiles}
//         onClose={handleDialogClose}
//         onConfirm={(files, shouldUpload) =>
//           handleConfirmation(
//             files,
//             shouldUpload,
//             parentId,
//             dispatch,
//             setUploadProgress,
//             setIsDialogOpen,
//             setSelectedFiles
//           )
//         }
        
//         uploadProgress={uploadProgress}
//       />
  
// } 
//       </CardContent>
//     </Card>
//   );
// };
