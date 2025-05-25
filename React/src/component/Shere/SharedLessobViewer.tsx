// // // // import React, { useEffect, useState } from 'react';
// // // import { useSearchParams } from 'react-router-dom';
// // // import {
// // //   Container,
// // //   Card,
// // //   CardContent,
// // //   Typography,
// // //   CircularProgress,
// // //   IconButton,
// // //   Box,
// // //   TextField,
// // //   Button,
// // //   Alert,
// // //   Snackbar,
// // // } from '@mui/material';
// // // import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// // // import { useEffect, useState } from 'react';

// // // export default function SharedLessonViewer() {
// // //   const [searchParams] = useSearchParams();
// // //   const token = searchParams.get('token');
// // //   const initialEmail = searchParams.get('email') || '';
  
// // //   const [lessonData, setLessonData] = useState<any>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState('');
// // //   const [email, setEmail] = useState(initialEmail);
// // //   const [showEmailForm, setShowEmailForm] = useState(false);
// // //   const [snackbar, setSnackbar] = useState({
// // //     open: false,
// // //     message: '',
// // //     severity: 'info',
// // //   });

// // //   useEffect(() => {
// // //     if (!token) {
// // //       setError('חסר מזהה שיעור');
// // //       setLoading(false);
// // //       return;
// // //     }
    
// // //     // אם יש לנו כבר מייל, ננסה לגשת לשיעור
// // //     if (initialEmail) {
// // //       fetchLessonWithEmail();
// // //     } else {
// // //       // אין מייל, נדרוש מהמשתמש להזין כתובת
// // //       setShowEmailForm(true);
// // //       setLoading(false);
// // //     }
// // //   }, [token, initialEmail]);

// // //   const fetchLessonWithEmail = async () => {
// // //     setLoading(true);
// // //     try {
// // //       // שליחת המייל בפרמטר בשורת הכתובת
// // //       const response = await fetch(`http://localhost:5220/api/shared/${token}?email=${encodeURIComponent(email)}`);
      
// // //       // בדיקה אם התגובה היא JSON
// // //       const contentType = response.headers.get('content-type');
// // //       if (contentType && contentType.indexOf('application/json') !== -1) {
// // //         const data = await response.json();
        
// // //         if (!response.ok) {
// // //           if (data.status === 'pending') {
// // //             setError(data.message || 'בקשת גישה נשלחה למשתף. תקבל מייל כשהבקשה תאושר.');
// // //           } else {
// // //             throw new Error(data.message || 'שגיאה בגישה לשיעור');
// // //           }
// // //         } else {
// // //           // יש לנו גישה לשיעור
// // //           setLessonData(data);
// // //         }
// // //       } else {
// // //         // התגובה אינה JSON
// // //         const textError = await response.text();
// // //         throw new Error(textError || 'שגיאה בגישה לשיעור');
// // //       }
// // //     } catch (error) {
// // //       console.error('Error accessing lesson:', error);
// // //       setError(error instanceof Error ? error.message : 'שגיאה בגישה לשיעור');
      
// // //       // אם אין גישה, מציג טופס להזנת מייל
// // //       setShowEmailForm(true);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleSubmitEmail = async () => {
// // //     if (!email || !email.includes('@')) {
// // //       setSnackbar({
// // //         open: true,
// // //         message: 'אנא הזן כתובת מייל תקינה',
// // //         severity: 'error',
// // //       });
// // //       return;
// // //     }
    
// // //     // תחפש שיעור עם המייל החדש
// // //     await fetchLessonWithEmail();
// // //   };

// // //   const handleRequestAccess = async () => {
// // //     if (!email || !email.includes('@')) {
// // //       setSnackbar({
// // //         open: true,
// // //         message: 'אנא הזן כתובת מייל תקינה',
// // //         severity: 'error',
// // //       });
// // //       return;
// // //     }
    
// // //     setLoading(true);
// // //     try {
// // //       const response = await fetch('http://localhost:5220/api/shared/request-access', {
// // //         method: 'POST',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify({ token, email }),
// // //       });
      
// // //       const data = await response.json();
      
// // //       if (!response.ok) {
// // //         throw new Error(data.message || 'שגיאה בבקשת גישה');
// // //       }
      
