import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

interface DemoStepProps {
  number: string;
  title: string;
  description: string;
}

export const DemoStep: React.FC<DemoStepProps> = ({ number, title, description }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 3,
      direction: 'ltr',
    }}>
   <Avatar
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          ml: 2,
          width: 30,
          height: 30,
          fontSize: '0.9rem',
          fontWeight: 'bold'
        }}
      >
        {number}
      </Avatar>
      <Box sx={{ 
        flexGrow: 1,
        textAlign: 'left'
      }}>
        <Typography 
          variant="h4" 
          component="h4" 
          gutterBottom
          sx={{
            textAlign: 'left',
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.primary"
          sx={{
            textAlign: 'left',
          }}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export const DEMO_STEPS = [
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
] as const;