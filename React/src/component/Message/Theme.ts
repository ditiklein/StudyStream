import { createTheme } from '@mui/material/styles';

// תמת צבעים מותאמת לאפליקציה
export const theme = createTheme({
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
  components: {
    // הסרת צבע כחול מהשדות כשנבחרים
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d1d5db', // צבע אפור במקום כחול
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#6b7280', // צבע אפור במקום כחול
          },
        },
      },
    },
  },
});

// סטטיסטיקות למרכז העזרה
export const helpStats = [
  { 
    icon: 'PeopleIcon', 
    number: "10,000+", 
    label: "משתמשים מרוצים", 
    color: "#ec4899" 
  },
  { 
    icon: 'ScheduleIcon', 
    number: "2 שעות", 
    label: "זמן מענה ממוצע", 
    color: "#ec4899" 
  },
  { 
    icon: 'StarIcon', 
    number: "4.9/5", 
    label: "דירוג שביעות רצון", 
    color: "#ec4899" 
  },
  { 
    icon: 'SecurityIcon', 
    number: "99.9%", 
    label: "זמינות מערכת", 
    color: "#ec4899" 
  }
];

// אפשרויות נושא הפנייה
export const subjectOptions = [
  { value: 'בעיה טכנית', label: 'בעיה טכנית' },
  { value: 'בעיות חשבון', label: 'בעיות חשבון' },
  { value: 'חיובים ותשלומים', label: 'חיובים ותשלומים' },
  { value: 'בקשת תכונה חדשה', label: 'בקשת תכונה חדשה' },
  { value: 'שאלה כללית', label: 'שאלה כללית' },
  { value: 'אחר', label: 'אחר' }
];