// // //       if (data.status === 'approved') {
// // //         // כבר יש אישור גישה, נטען את השיעור
// // //         window.location.href = `?token=${token}&email=${encodeURIComponent(email)}`;
// // //       } else {
// // //         // הבקשה נשלחה אבל דורשת אישור
// // //         setError(data.message || 'נשלחה בקשת גישה לבעלים של השיעור. תקבל מייל כשהבקשה תאושר.');
// // //         setSnackbar({
// // //           open: true,
// // //           message: 'בקשת גישה נשלחה בהצלחה',
// // //           severity: 'success',
// // //         });
// // //       }
// // //     } catch (error) {
// // //       console.error('Error requesting access:', error);
// // //       setError(error instanceof Error ? error.message : 'שגיאה בבקשת גישה');
// // //       setSnackbar({
// // //         open: true,
// // //         message: error instanceof Error ? error.message : 'שגיאה בבקשת גישה',
// // //         severity: 'error',
// // //       });
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const handleCloseSnackbar = () => {
// // //     setSnackbar(prev => ({ ...prev, open: false }));
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <Box
// // //         height="100vh"
// // //         display="flex"
// // //         justifyContent="center"
// // //         alignItems="center"
// // //       >
// // //         <CircularProgress />
// // //       </Box>
// // //     );
// // //   }

// // //   // אם צריך להזין מייל
// // //   if (showEmailForm) {
// // //     return (
// // //       <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
// // //         <Snackbar
// // //           open={snackbar.open}
// // //           autoHideDuration={6000}
// // //           onClose={handleCloseSnackbar}
// // //           anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
// // //         >
// // //           <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any} variant="filled">
// // //             {snackbar.message}
// // //           </Alert>
// // //         </Snackbar>
        
// // //         <Card
// // //           sx={{
// // //             width: '100%',
// // //             padding: 4,
// // //             borderRadius: 4,
// // //             boxShadow: 4,
// // //             background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)',
// // //           }}
// // //         >
// // //           <CardContent>
// // //             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
// // //               <Typography variant="h5" fontWeight="bold" color="primary">
// // //                 גישה לשיעור משותף
// // //               </Typography>
// // //               <IconButton onClick={() => window.history.back()}>
// // //                 <ArrowBackIcon />
// // //               </IconButton>
// // //             </Box>
            
// // //             {error && (
// // //               <Alert severity="warning" sx={{ mb: 3 }}>
// // //                 {error}
// // //               </Alert>
// // //             )}
            
// // //             <Typography variant="body1" mb={3}>
// // //               כדי לצפות בשיעור זה, יש להזין את כתובת המייל שלך:
// // //             </Typography>
            
// // //             <TextField
// // //               fullWidth
// // //               label="כתובת מייל"
// // //               value={email}
// // //               onChange={(e) => setEmail(e.target.value)}
// // //               sx={{ mb: 3 }}
// // //               error={email && !email.includes('@')}
// // //               helperText={email && !email.includes('@') ? 'אנא הזן כתובת מייל תקינה' : ''}
// // //             />
            
// // //             <Box display="flex" justifyContent="center" gap={2}>
// // //               <Button 
// // //                 variant="contained" 
// // //                 color="primary" 
// // //                 onClick={handleSubmitEmail}
// // //                 disabled={!email || !email.includes('@')}
// // //               >
// // //                 כניסה לשיעור
// // //               </Button>
              
// // //               <Button 
// // //                 variant="outlined" 
// // //                 color="primary" 
// // //                 onClick={handleRequestAccess}
// // //                 disabled={!email || !email.includes('@')}
// // //               >
// // //                 בקש גישה
// // //               </Button>
// // //             </Box>
// // //           </CardContent>
// // //         </Card>
// // //       </Container>
// // //     );
// // //   }

// // //   // הצגת השיעור
// // //   return (
// // //     <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
// // //       <Snackbar
// // //         open={snackbar.open}
// // //         autoHideDuration={6000}
// // //         onClose={handleCloseSnackbar}
// // //         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
// // //       >
// // //         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any} variant="filled">
// // //           {snackbar.message}
// // //         </Alert>
// // //       </Snackbar>
      
// // //       <Card
// // //         sx={{
// // //           width: '100%',
// // //           padding: 4,
// // //           borderRadius: 4,
// // //           boxShadow: 4,
// // //           background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)',
// // //         }}
// // //       >
// // //         <CardContent>
// // //           <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
// // //             <Typography variant="h5" fontWeight="bold" color="primary">
// // //               צפייה בשיעור משותף
// // //             </Typography>
// // //             <IconButton onClick={() => window.history.back()}>
// // //               <ArrowBackIcon />
// // //             </IconButton>
// // //           </Box>

// // //           <Typography variant="h6" color="text.secondary" mb={2} textAlign="center">
// // //             {lessonData?.LessonName}
// // //           </Typography>

// // //           {error ? (
// // //             <Alert severity="error" sx={{ mb: 3 }}>
// // //               {error}
// // //             </Alert>
// // //           ) : (
// // //             <Box display="flex" justifyContent="center">
// // //               <audio controls style={{ width: '100%', borderRadius: 8 }}>
// // //                 <source src={lessonData?.Url} type="audio/mp3" />
// // //                 הדפדפן שלך לא תומך בניגון שמע.
// // //               </audio>
// // //             </Box>
// // //           )}
// // //         </CardContent>
// // //       </Card>
// // //     </Container>
// // //   );
// // // }



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
// //   TextField,
// //   Button,
// //   Alert,
// //   Snackbar,
// //   InputAdornment,
// // } from '@mui/material';
// // import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// // import EmailIcon from '@mui/icons-material/Email';
// // import VpnKeyIcon from '@mui/icons-material/VpnKey';

// // export default function SharedLessonViewer() {
// //   const [searchParams] = useSearchParams();
// //   const token = searchParams.get('token');
  
// //   const [lessonData, setLessonData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [showEmailForm, setShowEmailForm] = useState(false);
// //   const [showCodeForm, setShowCodeForm] = useState(false);
// //   const [verificationCode, setVerificationCode] = useState('');
// //   const [showAccessRequestForm, setShowAccessRequestForm] = useState(false);
// //   const [snackbar, setSnackbar] = useState({
// //     open: false,
// //     message: '',
// //     severity: 'info',
// //   });

// //   useEffect(() => {
// //     if (!token) {
// //       setError('חסר מזהה שיעור');
// //       setLoading(false);
// //       return;
// //     }
    
// //     // בדיקה ראשונית - האם השיעור פתוח או שצריך אימות
// //     fetchInitialLessonInfo();
// //   }, [token]);

// //   const fetchInitialLessonInfo = async () => {
// //     setLoading(true);
// //     try {
// //       const response = await fetch(`http://localhost:5220/api/shared/${token}`);
      
// //       if (!response.ok) {
// //         throw new Error(await response.text() || 'שגיאה בגישה לשיעור');
// //       }
      
// //       const data = await response.json();
      
// //       if (data.needsVerification) {
// //         // שיעור מוגבל - צריך להזין מייל
// //         setShowEmailForm(true);
// //         setLoading(false);
// //       } else if (data.Url) {
// //         // שיעור פתוח - אפשר לגשת ישירות
// //         setLessonData(data);
// //         setLoading(false);
// //       } else {
// //         throw new Error('תשובה לא תקינה מהשרת');
// //       }
// //     } catch (error) {
// //       console.error('Error accessing lesson:', error);
// //       setError(error instanceof Error ? error.message : 'שגיאה בגישה לשיעור');
// //       setLoading(false);
// //     }
// //   };

// //   const handleSubmitEmail = async () => {
// //     if (!email || !email.includes('@')) {
// //       setSnackbar({
// //         open: true,
// //         message: 'אנא הזן כתובת מייל תקינה',
// //         severity: 'error',
// //       });
// //       return;
// //     }
    
// //     setLoading(true);
// //     try {
// //       const response = await fetch('http://localhost:5220/api/shared/send-verification', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ token, email }),
// //       });
      
// //       const data = await response.json();
      
// //       if (!response.ok) {
// //         throw new Error(data.message || 'שגיאה בשליחת קוד אימות');
// //       }
      
// //       if (data.isPublic) {
// //         // שיעור ציבורי - נטען אותו ישירות
// //         fetchInitialLessonInfo();
// //       } else if (data.needsAccessRequest) {
// //         // מייל שונה מהמורשה - נציג טופס בקשת גישה
// //         setShowEmailForm(false);
// //         setShowAccessRequestForm(true);
// //         setLoading(false);
// //       } else {
// //         // נשלח קוד אימות - נציג טופס להזנת הקוד
// //         setShowEmailForm(false);
// //         setShowCodeForm(true);
// //         setLoading(false);
// //         setSnackbar({
// //           open: true,
// //           message: 'קוד אימות נשלח לכתובת המייל שהזנת',
// //           severity: 'success',
// //         });
// //       }
// //     } catch (error) {
// //       console.error('Error sending verification code:', error);
// //       setError(error instanceof Error ? error.message : 'שגיאה בשליחת קוד אימות');
// //       setLoading(false);
// //     }
// //   };

// //   const handleVerifyCode = async () => {
// //     if (!verificationCode || verificationCode.length !== 6) {
// //       setSnackbar({
// //         open: true,
// //         message: 'אנא הזן קוד אימות תקין (6 ספרות)',
// //         severity: 'error',
// //       });
// //       return;
// //     }
    
// //     setLoading(true);
// //     try {
// //       const response = await fetch('http://localhost:5220/api/shared/verify-code', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ token, email, code: verificationCode }),
// //       });
      
// //       const data = await response.json();
      
// //       if (!response.ok) {
// //         throw new Error(data.message || 'קוד אימות שגוי או שפג תוקפו');
// //       }
      
// //       // אימות הצליח - הצגת השיעור
// //       setLessonData(data);
// //       setShowCodeForm(false);
// //       setLoading(false);
// //       setSnackbar({
// //         open: true,
// //         message: 'אימות הצליח, נטען את השיעור',
// //         severity: 'success',
// //       });
// //     } catch (error) {
// //       console.error('Error verifying code:', error);
// //       setError(error instanceof Error ? error.message : 'שגיאה באימות הקוד');
// //       setLoading(false);
// //       setSnackbar({
// //         open: true,
// //         message: error instanceof Error ? error.message : 'שגיאה באימות הקוד',
// //         severity: 'error',
// //       });
// //     }
// //   };

// //   const handleRequestAccess = async () => {
// //     if (!email || !email.includes('@')) {
// //       setSnackbar({
// //         open: true,
// //         message: 'אנא הזן כתובת מייל תקינה',
// //         severity: 'error',
// //       });
// //       return;
// //     }
    
// //     setLoading(true);
// //     try {
// //       const response = await fetch('http://localhost:5220/api/shared/request-access', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ token, email }),
// //       });
      
// //       const data = await response.json();
      
// //       if (!response.ok) {
// //         throw new Error(data.message || 'שגיאה בבקשת גישה');
// //       }
      
// //       if (data.status === 'approved') {
// //         // כבר יש אישור גישה, נטען את השיעור
// //         fetchInitialLessonInfo();
// //       } else if (data.status === 'needs_verification') {
// //         // צריך לאמת את המייל עם קוד
// //         setShowAccessRequestForm(false);
// //         setShowEmailForm(false);
// //         setShowCodeForm(true);
// //         setLoading(false);
// //         setSnackbar({
// //           open: true,
// //           message: 'נא לאמת את כתובת המייל שלך. קוד אימות נשלח אליך.',
// //           severity: 'info',
// //         });
// //       } else {
// //         // הבקשה נשלחה אבל דורשת אישור
// //         setError(data.message || 'נשלחה בקשת גישה לבעלים של השיעור. תקבל מייל כשהבקשה תאושר.');
// //         setShowAccessRequestForm(false);
// //         setLoading(false);
// //         setSnackbar({
// //           open: true,
// //           message: 'בקשת גישה נשלחה בהצלחה',
// //           severity: 'success',
// //         });
// //       }
// //     } catch (error) {
// //       console.error('Error requesting access:', error);
// //       setError(error instanceof Error ? error.message : 'שגיאה בבקשת גישה');
// //       setLoading(false);
// //       setSnackbar({
// //         open: true,
// //         message: error instanceof Error ? error.message : 'שגיאה בבקשת גישה',
// //         severity: 'error',
// //       });
// //     }
// //   };

// //   const handleCloseSnackbar = () => {
// //     setSnackbar(prev => ({ ...prev, open: false }));
// //   };

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

// //   // אם צריך להזין מייל
// //   if (showEmailForm) {
// //     return (
// //       <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
// //         <Snackbar
// //           open={snackbar.open}
// //           autoHideDuration={6000}
// //           onClose={handleCloseSnackbar}
// //           anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
// //         >
// //           <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any} variant="filled">
// //             {snackbar.message}
// //           </Alert>
// //         </Snackbar>
        
// //         <Card
// //           sx={{
// //             width: '100%',
// //             padding: 4,
// //             borderRadius: 4,
// //             boxShadow: 4,
// //             background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)',
// //           }}
// //         >
// //           <CardContent>
// //             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
// //               <Typography variant="h5" fontWeight="bold" color="primary">
// //                 גישה לשיעור משותף
// //               </Typography>
// //               <IconButton onClick={() => window.history.back()}>
// //                 <ArrowBackIcon />
// //               </IconButton>
// //             </Box>
            
// //             {error && (
// //               <Alert severity="warning" sx={{ mb: 3 }}>
// //                 {error}
// //               </Alert>
// //             )}
            
// //             <Typography variant="body1" mb={3}>
// //               כדי לצפות בשיעור זה, יש להזין את כתובת המייל שלך:
// //             </Typography>
            
// //             <TextField
// //               fullWidth
// //               label="כתובת מייל"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               InputProps={{
// //                 startAdornment: (
// //                   <InputAdornment position="start">
// //                     <EmailIcon />
// //                   </InputAdornment>
// //                 ),
// //               }}
// //               sx={{ mb: 3 }}
// //               error={email && !email.includes('@')}
// //               helperText={email && !email.includes('@') ? 'אנא הזן כתובת מייל תקינה' : ''}
// //             />
            
// //             <Box display="flex" justifyContent="center">
// //               <Button 
// //                 variant="contained" 
// //                 color="primary" 
// //                 onClick={handleSubmitEmail}
// //                 disabled={!email || !email.includes('@')}
// //                 size="large"
// //               >
// //                 המשך
// //               </Button>
// //             </Box>
// //           </CardContent>
// //         </Card>
// //       </Container>
// //     );
// //   }

// //   // אם צריך להזין קוד אימות
// //   if (showCodeForm) {
// //     return (
// //       <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
// //         <Snackbar
// //           open={snackbar.open}
// //           autoHideDuration={6000}
// //           onClose={handleCloseSnackbar}
// //           anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
// //         >
// //           <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any} variant="filled">
// //             {snackbar.message}
// //           </Alert>
// //         </Snackbar>
        
// //         <Card
// //           sx={{
// //             width: '100%',
// //             padding: 4,
// //             borderRadius: 4,
// //             boxShadow: 4,
// //             background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)',
// //           }}
// //         >
// //           <CardContent>
// //             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
// //               <Typography variant="h5" fontWeight="bold" color="primary">
// //                 אימות כתובת מייל
// //               </Typography>
// //               <IconButton onClick={() => {
// //                 setShowCodeForm(false);
// //                 setShowEmailForm(true);
// //               }}>
// //                 <ArrowBackIcon />
// //               </IconButton>
// //             </Box>
            
// //             {error && (
// //               <Alert severity="warning" sx={{ mb: 3 }}>
// //                 {error}
// //               </Alert>
// //             )}
            
// //             <Typography variant="body1" mb={1}>
// //               קוד אימות נשלח לכתובת: {email}
// //             </Typography>
            
// //             <Typography variant="body2" color="text.secondary" mb={3}>
// //               אנא הזן את הקוד בן 6 הספרות שקיבלת במייל.
// //             </Typography>
            
// //             <TextField
// //               fullWidth
// //               label="קוד אימות"
// //               value={verificationCode}
// //               onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
// //               inputProps={{ maxLength: 6, inputMode: 'numeric' }}
// //               InputProps={{
// //                 startAdornment: (
// //                   <InputAdornment position="start">
// //                     <VpnKeyIcon />
// //                   </InputAdornment>
// //                 ),
// //               }}
// //               sx={{ mb: 3 }}
// //               error={verificationCode.length > 0 && verificationCode.length !== 6}
// //               helperText={verificationCode.length > 0 && verificationCode.length !== 6 ? 'הקוד חייב להכיל 6 ספרות' : ''}
// //             />
            
// //             <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
// //               <Button 
// //                 variant="contained" 
// //                 color="primary" 
// //                 onClick={handleVerifyCode}
// //                 disabled={!verificationCode || verificationCode.length !== 6}
// //                 size="large"
// //                 fullWidth
// //               >
// //                 אמת קוד
// //               </Button>
              
// //               <Button 
// //                 variant="text" 
// //                 color="primary" 
// //                 onClick={handleSubmitEmail}
// //                 size="small"
// //               >
// //                 שלח שוב את הקוד
// //               </Button>
// //             </Box>
// //           </CardContent>
// //         </Card>
// //       </Container>
// //     );
// //   }

// //   // אם צריך לבקש גישה מהמורה
// //   if (showAccessRequestForm) {
// //     return (
// //       <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
// //         <Snackbar
// //           open={snackbar.open}
// //           autoHideDuration={6000}
// //           onClose={handleCloseSnackbar}
// //           anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
// //         >
// //           <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any} variant="filled">
// //             {snackbar.message}
// //           </Alert>
// //         </Snackbar>
        
// //         <Card
// //           sx={{
// //             width: '100%',
// //             padding: 4,
// //             borderRadius: 4,
// //             boxShadow: 4,
// //             background: 'linear-gradient(to bottom right, #f0f4ff, #ffffff)',
// //           }}
// //         >
// //           <CardContent>
// //             <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
// //               <Typography variant="h5" fontWeight="bold" color="primary">
// //                 בקשת גישה לשיעור
// //               </Typography>
// //               <IconButton onClick={() => {
// //                 setShowAccessRequestForm(false);
// //                 setShowEmailForm(true);
// //               }}>
// //                 <ArrowBackIcon />
// //               </IconButton>
// //             </Box>
            
// //             {error && (
// //               <Alert severity="warning" sx={{ mb: 3 }}>
// //                 {error}
// //               </Alert>
// //             )}
            
// //             <Typography variant="body1" mb={3}>
// //               כתובת המייל שהזנת ({email}) אינה מורשית לצפות בשיעור זה. 
// //               האם ברצונך לשלוח בקשת גישה למורה?
// //             </Typography>
            
// //             <Box display="flex" justifyContent="center" gap={2}>
// //               <Button 
// //                 variant="contained" 
// //                 color="primary" 
// //                 onClick={handleRequestAccess}
// //                 size="large"
// //               >
// //                 בקש גישה
// //               </Button>
              
// //               <Button 
// //                 variant="outlined" 
// //                 color="primary" 
// //                 onClick={() => {
// //                   setShowAccessRequestForm(false);
// //                   setShowEmailForm(true);
// //                 }}
// //               >
// //                 חזרה
// //               </Button>
// //             </Box>
// //           </CardContent>
// //         </Card>
// //       </Container>
// //     );
// //   }

// //   // הצגת השיעור
// //   return (
// //     <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
// //       <Snackbar
// //         open={snackbar.open}
// //         autoHideDuration={6000}
// //         onClose={handleCloseSnackbar}
// //         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
// //       >
// //         <Alert onClose={handleCloseSnackbar} severity={snackbar.severity as any} variant="filled">
// //           {snackbar.message}
// //         </Alert>
// //       </Snackbar>
      
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
// //             <IconButton onClick={() => window.history.back()}>
// //               <ArrowBackIcon />
// //             </IconButton>
// //           </Box>

// //           <Typography variant="h6" color="text.secondary" mb={2} textAlign="center">
// //             {lessonData?.LessonName}
// //           </Typography>

// //           {error ? (
// //             <Alert severity="error" sx={{ mb: 3 }}>
// //               {error}
// //             </Alert>
// //           ) : (
// //             <Box display="flex" justifyContent="center">
// //               <audio controls style={{ width: '100%', borderRadius: 8 }}>
// //                 <source src={lessonData?.url} type="audio/mp3" />
// //                 הדפדפן שלך לא תומך בניגון שמע.
// //               </audio>
// //             </Box>
// //           )}
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
//   InputAdornment,
// } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import EmailIcon from '@mui/icons-material/Email';
// import VpnKeyIcon from '@mui/icons-material/VpnKey';

// export default function SharedLessonViewer() {
//   const [searchParams] = useSearchParams();
//   const token = searchParams.get('token');
  
//   const [lessonData, setLessonData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [email, setEmail] = useState('');
//   const [showEmailForm, setShowEmailForm] = useState(false);
//   const [showCodeForm, setShowCodeForm] = useState(false);
//   const [verificationCode, setVerificationCode] = useState('');
//   const [showAccessRequestForm, setShowAccessRequestForm] = useState(false);
//   const [targetEmail, setTargetEmail] = useState('');
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
    
//     // בדיקה ראשונית - האם השיעור פתוח או שצריך אימות
//     fetchInitialLessonInfo();
//   }, [token]);

//   const fetchInitialLessonInfo = async () => {
//     setLoading(true);
//     try {
//       console.log("Fetching initial lesson info for token:", token);
//       const response = await fetch(`http://localhost:5220/api/shared/${token}`);
      
//       if (!response.ok) {
//         console.error("Server returned error:", response.status, response.statusText);
//         throw new Error(await response.text() || 'שגיאה בגישה לשיעור');
//       }
      
//       const data = await response.json();
//       console.log("Server response data:", data);
      
//       // בדיקה אם זה שיעור ציבורי או שיש כבר גישה ישירה
//       if (data.isPublic === true || (data.Url || data.url)) {
//         console.log("Public lesson detected, showing content directly");
//         setLessonData(data);
//         setShowEmailForm(false);
//         setShowCodeForm(false);
//         setShowAccessRequestForm(false);
//       } 
//       // אם נדרש אימות - הצג טופס מייל
//       else if (data.needsVerification) {
//         console.log("Restricted lesson detected, showing email form");
//         setTargetEmail(data.targetEmail || '');
//         setShowEmailForm(true);
//       } 
//       else {
//         console.error("Unexpected response format:", data);
//         throw new Error('תשובה לא תקינה מהשרת');
//       }
//     } catch (error) {
//       console.error('Error accessing lesson:', error);
//       setError(error instanceof Error ? error.message : 'שגיאה בגישה לשיעור');
//     } finally {
//       setLoading(false);
//     }
//   };
    
//   const handleVerifyCode = async () => {
//     if (!verificationCode || verificationCode.length !== 6) {
//       setSnackbar({
//         open: true,
//         message: 'אנא הזן קוד אימות תקין (6 ספרות)',
//         severity: 'error',
//       });
//       return;
//     }
    
//     setLoading(true);
//     try {
//       console.log("Verifying code:", verificationCode);
//       const response = await fetch('http://localhost:5220/api/shared/verify-code', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token, email, code: verificationCode }),
//       });
      
//       const data = await response.json();
//       console.log("Code verification response:", data);
      
//       if (!response.ok) {
//         throw new Error(data.message || 'קוד אימות שגוי או שפג תוקפו');
//       }
      
//       // אימות הצליח - הצגת השיעור
//       setLessonData(data);
//       setShowCodeForm(false);
//       setLoading(false);
//       setSnackbar({
//         open: true,
//         message: 'אימות הצליח, נטען את השיעור',
//         severity: 'success',
//       });
//     } catch (error) {
//       console.error('Error verifying code:', error);
//       setError(error instanceof Error ? error.message : 'שגיאה באימות הקוד');
//       setLoading(false);
//       setSnackbar({
//         open: true,
//         message: error instanceof Error ? error.message : 'שגיאה באימות הקוד',
//         severity: 'error',
//       });
//     }
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
//       console.log("Requesting access for email:", email);
//       const response = await fetch('http://localhost:5220/api/shared/request-access', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token, email }),
//       });
      
//       const data = await response.json();
//       console.log("Access request response:", data);
      
//       if (!response.ok) {
//         throw new Error(data.message || 'שגיאה בבקשת גישה');
//       }
      
//       if (data.status === 'approved' || data.Url || data.url) {
//         // כבר יש אישור גישה, נטען את השיעור
//         console.log("Access already approved, loading lesson directly");
//         setLessonData(data);
//         setShowAccessRequestForm(false);
//         setLoading(false);
//       } else if (data.status === 'needs_verification') {
//         // צריך לאמת את המייל עם קוד
//         console.log("Email verification needed, showing code form");
//         setShowAccessRequestForm(false);
//         setShowEmailForm(false);
//         setShowCodeForm(true);
//         setLoading(false);
//         setSnackbar({
//           open: true,
//           message: 'נא לאמת את כתובת המייל שלך. קוד אימות נשלח אליך.',
//           severity: 'info',
//         });
//       } else {
//         // הבקשה נשלחה אבל דורשת אישור
//         console.log("Access request sent and pending approval");
//         setError(data.message || 'נשלחה בקשת גישה לבעלים של השיעור. תקבל מייל כשהבקשה תאושר.');
//         setShowAccessRequestForm(false);
//         setLoading(false);
//         setSnackbar({
//           open: true,
//           message: 'בקשת גישה נשלחה בהצלחה',
//           severity: 'success',
//         });
//       }
//     } catch (error) {
//       console.error('Error requesting access:', error);
//       setError(error instanceof Error ? error.message : 'שגיאה בבקשת גישה');
//       setLoading(false);
//       setSnackbar({
//         open: true,
//         message: error instanceof Error ? error.message : 'שגיאה בבקשת גישה',
//         severity: 'error',
//       });
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
    
//     setLoading(true);
    
//     try {
//       console.log("Sending email verification request for:", email);
      
//       const response = await fetch('http://localhost:5220/api/shared/send-verification', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ token, email }),
//       });
      
//       // לוג של תשובת השרת לדיבוג
//       console.log("Server response status:", response.status);
      
//       const data = await response.json();
//       console.log("Server response data:", data);
      
//       // בדיקה מדויקת של התשובה
//       if (data.isPublic) {
//         // שיעור ציבורי - נעבור ישירות להצגת השיעור
//         console.log("Public lesson - showing directly");
//         setLessonData(data);
//         setShowEmailForm(false);
//         setShowCodeForm(false);
//         setShowAccessRequestForm(false);
//       } 
//       else if (data.needsAccessRequest) {
//         // נדרשת בקשת גישה - נעבור לטופס בקשת גישה
//         console.log("Different email - showing access request form");
//         setShowEmailForm(false);
//         setShowAccessRequestForm(true);
//       } 
//       else {
//         // קוד אימות נשלח - נעבור לטופס הזנת קוד
//         console.log("Verification code sent - showing code input form");
//         setShowEmailForm(false);
//         setShowCodeForm(true);  // זו השורה החשובה! וודא שהיא מתבצעת
        
//         setSnackbar({
//           open: true,
//           message: 'קוד אימות נשלח לכתובת המייל שהזנת',
//           severity: 'success',
//         });
//       }
//     } catch (error) {
//       console.error('Error during email submission:', error);
//       setError(error instanceof Error ? error.message : 'שגיאה בשליחת קוד אימות');
//       setSnackbar({
//         open: true,
//         message: error instanceof Error ? error.message : 'שגיאה בשליחת קוד אימות',
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
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <EmailIcon />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ mb: 3 }}
//               error={email && !email.includes('@')}
//               helperText={email && !email.includes('@') ? 'אנא הזן כתובת מייל תקינה' : ''}
//             />
            
