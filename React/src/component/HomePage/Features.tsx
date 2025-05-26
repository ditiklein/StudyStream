import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
} from '@mui/material';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import FolderSpecialOutlinedIcon from '@mui/icons-material/FolderSpecialOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';

interface Feature {
  icon: React.ReactElement;
  title: string;
  description: string;
  iconColor: string;
  iconBg: string;
}

interface FeaturesProps {
  features?: Feature[];
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const FEATURE_COLORS = {
  PRIMARY_PINK: '#f72585',
  PURPLE: '#7209b7',
  BLUE: '#4361ee',
  LIGHT_BLUE: '#4cc9f0',
  GREEN: '#06d6a0',
  YELLOW: '#ffd166',
} as const;

const DEFAULT_FEATURES: Feature[] = [
  {
    icon: <MicNoneOutlinedIcon fontSize="large" />,
    title: 'המרת שמע לטקסט',
    description: 'הפוך הקלטות של שיעורים לטקסט בלחיצת כפתור. חסוך זמן יקר וייצר חומרים נגישים לכל התלמידים שלך.',
    iconColor: FEATURE_COLORS.PRIMARY_PINK,
    iconBg: `rgba(247, 37, 133, 0.1)`
  },
  {
    icon: <LightbulbOutlinedIcon fontSize="large" />,
    title: 'זיהוי נקודות מפתח',
    description: 'המערכת מזהה אוטומטית את הנקודות החשובות ביותר בשיעור שלך ומרכזת אותן לסיכום מושלם.',
    iconColor: FEATURE_COLORS.PURPLE,
    iconBg: `rgba(114, 9, 183, 0.1)`
  },
  {
    icon: <FolderSpecialOutlinedIcon fontSize="large" />,
    title: 'ארגון חכם של קבצים',
    description: 'נהל את כל הקבצים שלך בתיקיות מותאמות אישית, עם תיוג, חיפוש מתקדם ומיון אוטומטי.',
    iconColor: FEATURE_COLORS.BLUE,
    iconBg: `rgba(67, 97, 238, 0.1)`
  },
  {
    icon: <ShareOutlinedIcon fontSize="large" />,
    title: 'שיתוף קל ומאובטח',
    description: 'שתף חומרים עם תלמידים או עמיתים בדיוק לפי הרשאות הגישה שתקבע, עם אבטחה מלאה.',
    iconColor: FEATURE_COLORS.LIGHT_BLUE,
    iconBg: `rgba(76, 201, 240, 0.1)`
  },
  {
    icon: <TrendingUpOutlinedIcon fontSize="large" />,
    title: 'מעקב אחר שימוש',
    description: 'קבל נתונים מפורטים על צפיות, הורדות ושימוש בחומרים שלך, כדי לשפר את ההוראה שלך.',
    iconColor: FEATURE_COLORS.GREEN,
    iconBg: `rgba(6, 214, 160, 0.1)`
  },
  {
    icon: <CloudOutlinedIcon fontSize="large" />,
    title: 'גיבוי אוטומטי',
    description: 'כל החומרים שלך מגובים אוטומטית בענן, כך שלעולם לא תאבד מידע חשוב.',
    iconColor: FEATURE_COLORS.YELLOW,
    iconBg: `rgba(255, 209, 102, 0.1)`
  }
];

// Styles
const getSectionStyles = () => ({
  py: 8,
  backgroundColor: 'background.paper',
  textAlign: 'center'
});

const getTitleStyles = () => ({
  position: 'relative',
  display: 'inline-block',
  mb: 6,
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '80px',
    height: '4px',
    backgroundColor: 'secondary.main',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: '2px'
  }
});

const getCardStyles = () => ({
  height: '100%',
  borderRadius: '15px',
  boxShadow: '0 6px 15px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.4s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)'
  },
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '5px',
    background: `linear-gradient(90deg, ${FEATURE_COLORS.PRIMARY_PINK}, ${FEATURE_COLORS.LIGHT_BLUE})`,
    zIndex: 1
  }
});

const getIconBoxStyles = (feature: Feature) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 80,
  height: 80,
  borderRadius: '20px',
  mb: 3,
  backgroundColor: feature.iconBg,
  color: feature.iconColor,
  boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)'
  }
});

const getTitleTextStyles = () => ({
  mb: 2,
  fontWeight: 700
});

const getDescriptionStyles = () => ({
  color: 'text.secondary',
  lineHeight: 1.7
});

const renderFeatureCard = (feature: Feature, index: number) => (
  <Grid item xs={12} sm={6} md={4} key={index}>
    <Card sx={getCardStyles()}>
      <CardContent sx={{ textAlign: 'center', p: 4 }}>
        <Box sx={getIconBoxStyles(feature)}>
          {feature.icon}
        </Box>
        
        <Typography 
          variant="h5" 
          component="h3" 
          sx={getTitleTextStyles()}
        >
          {index + 1}. {feature.title}
        </Typography>
        
        <Typography 
          variant="body1"
          sx={getDescriptionStyles()}
        >
          {feature.description}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

const Features: React.FC<FeaturesProps> = ({ 
  features = DEFAULT_FEATURES, 
  maxWidth = 'lg' 
}) => {
  return (
    <Box sx={getSectionStyles()}>
      <Container maxWidth={maxWidth}>
        <Typography 
          variant="h2" 
          component="h2" 
          sx={getTitleStyles()}
        >
          תכונות מרכזיות
        </Typography>
        
        <Grid container spacing={4}>
          {features.map(renderFeatureCard)}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features;