
// // import React, { useEffect, useState } from 'react';
// // import { useSearchParams } from 'react-router-dom';
// // import {
// //   Container,
// //   Card,
// //   CardContent,
// //   Typography,
// //   CircularProgress,
// //   IconButton,
// //   Box,
// // } from '@mui/material';
// // import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// // export default function SharedLessonViewer() {
// //   const [searchParams] = useSearchParams();
// //   const token = searchParams.get('token');
// //   const [lessonData, setLessonData] = useState<any>(null);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     fetch(`http://localhost:5220/api/shared/${token}`)
// //       .then(res => res.json())
// //       .then(data => {
// //         setLessonData(data);
// //         setLoading(false);
// //       });
// //   }, [token]);

// //   if (loading) {
// //     return (
// //       <Box
// //         height="100vh"
// //         display="flex"
// //         justifyContent="center"
// //         alignItems="center"
// //       >
// //         <CircularProgress />
// //       </Box>
// //     );
// //   }

// //   return (
// //     <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
// //       <Card
// //         sx={{
// //           width: '100%',
// //           padding: 4,
// //           borderRadius: 4,
// //           boxShadow: 4,
// //           background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)',
// //         }}
// //       >
// //         <CardContent>
// //           <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
// //             <Typography variant="h5" fontWeight="bold" color="primary">
// //               צפייה בשיעור משותף
// //             </Typography>
// //             <IconButton onClick={() => window.close()}>
// //               <ArrowBackIcon />
// //             </IconButton>
// //           </Box>

// //           <Typography variant="h6" color="text.secondary" mb={2} textAlign="center">
// //             {lessonData?.LessonName}
// //           </Typography>

// //           <Box display="flex" justifyContent="center">
// //             <audio controls style={{ width: '100%', borderRadius: 8 }}>
// //               <source src={lessonData.url} type="audio/mp3" />
// //               הדפדפן שלך לא תומך בניגון שמע.
// //             </audio>
// //           </Box>
// //           {/* <Box sx={{ p: 4, textAlign: "center" }}>       <Typography variant="h4" gutterBottom>{lessonData.lessonName}</Typography>
// //        <audio controls src={lessonData.url} style={{ width: "100%", maxWidth: 600 }} />
// //     </Box> */}
// //         </CardContent>
// //       </Card>
// //     </Container>
// //   );
// // }



// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import {
//   Container,
//   Card,
//   CardContent,
//   Typography,
//   CircularProgress,
//   IconButton,
//   Box,
//   TextField,
//   Button,
//   Alert,
//   Snackbar,
// } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// export default function SharedLessonViewer() {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get('token');
//   const initialEmail = searchParams.get('email') || '';
  
//   const [lessonData, setLessonData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [email, setEmail] = useState(initialEmail);
//   const [showEmailForm, setShowEmailForm] = useState(false);
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: '',
//     severity: 'info',
//   });

//   useEffect(() => {
//     if (!token) {
//       setError('חסר מזהה שיעור');
//       setLoading(false);
//       return;
//     }
    
//     // אם יש לנו כבר מייל, ננסה לגשת לשיעור
//     if (initialEmail) {
//       fetchLessonWithEmail();
//     } else {
//       // אין מייל, נדרוש מהמשתמש להזין כתובת
//       setShowEmailForm(true);
//       setLoading(false);
//     }
//   }, [token, initialEmail]);

//   const fetchLessonWithEmail = async () => {
//     setLoading(true);
//     try {
//       // שליחת המייל בפרמטר בשורת הכתובת
//       const response = await fetch(`http://localhost:5220/api/shared/${token}?email=${encodeURIComponent(email)}`);
      
//       // בדיקה אם התגובה היא JSON
//       const contentType = response.headers.get('content-type');
//       if (contentType && contentType.indexOf('application/json') !== -1) {
//         const data = await response.json();
        
//         if (!response.ok) {
//           if (data.status === 'pending') {
//             setError(data.message || 'בקשת גישה נשלחה למשתף. תקבל מייל כשהבקשה תאושר.');
//           } else {
//             throw new Error(data.message || 'שגיאה בגישה לשיעור');
//           }
//         } else {
//           // יש לנו גישה לשיעור
//           setLessonData(data);
//         }
//       } else {
//         // התגובה אינה JSON
//         const textError = await response.text();
//         throw new Error(textError || 'שגיאה בגישה לשיעור');
//       }
//     } catch (error) {
//       console.error('Error accessing lesson:', error);
//       setError(error instanceof Error ? error.message : 'שגיאה בגישה לשיעור');
      