//             <Box display="flex" justifyContent="center">
//               <Button 
//                 variant="contained" 
//                 color="primary" 
//                 onClick={handleSubmitEmail}
//                 disabled={!email || !email.includes('@')}
//                 size="large"
//               >
//                 המשך
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>
//       </Container>
//     );
//   }

//   // אם צריך להזין קוד אימות
//   if (showCodeForm) {
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
//                 אימות כתובת מייל
//               </Typography>
//               <IconButton onClick={() => {
//                 setShowCodeForm(false);
//                 setShowEmailForm(true);
//               }}>
//                 <ArrowBackIcon />
//               </IconButton>
//             </Box>
            
//             {error && (
//               <Alert severity="warning" sx={{ mb: 3 }}>
//                 {error}
//               </Alert>
//             )}
            
//             <Typography variant="body1" mb={1}>
//               קוד אימות נשלח לכתובת: {email}
//             </Typography>
            
//             <Typography variant="body2" color="text.secondary" mb={3}>
//               אנא הזן את הקוד בן 6 הספרות שקיבלת במייל.
//             </Typography>
            
//             <TextField
//               fullWidth
//               label="קוד אימות"
//               value={verificationCode}
//               onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
//               inputProps={{ maxLength: 6, inputMode: 'numeric' }}
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <VpnKeyIcon />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ mb: 3 }}
//               error={verificationCode.length > 0 && verificationCode.length !== 6}
//               helperText={verificationCode.length > 0 && verificationCode.length !== 6 ? 'הקוד חייב להכיל 6 ספרות' : ''}
//             />
            
