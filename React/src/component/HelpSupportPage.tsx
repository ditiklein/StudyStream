import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './FileAndFolderStore/FileStore';
import {
  Box,
  Container,
  Typography,
  Card,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  MenuItem,
  Grid,
  Chip,
  Paper,
  Divider,
  Stack,
  Avatar,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Phone as PhoneIcon,
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Security as SecurityIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { addMessage, selectMessages } from './FileAndFolderStore/MessageSlice';
export interface MessageDTO {
  id: number;
  content: string;
  subject?: string | null;
  userId?: number | null;
  guestName?: string | null;
  guestEmail?: string | null;
  ticketNumber?: string | null;
  createdAt: string;
  isRead: boolean;
  isDeleted: boolean;
}

export interface MessagePostModel {
  content: string;
  subject?: string | null;
  userId?: number | null;
  guestName?: string | null;
  guestEmail?: string | null;
  ticketNumber?: string | null;
}


// תמת צבעים מותאמת לאפליקציה
const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#8b5cf6',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
  },
  direction: 'rtl',
  typography: {
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
  },
});

interface ContactForm {
  content: string;
  subject: string;
  guestName: string;
  guestEmail: string;
}

const HelpSupportPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector(selectMessages);
  
  // קבלת פרטי המשתמש מ-sessionStorage
  const storedUser = sessionStorage.getItem("User");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAuthenticated = !!user;

  const [contactForm, setContactForm] = useState<ContactForm>({
    content: '',
    subject: '',
    guestName: '',
    guestEmail: ''
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState<boolean>(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [ticketNumber, setTicketNumber] = useState<string>(''); // הוספת state למספר הפנייה

  // מילוי אוטומטי של פרטי המשתמש המחובר
  useEffect(() => {
    if (isAuthenticated && user) {
      setContactForm(prev => ({
        ...prev,
        guestName: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || '',
        guestEmail: user.email || ''
      }));
    }
  }, [isAuthenticated, user]);

  const faqData = [
    {
      id: 1,
      question: "איך אני יוצר חשבון חדש?",
      answer: "ליצירת חשבון חדש, לחץ על כפתור 'הרשמה' בראש העמוד, מלא את הפרטים הנדרשים כמו שם וסיסמה, ואשר את החשבון שלך.",
      category: "חשבון",
      color: "primary" as const
    },
    {
      id: 2,
      question: "איך אני משנה את הסיסמה שלי?",
      answer: "כדי לשנות סיסמה, היכנס לחשבון שלך, לך להגדרות חשבון, בחר 'שינוי סיסמה', הזן את הסיסמה הנוכחית ואת הסיסמה החדשה פעמיים.",
      category: "אבטחה",
      color: "success" as const
    },
    {
      id: 3,
      question: "איך אני יכול לעדכן את הפרטים האישיים שלי?",
      answer: "ניתן לעדכן פרטים אישיים דרך דף הפרופיל שלך. היכנס לחשבון, לחץ על 'הפרופיל שלי', ערוך את הפרטים הרצויים ושמור את השינויים.",
      category: "פרופיל",
      color: "secondary" as const
    },
    {
      id: 4,
      question: "מה עליי לעשות אם שכחתי את הסיסמה?",
      answer: "אם שכחת את הסיסמה, לחץ על 'שכחתי סיסמה' בדף ההתחברות, והמערכת תעזור לך לאפס אותה.",
      category: "אבטחה",
      color: "success" as const
    },
    {
      id: 5,
      question: "איך אני מוחק את החשבון שלי?",
      answer: "למחיקת חשבון, פנה אלינו דרך טופס יצירת הקשר למטה. שים לב שמחיקת החשבון היא בלתי הפיכה ונמחק את כל הנתונים שלך.",
      category: "חשבון",
      color: "primary" as const
    },
    {
      id: 6,
      question: "האם המידע שלי מאובטח?",
      answer: "כן! אנו משתמשים בהצפנת SSL 256-bit וציות מלא ל-GDPR. כל הנתונים מאוחסנים בשרתים מוגנים עם גיבויים יומיים ובדיקות אבטחה קבועות.",
      category: "אבטחה",
      color: "success" as const
    },
    {
      id: 7,
      question: "מהו זמן המענה של התמיכה?",
      answer: "אנו מתחייבים למענה תוך 2 שעות בממוצע בימי חול. בסופי שבוע הזמן עלול להיות עד 24 שעות. לבעיות דחופות יש לנו מענה מיידי בטלפון.",
      category: "תמיכה",
      color: "warning" as const
    },
    {
      id: 8,
      question: "איך אני יכול לייצא את הנתונים שלי?",
      answer: "ניתן לייצא את כל הנתונים שלך בפורמט JSON או CSV דרך הגדרות החשבון. העיבוד לוקח עד 24 שעות ותקבל הודעה במערכת.",
      category: "נתונים",
      color: "info" as const
    }
  ];

  const stats = [
    { icon: PeopleIcon, number: "10,000+", label: "משתמשים מרוצים", color: "#3b82f6" },
    { icon: ScheduleIcon, number: "< 2 שעות", label: "זמן מענה ממוצע", color: "#8b5cf6" },
    { icon: StarIcon, number: "4.9/5", label: "דירוג שביעות רצון", color: "#ec4899" },
    { icon: SecurityIcon, number: "99.9%", label: "זמינות מערכת", color: "#10b981" }
  ];

  const subjectOptions = [
    { value: 'בעיה טכנית', label: 'בעיה טכנית' },
    { value: 'בעיות חשבון', label: 'בעיות חשבון' },
    { value: 'חיובים ותשלומים', label: 'חיובים ותשלומים' },
    { value: 'בקשת תכונה חדשה', label: 'בקשת תכונה חדשה' },
    { value: 'שאלה כללית', label: 'שאלה כללית' },
    { value: 'אחר', label: 'אחר' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    // בדיקת ולידציה
    if (!contactForm.content.trim()) {
      setShowErrorSnackbar(true);
      return;
    }

    // בדיקת ולידציה עבור אורחים
    if (!isAuthenticated) {
      if (!contactForm.guestName.trim() || !contactForm.guestEmail.trim()) {
        setShowErrorSnackbar(true);
        return;
      }
      
      // בדיקת פורמט אימייל פשוטה
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactForm.guestEmail)) {
        setShowErrorSnackbar(true);
        return;
      }
    }

    setSubmitLoading(true);

    try {
      // יצירת אובייקט ההודעה
      const messageData: MessagePostModel = {
        content: contactForm.content.trim(),
        subject: contactForm.subject || undefined,
        userId: isAuthenticated ? user.id : null, // שנה מ-undefined ל-null
        guestName: !isAuthenticated ? contactForm.guestName.trim() : null, // שנה מ-undefined ל-null
        guestEmail: !isAuthenticated ? contactForm.guestEmail.trim() : null // שנה מ-undefined ל-null
      };

      console.log('Sending message data:', messageData); // להדפסה ודיבוג

      // שליחת ההודעה דרך Redux
      const resultAction = await dispatch(addMessage(messageData));
      
      // בדיקה אם השליחה הצליחה
      if (addMessage.fulfilled.match(resultAction)) {
        // הצלחה - יצירת מספר פנייה יחודי
        const newTicketNumber = `MSG-${Date.now().toString().slice(-6)}`;
        setTicketNumber(newTicketNumber);
        setIsSubmitted(true);
        setShowSuccessSnackbar(true);
        setContactForm({
          content: '',
          subject: '',
          guestName: isAuthenticated ? contactForm.guestName : '',
          guestEmail: isAuthenticated ? contactForm.guestEmail : ''
        });
        
        // איפוס הטופס אחרי 5 שניות
        setTimeout(() => {
          setIsSubmitted(false);
          setTicketNumber('');
        }, 5000);
      } else {
        // שגיאה
        console.error('Message sending failed:', resultAction);
        setShowErrorSnackbar(true);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setShowErrorSnackbar(true);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string): void => {
    if (reason === 'clickaway') {
      return;
    }
    setShowSuccessSnackbar(false);
    setShowErrorSnackbar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)',
            zIndex: 1
          }
        }}
        dir="rtl"
      >
        <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 2 }}>
          {/* כותרת ראשית */}
          <Box textAlign="center" mb={8}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 900,
                background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 50%, #ec4899 70%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              מרכז עזרה ותמיכה
            </Typography>
            
            <Box
              sx={{
                width: 120,
                height: 4,
                background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
                borderRadius: 2,
                mx: 'auto',
                mb: 3
              }}
            />
            
            <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
              כאן תמצא תשובות מהירות לכל השאלות שלך וצוות מקצועי שמחכה לעזור לך 24/7
            </Typography>

            {/* סטטיסטיקות */}
            <Grid container spacing={3} sx={{ mt: 6, maxWidth: 800, mx: 'auto' }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Card
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      position: 'relative',
                      overflow: 'visible',
                      height: 180,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
                        borderRadius: '4px 4px 0 0'
                      },
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        transition: 'transform 0.3s ease'
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: stat.color,
                        mx: 'auto',
                        mb: 2,
                        width: 48,
                        height: 48
                      }}
                    >
                      <stat.icon />
                    </Avatar>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {stat.number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* טופס יצירת קשר */}
          <Card
            sx={{
              p: 4,
              mb: 4,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
                borderRadius: '4px 4px 0 0'
              }
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <SendIcon sx={{ color: 'secondary.main', fontSize: 36 }} />
              <Typography variant="h4" fontWeight="bold">
                שלח הודעה למנהל
              </Typography>
            </Stack>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontStyle: 'italic' }}>
              שלח הודעה רק אם אין מענה בשאלות למטה
            </Typography>

            {!isSubmitted ? (
              <Grid container spacing={3}>
                {/* נושא הפנייה */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="נושא הפנייה (אופציונלי)"
                    name="subject"
                    value={contactForm.subject}
                    onChange={handleInputChange}
                    variant="outlined"
                    size="medium"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  >
                    <MenuItem value="">ללא נושא</MenuItem>
                    {subjectOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* פרטי קשר */}
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={isAuthenticated ? "שם מלא" : "שם מלא *"}
                    name="guestName"
                    value={contactForm.guestName}
                    onChange={handleInputChange}
                    variant="outlined"
                    disabled={isAuthenticated}
                    required={!isAuthenticated}
                    error={!isAuthenticated && !contactForm.guestName.trim() && contactForm.guestName !== ''}
                    helperText={
                      !isAuthenticated && !contactForm.guestName.trim() && contactForm.guestName !== '' 
                        ? 'שם מלא הוא שדה חובה' 
                        : isAuthenticated ? 'שם נטען מהפרופיל שלך' : ''
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: isAuthenticated ? 'grey.50' : 'transparent'
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={isAuthenticated ? "כתובת אימייל" : "כתובת אימייל *"}
                    name="guestEmail"
                    type="email"
                    value={contactForm.guestEmail}
                    onChange={handleInputChange}
                    variant="outlined"
                    disabled={isAuthenticated}
                    required={!isAuthenticated}
                    // error={
                    //   !isAuthenticated && 
                    //   (!contactForm.guestEmail.trim() || 
                    //    (contactForm.guestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.guestEmail))) &&
                    //   contactForm.guestEmail !== ''
                    // }
                    // helperText={
                    //   !isAuthenticated && !contactForm.guestEmail.trim() && contactForm.guestEmail !== ''
                    //     ? 'כתובת אימייל היא שדה חובה'
                    //     : !isAuthenticated && contactForm.guestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.guestEmail)
                    //     ? 'כתובת אימייל לא תקינה'
                    //     : isAuthenticated ? 'אימייל נטען מהפרופיל שלך' : undefined
                    // }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: isAuthenticated ? 'grey.50' : 'transparent'
                      }
                    }}
                  />
                </Grid>

                {/* תוכן ההודעה */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="תוכן ההודעה *"
                    name="content"
                    multiline
                    rows={6}
                    value={contactForm.content}
                    onChange={handleInputChange}
                    variant="outlined"
                    placeholder="כתב כאן את הודעתך בפירוט..."
                    required
                    error={!contactForm.content.trim() && contactForm.content !== ''}
                    helperText={!contactForm.content.trim() && contactForm.content !== '' ? 'תוכן ההודעה הוא שדה חובה' : ''}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Grid>

                {/* כפתור שליחה */}
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={submitLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                    onClick={handleSubmit}
                    disabled={
                      submitLoading || 
                      !contactForm.content.trim() ||
                      (!isAuthenticated && (!contactForm.guestName.trim() || !contactForm.guestEmail.trim()))
                    }
                    sx={{
                      py: 2,
                      fontSize: 16,
                      fontWeight: 'bold',
                      borderRadius: 2,
                      background: submitLoading ? 'grey.400' : 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 50%, #ec4899 70%)',
                      '&:hover': {
                        background: submitLoading ? 'grey.400' : 'linear-gradient(45deg, #2563eb 30%, #7c3aed 50%, #db2777 70%)',
                        transform: submitLoading ? 'none' : 'translateY(-2px)',
                        boxShadow: submitLoading ? 'none' : 6
                      },
                      '&:disabled': {
                        background: 'grey.300',
                        color: 'grey.600'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {submitLoading ? 'שולח הודעה...' : 'שלח הודעה'}
                  </Button>
                </Grid>

                {error && (
                  <Grid item xs={12}>
                    <Alert severity="error" sx={{ textAlign: 'right' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <ErrorIcon />
                        <Typography>שגיאה בשליחת ההודעה: {error}</Typography>
                      </Stack>
                    </Alert>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Box textAlign="center" py={6}>
                <CheckCircleIcon
                  sx={{
                    fontSize: 80,
                    color: 'success.main',
                    mb: 3,
                    animation: 'bounce 1s ease infinite'
                  }}
                />
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  ההודעה נשלחה בהצלחה! 🎉
                </Typography>
                <Typography variant="h6" color="text.secondary" mb={3}>
                  תודה על פנייתך. המנהל קיבל את ההודעה ויחזור אליך תוך מקסימום 2 שעות.
                </Typography>
                <Alert severity="success" sx={{ textAlign: 'right' }}>
                  📧 מספר הפנייה: #{ticketNumber}
                </Alert>
              </Box>
            )}

            {/* מידע ליצירת קשר נוסף */}
            <Box mt={4}>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="h6" fontWeight="bold" mb={3}>
                דרכים נוספות ליצירת קשר:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      '&:hover': {
                        bgcolor: 'grey.50'
                      }
                    }}
                  >
                    <PhoneIcon sx={{ color: 'secondary.main', mr: 2 }} />
                    <Typography>03-1234567 (א'-ה' 9:00-17:00)</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Card>

          {/* שאלות נפוצות */}
          <Card
            sx={{
              p: 4,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
                borderRadius: '4px 4px 0 0'
              }
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2} mb={4}>
              <Typography variant="h4" fontWeight="bold">
                שאלות נפוצות
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              {faqData.map((faq) => (
                <Grid item xs={12} md={6} key={faq.id}>
                  <Accordion
                    sx={{
                      '&:before': { display: 'none' },
                      boxShadow: 1,
                      borderRadius: 2,
                      '&.Mui-expanded': {
                        boxShadow: 3
                      }
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        '&:hover': {
                          bgcolor: 'grey.50'
                        }
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
                        <Chip
                          label={faq.category}
                          color={faq.color}
                          size="small"
                          variant="outlined"
                        />
                        <Typography variant="subtitle1" fontWeight="600">
                          {faq.question}
                        </Typography>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography color="text.secondary" lineHeight={1.7}>
                        {faq.answer}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            </Grid>
          </Card>

          {/* פוטר */}
          <Box textAlign="center" mt={8}>
            <Paper
              sx={{
                display: 'inline-block',
                px: 4,
                py: 2,
                borderRadius: 8,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #ec4899, #8b5cf6, #3b82f6)',
                  borderRadius: '8px 8px 0 0'
                }
              }}
            >
              <Typography variant="h6" fontWeight="500" sx={{ mt: 1 }}>
                🌟 זקוק לעזרה נוספת? אנחנו כאן בשבילך 24/7 🌟
              </Typography>
            </Paper>
          </Box>
        </Container>

        {/* Snackbar להודעות הצלחה ושגיאה */}
        <Snackbar
          open={showSuccessSnackbar}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
            ההודעה נשלחה בהצלחה! 🎉
          </Alert>
        </Snackbar>

        <Snackbar
          open={showErrorSnackbar}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
            {!isAuthenticated && (!contactForm.guestName.trim() || !contactForm.guestEmail.trim())
              ? 'אנא מלא את כל השדות הנדרשים (שם, אימייל, תוכן הודעה)'
              : !isAuthenticated && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactForm.guestEmail)
              ? 'אנא הזן כתובת אימייל תקינה'
              : !contactForm.content.trim()
              ? 'אנא כתב תוכן הודעה'
              : 'שגיאה בשליחת ההודעה! נסה שוב מאוחר יותר.'
            }
          </Alert>
        </Snackbar>

        {/* CSS for animations */}
        <style>
          {`
            @keyframes bounce {
              0%, 20%, 53%, 80%, 100% {
                transform: translate3d(0,0,0);
              }
              40%, 43% {
                transform: translate3d(0,-15px,0);
              }
              70% {
                transform: translate3d(0,-7px,0);
              }
              90% {
                transform: translate3d(0,-3px,0);
              }
            }
          `}
        </style>
      </Box>
    </ThemeProvider>
  );
};

export default HelpSupportPage;