//       // אם אין גישה, מציג טופס להזנת מייל
//       setShowEmailForm(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitEmail = async () => {
//     if (!email || !email.includes('@')) {
//       setSnackbar({
//         open: true,
//         message: 'אנא הזן כתובת מייל תקינה',
//         severity: 'error',
//       });
//       return;
//     }
    
//     // תחפש שיעור עם המייל החדש
//     await fetchLessonWithEmail();
//   };

//   const handleRequestAccess = async () => {
//     if (!email || !email.includes('@')) {
//       setSnackbar({
//         open: true,
//         message: 'אנא הזן כתובת מייל תקינה',
//         severity: 'error',
//       });
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:5220/api/shared/request-access', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token, email }),
//       });
      
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'שגיאה בבקשת גישה');
//       }
      
//       if (data.status === 'approved') {
//         // כבר יש אישור גישה, נטען את השיעור
//         window.location.href = `?token=${token}&email=${encodeURIComponent(email)}`;
//       } else {
//         // הבקשה נשלחה אבל דורשת אישור
//         setError(data.message || 'נשלחה בקשת גישה לבעלים של השיעור. תקבל מייל כשהבקשה תאושר.');
//         setSnackbar({
//           open: true,
//           message: 'בקשת גישה נשלחה בהצלחה',
//           severity: 'success',
//         });
//       }
//     } catch (error) {
//       console.error('Error requesting access:', error);
//       setError(error instanceof Error ? error.message : 'שגיאה בבקשת גישה');
//       setSnackbar({
//         open: true,
//         message: error instanceof Error ? error.message : 'שגיאה בבקשת גישה',
//         severity: 'error',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }));
//   };

//   if (loading) {
//     return (
//       <Box
//         height="100vh"
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//       >
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // אם צריך להזין מייל
//   if (showEmailForm) {
//     return (
//       <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={handleCloseSnackbar}
//           anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//         >
//           <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any} variant="filled">
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
        
//         <Card
//           sx={{
//             width: '100%',
//             padding: 4,
//             borderRadius: 4,
//             boxShadow: 4,
//             background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)',
//           }}
//         >
//           <CardContent>
//             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//               <Typography variant="h5" fontWeight="bold" color="primary">
//                 גישה לשיעור משותף
//               </Typography>
//               <IconButton onClick={() => window.history.back()}>
//                 <ArrowBackIcon />
//               </IconButton>
//             </Box>
            
//             {error && (
//               <Alert severity="warning" sx={{ mb: 3 }}>
//                 {error}
//               </Alert>
//             )}
            
//             <Typography variant="body1" mb={3}>
//               כדי לצפות בשיעור זה, יש להזין את כתובת המייל שלך:
//             </Typography>
            
//             <TextField
//               fullWidth
//               label="כתובת מייל"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               sx={{ mb: 3 }}
//               error={email && !email.includes('@')}
//               helperText={email && !email.includes('@') ? 'אנא הזן כתובת מייל תקינה' : ''}
//             />
            
//             <Box display="flex" justifyContent="center" gap={2}>
//               <Button 
//                 variant="contained" 
//                 color="primary" 
//                 onClick={handleSubmitEmail}
//                 disabled={!email || !email.includes('@')}
//               >
//                 כניסה לשיעור
//               </Button>
              
//               <Button 
//                 variant="outlined" 
//                 color="primary" 
//                 onClick={handleRequestAccess}
//                 disabled={!email || !email.includes('@')}
//               >
//                 בקש גישה
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>
//       </Container>
//     );
//   }

//   // הצגת השיעור
//   return (
//     <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any} variant="filled">
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
      
//       <Card
//         sx={{
//           width: '100%',
//           padding: 4,
//           borderRadius: 4,
//           boxShadow: 4,
//           background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)',
//         }}
//       >
//         <CardContent>
//           <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//             <Typography variant="h5" fontWeight="bold" color="primary">
//               צפייה בשיעור משותף
//             </Typography>
//             <IconButton onClick={() => window.history.back()}>
//               <ArrowBackIcon />
//             </IconButton>
//           </Box>

//           <Typography variant="h6" color="text.secondary" mb={2} textAlign="center">
//             {lessonData?.LessonName}
//           </Typography>

//           {error ? (
//             <Alert severity="error" sx={{ mb: 3 }}>
//               {error}
//             </Alert>
//           ) : (
//             <Box display="flex" justifyContent="center">
//               <audio controls style={{ width: '100%', borderRadius: 8 }}>
//                 <source src={lessonData?.url} type="audio/mp3" />
//                 הדפדפן שלך לא תומך בניגון שמע.
//               </audio>
//             </Box>
//           )}
//         </CardContent>
//       </Card>
//     </Container>
//   );
// }