//             <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
//               <Button 
//                 variant="contained" 
//                 color="primary" 
//                 onClick={handleVerifyCode}
//                 disabled={!verificationCode || verificationCode.length !== 6}
//                 size="large"
//                 fullWidth
//               >
//                 אמת קוד
//               </Button>
              
//               <Button 
//                 variant="text" 
//                 color="primary" 
//                 onClick={handleSubmitEmail}
//                 size="small"
//               >
//                 שלח שוב את הקוד
//               </Button>
//             </Box>
//           </CardContent>
//         </Card>
//       </Container>
//     );
//   }

//   // אם צריך לבקש גישה מהמורה
//   if (showAccessRequestForm) {
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
//                 בקשת גישה לשיעור
//               </Typography>
//               <IconButton onClick={() => {
//                 setShowAccessRequestForm(false);
//                 setShowEmailForm(true);
//               }}>
//                 <ArrowBackIcon />
//               </IconButton>
//             </Box>
            
//             {error && (
//               <Alert severity="warning" sx={{ mb: 3 }}>
//                 {error}
//               </Alert>
//             )}
            
//             <Typography variant="body1" mb={3}>
//               כתובת המייל שהזנת ({email}) אינה מורשית לצפות בשיעור זה. 
//               האם ברצונך לשלוח בקשת גישה למורה?
//             </Typography>
            
//             <Box display="flex" justifyContent="center" gap={2}>
//               <Button 
//                 variant="contained" 
//                 color="primary" 
//                 onClick={handleRequestAccess}
//                 size="large"
//               >
//                 בקש גישה
//               </Button>
              
//               <Button 
//                 variant="outlined" 
//                 color="primary" 
//                 onClick={() => {
//                   setShowAccessRequestForm(false);
//                   setShowEmailForm(true);
//                 }}
//               >
//                 חזרה
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
//                 <source src={lessonData?.url || lessonData?.url} type="audio/mp3" />
//                 הדפדפן שלך לא תומך בניגון שמע.
//               </audio>
//             </Box>
//           )}
//         </CardContent>
//       </Card>
//     </Container>
//   );
// }
