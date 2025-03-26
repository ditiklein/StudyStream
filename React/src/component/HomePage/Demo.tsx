import  { useState, DragEvent, ChangeEvent } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
  Avatar,
  Button
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface DemoStepProps {
  number: string;
  title: string;
  description: string;
}

const DemoStep: React.FC<DemoStepProps> = ({ number, title, description }) => {
  return (
    <Box sx={{ display: 'flex', mb: 3, alignItems: 'center' }}>
      <Avatar
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          mr: 2,
          width: 30,
          height: 30,
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}
      >
        {number}
      </Avatar>
      <Box>
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

const Demo: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');

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

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
    }
  };

  return (
    <Box sx={{ py: 8, bgcolor: 'background.paper', direction: 'rtl' }}>
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
                justifyContent: 'center',
                alignItems: 'center',
                border: dragActive ? '2px dashed #1976d2' : '2px dashed #ccc',
                bgcolor: dragActive ? 'rgba(25, 118, 210, 0.05)' : 'white',
                transition: 'all 0.3s ease'
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <CloudUploadIcon sx={{ fontSize: 70, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" textAlign="center" gutterBottom>
                {fileName ? `הקובץ "${fileName}" נבחר` : 'גרור ושחרר קובץ שמע'}
              </Typography>
              <Typography variant="body1" textAlign="center" color="text.secondary" sx={{ mb: 3 }}>
                או לחץ על הכפתור למטה כדי לבחור קובץ
              </Typography>
              <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} sx={{ mt: 2 }}>
                העלה קובץ שמע
                <input type="file" hidden accept="audio/*,video/*" onChange={handleFileChange} />
              </Button>
              {fileName && (
                <Typography variant="body2" sx={{ mt: 2, color: 'success.main' }}>
                  הקובץ מוכן להעלאה
                </Typography>
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
    </Box>
  );
};

export default Demo;
