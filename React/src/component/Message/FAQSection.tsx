import React from 'react';
import {
  Card,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Chip,
  Stack
} from '@mui/material';
import { 
  ExpandMore as ExpandMoreIcon 
} from '@mui/icons-material';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  color: "primary" | "secondary" | "success" | "warning" | "info";
}

const FAQSection: React.FC = () => {
  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "איך אני יוצר חשבון חדש?",
      answer: "ליצירת חשבון חדש, לחץ על כפתור 'הרשמה' בראש העמוד, מלא את הפרטים הנדרשים כמו שם וסיסמה, ואשר את החשבון שלך.",
      category: "חשבון",
      color: "primary"
    },
    {
      id: 2,
      question: "איך אני משנה את הסיסמה שלי?",
      answer: "כדי לשנות סיסמה, היכנס לחשבון שלך, לך להגדרות חשבון, בחר 'שינוי סיסמה', הזן את הסיסמה הנוכחית ואת הסיסמה החדשה פעמיים.",
      category: "אבטחה",
      color: "success"
    },
    {
      id: 3,
      question: "איך אני יכול לעדכן את הפרטים האישיים שלי?",
      answer: "ניתן לעדכן פרטים אישיים דרך דף הפרופיל שלך. היכנס לחשבון, לחץ על 'הפרופיל שלי', ערוך את הפרטים הרצויים ושמור את השינויים.",
      category: "פרופיל",
      color: "secondary"
    },
    {
      id: 4,
      question: "מה עליי לעשות אם שכחתי את הסיסמה?",
      answer: "אם שכחת את הסיסמה, לחץ על 'שכחתי סיסמה' בדף ההתחברות, והמערכת תעזור לך לאפס אותה.",
      category: "אבטחה",
      color: "success"
    },
    {
      id: 5,
      question: "איך אני מוחק את החשבון שלי?",
      answer: "למחיקת חשבון, פנה אלינו דרך טופס יצירת הקשר למטה. שים לב שמחיקת החשבון היא בלתי הפיכה ונמחק את כל הנתונים שלך.",
      category: "חשבון",
      color: "primary"
    },
    {
      id: 6,
      question: "האם המידע שלי מאובטח?",
      answer: "כן! אנו משתמשים בהצפנת SSL 256-bit וציות מלא ל-GDPR. כל הנתונים מאוחסנים בשרתים מוגנים עם גיבויים יומיים ובדיקות אבטחה קבועות.",
      category: "אבטחה",
      color: "success"
    },
    {
      id: 7,
      question: "מהו זמן המענה של התמיכה?",
      answer: "אנו מתחייבים למענה תוך 2 שעות בממוצע בימי חול. בסופי שבוע הזמן עלול להיות עד 24 שעות. לבעיות דחופות יש לנו מענה מיידי בטלפון.",
      category: "תמיכה",
      color: "warning"
    },
    {
      id: 8,
      question: "איך אני יכול לייצא את הנתונים שלי?",
      answer: "ניתן לייצא את כל הנתונים שלך בפורמט JSON או CSV דרך הגדרות החשבון. העיבוד לוקח עד 24 שעות ותקבל הודעה במערכת.",
      category: "נתונים",
      color: "info"
    }
  ];

  return (
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
  );
};

export default FAQSection;