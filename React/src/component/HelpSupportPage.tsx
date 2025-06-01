// import { useState } from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Card,
  
//   Accordion,
//   AccordionSummary,
//   AccordionDetails,
//   TextField,
//   Button,
//   MenuItem,
//   Grid,
//   Chip,
//   Paper,
//   Divider,
//   Stack,
//   Avatar,
//   Alert
// } from '@mui/material';
// import {
//   ExpandMore as ExpandMoreIcon,
//   Mail as MailIcon,
//   Phone as PhoneIcon,
//   Send as SendIcon,
//   CheckCircle as CheckCircleIcon,
//   People as PeopleIcon,
//   Schedule as ScheduleIcon,
//   Star as StarIcon,
//   Security as SecurityIcon
// } from '@mui/icons-material';
// import { createTheme, ThemeProvider } from '@mui/material/styles';

// // תמת צבעים מותאמת לאפליקציה
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#3b82f6', // כחול
//     },
//     secondary: {
//       main: '#8b5cf6', // סגול
//     },
//     tertiary: {
//       main: '#ec4899', // ורוד
//     },
//     background: {
//       default: '#ffffff',
//       paper: '#ffffff',
//     },
//   },
//   direction: 'rtl',
//   typography: {
//     fontFamily: '"Segoe UI", "Roboto", sans-serif',
//   },
// });

