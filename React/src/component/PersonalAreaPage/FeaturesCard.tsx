import React from 'react';
import { Grid, Paper, Box, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MicIcon from '@mui/icons-material/Mic';
import NotesIcon from '@mui/icons-material/Notes';
import ShareIcon from '@mui/icons-material/Share';

const FeatureCard = styled(Paper)(({ theme, color }) => ({
  padding: theme.spacing(3),
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: color,
  },
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4],
  },
}));

const IconContainer = styled(Box)(({ theme, color }) => ({
  width: 60,
  height: 60,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  marginBottom: theme.spacing(2),
  backgroundColor: `${color}10`,
}));

const FeatureCards = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <MicIcon fontSize="large" />,
      title: 'תמלול שיעורים',
      description: 'העלה הקלטת שיעור ותקבל תמלול מלא בזמן קצר. התמלול ישמר ישירות באזור האישי שלך.',
      color: '#ed4b9e',
      onClick: () => {
        navigate('/transcription');
      }
    },
    {
      icon: <NotesIcon fontSize="large" />,
      title: 'סיכום תוכן',
      description: 'קבל סיכום ממוקד של חומר לימוד, מאמרים או הקלטות. חסוך זמן ולמד ביעילות.',
      color: '#4e7df9',
      onClick: () => {
        console.log('Content summary feature clicked');
        navigate('/point');
      }
    },
    {
      icon: <ShareIcon fontSize="large" />,
      title: 'שיתוף קבצים',
      description: 'שתף קבצים ותיקיות עם אחרים בקלות. הגדר הרשאות גישה וצור קישורים לשיתוף פשוט.',
      color: '#52c41a',
      onClick: () => {
        console.log('File sharing feature clicked');
         navigate('/share');
      }
    }
  ];

  return (
    <Grid container spacing={3}>
      {features.map((feature, index) => (
        <Grid item xs={12} md={4} key={index}>
          <FeatureCard 
            elevation={2} 
            color={feature.color} 
            onClick={feature.onClick}
          >
            <IconContainer color={feature.color}>
              {React.cloneElement(feature.icon, { sx: { color: feature.color } })}
            </IconContainer>
            <Typography 
              variant="h6" 
              align="center" 
              gutterBottom 
              sx={{ color: 'black', fontWeight: 'bold' }}
            >
              {feature.title}
            </Typography>
            <Typography variant="body2" align="center" color="text.secondary">
              {feature.description}
            </Typography>
          </FeatureCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default FeatureCards;
