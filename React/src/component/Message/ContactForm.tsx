import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  TextField,
  Button,
  MenuItem,
  Grid,
  Stack,
  Alert,
  CircularProgress,
  Box,
  Divider,
  Paper
} from '@mui/material';
import {
  Send as SendIcon,
  CheckCircle as CheckCircleIcon,
  Phone as PhoneIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { addMessage } from '../FileAndFolderStore/MessageSlice';
import { MessagePostModel } from '../../Modles/Message';
import { AppDispatch } from '../FileAndFolderStore/FileStore';

interface ContactFormProps {
  user: any;
  isAuthenticated: boolean;
  dispatch: AppDispatch;
  error: string | null;
  onSuccess: () => void;
  onError: () => void;
}

interface ContactFormData {
  content: string;
  subject: string;
  guestName: string;
  guestEmail: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  user,
  isAuthenticated,
  dispatch,
  error,
  onSuccess,
  onError
}) => {
  const [contactForm, setContactForm] = useState<ContactFormData>({
    content: '',
    subject: '',
    guestName: '',
    guestEmail: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [ticketNumber, setTicketNumber] = useState<string>('');

  const subjectOptions = [
    { value: 'בעיה טכנית', label: 'בעיה טכנית' },
    { value: 'בעיות חשבון', label: 'בעיות חשבון' },
    { value: 'חיובים ותשלומים', label: 'חיובים ותשלומים' },
    { value: 'בקשת תכונה חדשה', label: 'בקשת תכונה חדשה' },
    { value: 'שאלה כללית', label: 'שאלה כללית' },
    { value: 'אחר', label: 'אחר' }
  ];

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!contactForm.content.trim()) {
      return false;
    }
    
    if (!isAuthenticated) {
      if (!contactForm.guestName.trim() || !contactForm.guestEmail.trim()) {
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactForm.guestEmail)) {
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (): Promise<void> => {
    if (!validateForm()) {
      onError();
      return;
    }

    setSubmitLoading(true);

    try {
      const messageData: MessagePostModel = {
        content: contactForm.content.trim(),
        subject: contactForm.subject || undefined,
        userId: isAuthenticated ? user.id : 1,
        guestName: !isAuthenticated ? contactForm.guestName.trim() : null,
        guestEmail: !isAuthenticated ? contactForm.guestEmail.trim() : null
      };

      console.log('Sending message data:', messageData);

      const resultAction = await dispatch(addMessage(messageData));
      
      if (addMessage.fulfilled.match(resultAction)) {
        const newTicketNumber = `MSG-${Date.now().toString().slice(-6)}`;
        setTicketNumber(newTicketNumber);
        setIsSubmitted(true);
        onSuccess();
        
        // איפוס הטופס
        setContactForm({
          content: '',
          subject: '',
          guestName: isAuthenticated ? contactForm.guestName : '',
          guestEmail: isAuthenticated ? contactForm.guestEmail : ''
        });
        
        // איפוס מצב השליחה אחרי 5 שניות
        setTimeout(() => {
          setIsSubmitted(false);
          setTicketNumber('');
        }, 5000);
      } else {
        console.error('Message sending failed:', resultAction);
        onError();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      onError();
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
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
        <SendIcon sx={{ color: '#3b82f6', fontSize: 36 }} />
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
                backgroundColor: '#3b82f6',
                '&:hover': {
                  backgroundColor: '#2563eb',
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
              color: '#3b82f6',
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
              <PhoneIcon sx={{ color: '#3b82f6', mr: 2 }} />
              <Typography>03-1234567 (א'-ה' 9:00-17:00)</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default ContactForm;