// const HelpSupportPage = () => {
//   const [openFaq, setOpenFaq] = useState(null);
//   const [contactForm, setContactForm] = useState({
//     name: '',
//     email: '',
//     subject: '',
//     message: ''
//   });
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   const faqData = [
//     {
//       id: 1,
//       question: "איך אני יוצר חשבון חדש?",
//       answer: "ליצירת חשבון חדש, לחץ על כפתור 'הרשמה' בראש העמוד, מלא את הפרטים הנדרשים כמו שם, אימייל וסיסמה, ואשר את כתובת המייל שלך דרך הקישור שנשלח אליך.",
//       category: "חשבון",
//       color: "primary"
//     },
//     {
//       id: 2,
//       question: "איך אני משנה את הסיסמה שלי?",
//       answer: "כדי לשנות סיסמה, היכנס לחשבון שלך, לך להגדרות חשבון, בחר 'שינוי סיסמה', הזן את הסיסמה הנוכחית ואת הסיסמה החדשה פעמיים.",
//       category: "אבטחה",
//       color: "success"
//     },
//     {
//       id: 3,
//       question: "איך אני יכול לעדכן את הפרטים האישיים שלי?",
//       answer: "ניתן לעדכן פרטים אישיים דרך דף הפרופיל שלך. היכנס לחשבון, לחץ על 'הפרופיל שלי', ערוך את הפרטים הרצויים ושמור את השינויים.",
//       category: "פרופיל",
//       color: "secondary"
//     },
//     {
//       id: 4,
//       question: "מה עליי לעשות אם שכחתי את הסיסמה?",
//       answer: "אם שכחת את הסיסמה, לחץ על 'שכחתי סיסמה' בדף ההתחברות, הזן את כתובת המייל שלך, ותקבל קישור לאיפוס הסיסמה במייל תוך דקות ספורות.",
//       category: "אבטחה",
//       color: "success"
//     },
//     {
//       id: 5,
//       question: "איך אני מוחק את החשבון שלי?",
//       answer: "למחיקת חשבון, פנה אלינו דרך טופס יצירת הקשר למטה או שלח מייל ישירות. שים לב שמחיקת החשבון היא בלתי הפיכה ונמחק את כל הנתונים שלך.",
//       category: "חשבון",
//       color: "primary"
//     },
//     {
//       id: 6,
//       question: "האם המידע שלי מאובטח?",
//       answer: "כן! אנו משתמשים בהצפנת SSL 256-bit וציות מלא ל-GDPR. כל הנתונים מאוחסנים בשרתים מוגנים עם גיבויים יומיים ובדיקות אבטחה קבועות.",
//       category: "אבטחה",
//       color: "success"
//     },
//     {
//       id: 7,
//       question: "מהו זמן המענה של התמיכה?",
//       answer: "אנו מתחייבים למענה תוך 2 שעות בממוצע בימי חול. בסופי שבוע הזמן עלול להיות עד 24 שעות. לבעיות דחופות יש לנו מענה מיידי בטלפון.",
//       category: "תמיכה",
//       color: "warning"
//     },
//     {
//       id: 8,
//       question: "איך אני יכול לייצא את הנתונים שלי?",
//       answer: "ניתן לייצא את כל הנתונים שלך בפורמט JSON או CSV דרך הגדרות החשבון. העיבוד לוקח עד 24 שעות ותקבל קישור הורדה במייל.",
//       category: "נתונים",
//       color: "info"
//     }
//   ];

//   const stats = [
//     { icon: PeopleIcon, number: "10,000+", label: "משתמשים מרוצים", color: "#3b82f6" },
//     { icon: ScheduleIcon, number: "< 2 שעות", label: "זמן מענה ממוצע", color: "#8b5cf6" },
//     { icon: StarIcon, number: "4.9/5", label: "דירוג שביעות רצון", color: "#ec4899" },
//     { icon: SecurityIcon, number: "99.9%", label: "זמינות מערכת", color: "#10b981" }
//   ];

//   const subjectOptions = [
//     { value: 'בעיה טכנית', label: 'בעיה טכנית' },
//     { value: 'בעיות חשבון', label: 'בעיות חשבון' },
//     { value: 'חיובים ותשלומים', label: 'חיובים ותשלומים' },
//     { value: 'בקשת תכונה חדשה', label: 'בקשת תכונה חדשה' },
//     { value: 'שאלה כללית', label: 'שאלה כללית' },
//     { value: 'אחר', label: 'אחר' }
//   ];

//   return (
//     <ThemeProvider theme={theme}>
//       <Box
//         sx={{
//           minHeight: '100vh',
//           background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
//           position: 'relative',
//           '&::before': {
//             content: '""',
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             right: 0,
//             height: '6px',
//             background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
//             zIndex: 1
//           }
//         }}
//         dir="rtl"
//       >
//         <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 2 }}>
//           {/* כותרת ראשית */}
//           <Box textAlign="center" mb={8}>
//             <Typography
//               variant="h2"
//               sx={{
//                 fontWeight: 900,
//                 background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 50%, #ec4899 70%)',
//                 backgroundClip: 'text',
//                 WebkitBackgroundClip: 'text',
//                 WebkitTextFillColor: 'transparent',
//                 mb: 2
//               }}
//             >
//               מרכז עזרה ותמיכה
//             </Typography>
            
//             <Box
//               sx={{
//                 width: 120,
//                 height: 4,
//                 background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
//                 borderRadius: 2,
//                 mx: 'auto',
//                 mb: 3
//               }}
//             />
            
//             <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
//               כאן תמצא תשובות מהירות לכל השאלות שלך וצוות מקצועי שמחכה לעזור לך 24/7
//             </Typography>

//             {/* סטטיסטיקות */}
//             <Grid container spacing={3} sx={{ mt: 6, maxWidth: 800, mx: 'auto' }}>
//               {stats.map((stat, index) => (
//                 <Grid item xs={6} md={3} key={index}>
//                   <Card
//                     sx={{
//                       p: 3,
//                       textAlign: 'center',
//                       position: 'relative',
//                       overflow: 'visible',
//                       height: 180, // גובה קבוע לכל הכרטיסים
//                       display: 'flex',
//                       flexDirection: 'column',
//                       justifyContent: 'center',
//                       '&::before': {
//                         content: '""',
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         height: '3px',
//                         background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
//                         borderRadius: '4px 4px 0 0'
//                       },
//                       '&:hover': {
//                         transform: 'translateY(-4px)',
//                         transition: 'transform 0.3s ease'
//                       }
//                     }}
//                   >
//                     <Avatar
//                       sx={{
//                         bgcolor: stat.color,
//                         mx: 'auto',
//                         mb: 2,
//                         width: 48,
//                         height: 48
//                       }}
//                     >
//                       <stat.icon />
//                     </Avatar>
//                     <Typography variant="h4" fontWeight="bold" color="primary.main">
//                       {stat.number}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {stat.label}
//                     </Typography>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           </Box>

//           {/* טופס יצירת קשר - רוחב מלא */}
//           <Card
//             sx={{
//               p: 4,
//               mb: 4,
//               position: 'relative',
//               '&::before': {
//                 content: '""',
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 height: '4px',
//                 background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
//                 borderRadius: '4px 4px 0 0'
//               }
//             }}
//           >
//             <Stack direction="row" alignItems="center" spacing={2} mb={2}>
//               <MailIcon sx={{ color: 'secondary.main', fontSize: 36 }} />
//               <Typography variant="h4" fontWeight="bold">
//                 שלח הודעה למנהל
//               </Typography>
//             </Stack>
            
//             <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontStyle: 'italic' }}>
//               שלח מייל רק אם אין מענה בשאלות למטה
//             </Typography>

//             {!isSubmitted ? (
//               <Grid container spacing={3}>
//                 <Grid item xs={12} md={3}>
//                   <TextField
//                     fullWidth
//                     label="שם מלא"
//                     name="name"
//                     value={contactForm.name}
//                     variant="outlined"
//                     size="medium"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2
//                       }
//                     }}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={3}>
//                   <TextField
//                     fullWidth
//                     label="כתובת אימייל"
//                     name="email"
//                     type="email"
//                     value={contactForm.email}
//                     variant="outlined"
//                     size="medium"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2
//                       }
//                     }}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={3}>
//                   <TextField
//                     fullWidth
//                     select
//                     label="נושא הפנייה"
//                     name="subject"
//                     value={contactForm.subject}
//                     variant="outlined"
//                     size="medium"
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2
//                       }
//                     }}
//                   >
//                     {subjectOptions.map((option) => (
//                       <MenuItem key={option.value} value={option.value}>
//                         {option.label}
//                       </MenuItem>
//                     ))}
//                   </TextField>
//                 </Grid>

//                 <Grid item xs={12} md={3}>
//                   <Button
//                     fullWidth
//                     variant="contained"
//                     size="large"
//                     startIcon={<SendIcon />}
//                     sx={{
//                       py: 2,
//                       fontSize: 16,
//                       fontWeight: 'bold',
//                       borderRadius: 2,
//                       background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 50%, #ec4899 70%)',
//                       '&:hover': {
//                         background: 'linear-gradient(45deg, #2563eb 30%, #7c3aed 50%, #db2777 70%)',
//                         transform: 'translateY(-2px)',
//                         boxShadow: 6
//                       },
//                       transition: 'all 0.3s ease'
//                     }}
//                   >
//                     שלח הודעה
//                   </Button>
//                 </Grid>

//                 <Grid item xs={12}>
//                   <TextField
//                     fullWidth
//                     label="תוכן ההודעה"
//                     name="message"
//                     multiline
//                     rows={4}
//                     value={contactForm.message}
//                     variant="outlined"
//                     placeholder="כתב כאן את הודעתך בפירוט..."
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         borderRadius: 2
//                       }
//                     }}
//                   />
//                 </Grid>
//               </Grid>
//             ) : (
//               <Box textAlign="center" py={6}>
//                 <CheckCircleIcon
//                   sx={{
//                     fontSize: 80,
//                     color: 'success.main',
//                     mb: 3,
//                     animation: 'bounce 1s ease infinite'
//                   }}
//                 />
//                 <Typography variant="h4" fontWeight="bold" gutterBottom>
//                   ההודעה נשלחה בהצלחה! 🎉
//                 </Typography>
//                 <Typography variant="h6" color="text.secondary" mb={3}>
//                   תודה על פנייתך. המנהל קיבל את ההודעה ויחזור אליך תוך מקסימום 2 שעות.
//                 </Typography>
//                 <Alert severity="success" sx={{ textAlign: 'right' }}>
//                   📧 מספר הפנייה: #{Math.floor(Math.random() * 10000)}
//                 </Alert>
//               </Box>
//             )}

//             {/* מידע ליצירת קשר נוסף */}
//             <Box mt={4}>
//               <Divider sx={{ mb: 3 }} />
//               <Typography variant="h6" fontWeight="bold" mb={3}>
//                 דרכים נוספות ליצירת קשר:
//               </Typography>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={6}>
//                   <Paper
//                     sx={{
//                       p: 2,
//                       display: 'flex',
//                       alignItems: 'center',
//                       '&:hover': {
//                         bgcolor: 'grey.50'
//                       }
//                     }}
//                   >
//                     <MailIcon sx={{ color: 'primary.main', mr: 2 }} />
//                     <Typography>support@example.com</Typography>
//                   </Paper>
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Paper
//                     sx={{
//                       p: 2,
//                       display: 'flex',
//                       alignItems: 'center',
//                       '&:hover': {
//                         bgcolor: 'grey.50'
//                       }
//                     }}
//                   >
//                     <PhoneIcon sx={{ color: 'secondary.main', mr: 2 }} />
//                     <Typography>03-1234567 (א'-ה' 9:00-17:00)</Typography>
//                   </Paper>
//                 </Grid>
//               </Grid>
//             </Box>
//           </Card>

//           {/* שאלות נפוצות - מתחת לטופס */}
//           <Card
//             sx={{
//               p: 4,
//               position: 'relative',
//               '&::before': {
//                 content: '""',
//                 position: 'absolute',
//                 top: 0,
//                 left: 0,
//                 right: 0,
//                 height: '4px',
//                 background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
//                 borderRadius: '4px 4px 0 0'
//               }
//             }}
//           >
//             <Stack direction="row" alignItems="center" spacing={2} mb={4}>
//               <Typography variant="h4" fontWeight="bold">
//                 שאלות נפוצות
//               </Typography>
//             </Stack>

//             <Grid container spacing={2}>
//               {faqData.map((faq) => (
//                 <Grid item xs={12} md={6} key={faq.id}>
//                   <Accordion
//                     sx={{
//                       '&:before': { display: 'none' },
//                       boxShadow: 1,
//                       borderRadius: 2,
//                       '&.Mui-expanded': {
//                         boxShadow: 3
//                       }
//                     }}
//                   >
//                     <AccordionSummary
//                       expandIcon={<ExpandMoreIcon />}
//                       sx={{
//                         '&:hover': {
//                           bgcolor: 'grey.50'
//                         }
//                       }}
//                     >
//                       <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
//                         <Chip
//                           label={faq.category}
//                           color={faq.color}
//                           size="small"
//                           variant="outlined"
//                         />
//                         <Typography variant="subtitle1" fontWeight="600">
//                           {faq.question}
//                         </Typography>
//                       </Stack>
//                     </AccordionSummary>
//                     <AccordionDetails>
//                       <Typography color="text.secondary" lineHeight={1.7}>
//                         {faq.answer}
//                       </Typography>
//                     </AccordionDetails>
//                   </Accordion>
//                 </Grid>
//               ))}
//             </Grid>
//           </Card>

//           {/* פוטר */}
//           <Box textAlign="center" mt={8}>
//             <Paper
//               sx={{
//                 display: 'inline-block',
//                 px: 4,
//                 py: 2,
//                 borderRadius: 8,
//                 position: 'relative',
//                 '&::before': {
//                   content: '""',
//                   position: 'absolute',
//                   top: 0,
//                   left: 0,
//                   right: 0,
//                   height: '3px',
//                   background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
//                   borderRadius: '8px 8px 0 0'
//                 }
//               }}
//             >
//               <Typography variant="h6" fontWeight="500" sx={{ mt: 1 }}>
//                 🌟 זקוק לעזרה נוספת? אנחנו כאן בשבילך 24/7 🌟
//               </Typography>
//             </Paper>
//           </Box>
//         </Container>

//         {/* CSS for animations */}
//         <style>
//           {`
//             @keyframes bounce {
//               0%, 20%, 53%, 80%, 100% {
//                 transform: translate3d(0,0,0);
//               }
//               40%, 43% {
//                 transform: translate3d(0,-15px,0);
//               }
//               70% {
//                 transform: translate3d(0,-7px,0);
//               }
//               90% {
//                 transform: translate3d(0,-3px,0);
//               }
//             }
//           `}
//         </style>
//       </Box>
//     </ThemeProvider>
//   );
// };

// export default HelpSupportPage;