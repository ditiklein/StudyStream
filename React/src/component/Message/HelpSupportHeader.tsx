import React from 'react';
import { Box, Typography, Grid, Card, Avatar } from '@mui/material';
import {
  People as PeopleIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

interface StatItem {
  icon: string;
  number: string;
  label: string;
  color: string;
}

const HelpSupportHeader: React.FC = () => {
  const stats: StatItem[] = [
    { icon: 'PeopleIcon', number: "10,000+", label: "משתמשים מרוצים", color: "#ec4899" },
    { icon: 'ScheduleIcon', number: "2 שעות", label: "זמן מענה ממוצע", color: "#ec4899" },
    { icon: 'StarIcon', number: "4.9/5", label: "דירוג שביעות רצון", color: "#ec4899" },
    { icon: 'SecurityIcon', number: "99.9%", label: "זמינות מערכת", color: "#ec4899" }
  ];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'PeopleIcon':
        return PeopleIcon;
      case 'ScheduleIcon':
        return ScheduleIcon;
      case 'StarIcon':
        return StarIcon;
      case 'SecurityIcon':
        return SecurityIcon;
      default:
        return PeopleIcon;
    }
  };

  return (
    <Box textAlign="center" mb={8}>
      {/* כותרת ראשית */}
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
      
      <Typography 
        variant="h5" 
        color="text.secondary" 
        sx={{ 
          maxWidth: 600, 
          mx: 'auto', 
          lineHeight: 1.6, 
          mt: 3 
        }}
      >
        כאן תמצא תשובות מהירות לכל השאלות שלך וצוות מקצועי שמחכה לעזור לך 24/7
      </Typography>

      {/* סטטיסטיקות */}
      <Grid container spacing={3} sx={{ mt: 6, maxWidth: 800, mx: 'auto' }}>
        {stats.map((stat, index) => {
          const IconComponent = getIconComponent(stat.icon);
          
          return (
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
                  <IconComponent />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  {stat.number}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default HelpSupportHeader;