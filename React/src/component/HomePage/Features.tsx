import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent,
  // useTheme
} from '@mui/material';
import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import FolderSpecialOutlinedIcon from '@mui/icons-material/FolderSpecialOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import CloudOutlinedIcon from '@mui/icons-material/CloudOutlined';

function Features() {
  // const theme = useTheme();
  
  const features = [
    {
      icon: <MicNoneOutlinedIcon fontSize="large" />,
      title: 'המרת שמע לטקסט',
      description: 'הפוך הקלטות של שיעורים לטקסט בלחיצת כפתור. חסוך זמן יקר וייצר חומרים נגישים לכל התלמידים שלך.',
      iconColor: '#f72585',
      iconBg: 'rgba(247, 37, 133, 0.1)'
    },
    {
      icon: <LightbulbOutlinedIcon fontSize="large" />,
      title: 'זיהוי נקודות מפתח',
      description: 'המערכת מזהה אוטומטית את הנקודות החשובות ביותר בשיעור שלך ומרכזת אותן לסיכום מושלם.',
      iconColor: '#7209b7',
      iconBg: 'rgba(114, 9, 183, 0.1)'
    },
    {
      icon: <FolderSpecialOutlinedIcon fontSize="large" />,
      title: 'ארגון חכם של קבצים',
      description: 'נהל את כל הקבצים שלך בתיקיות מותאמות אישית, עם תיוג, חיפוש מתקדם ומיון אוטומטי.',
      iconColor: '#4361ee',
      iconBg: 'rgba(67, 97, 238, 0.1)'
    },
    {
      icon: <ShareOutlinedIcon fontSize="large" />,
      title: 'שיתוף קל ומאובטח',
      description: 'שתף חומרים עם תלמידים או עמיתים בדיוק לפי הרשאות הגישה שתקבע, עם אבטחה מלאה.',
      iconColor: '#4cc9f0',
      iconBg: 'rgba(76, 201, 240, 0.1)'
    },
    {
      icon: <TrendingUpOutlinedIcon fontSize="large" />,
      title: 'מעקב אחר שימוש',
      description: 'קבל נתונים מפורטים על צפיות, הורדות ושימוש בחומרים שלך, כדי לשפר את ההוראה שלך.',
      iconColor: '#06d6a0',
      iconBg: 'rgba(6, 214, 160, 0.1)'
    },
    {
      icon: <CloudOutlinedIcon fontSize="large" />,
      title: 'גיבוי אוטומטי',
      description: 'כל החומרים שלך מגובים אוטומטית בענן, כך שלעולם לא תאבד מידע חשוב.',
      iconColor: '#ffd166',
      iconBg: 'rgba(255, 209, 102, 0.1)'
    }
  ];

  return (
    <Box 
      sx={{ 
        py: 8, 
        backgroundColor: 'background.paper',
        textAlign: 'center'
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          component="h2" 
          sx={{ 
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
          }}
        >
          תכונות מרכזיות
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
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
                    background: 'linear-gradient(90deg, #f72585, #4cc9f0)',
                    zIndex: 1
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box 
                    sx={{ 
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
                    }}
                  >
                    {feature.icon}
                  </Box>
                  
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    sx={{ 
                      mb: 2,
                      fontWeight: 700
                    }}
                  >
                    {index + 1}. {feature.title}
                  </Typography>
                  
                  <Typography 
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Features;
