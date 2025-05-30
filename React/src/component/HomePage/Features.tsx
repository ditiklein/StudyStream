import type React from "react"
import { Box, Container, Typography, Grid, Card, CardContent } from "@mui/material"
import { motion } from "framer-motion"
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined"
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined"
import FolderSpecialOutlinedIcon from "@mui/icons-material/FolderSpecialOutlined"
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined"
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined"
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined"

interface Feature {
  icon: React.ReactElement
  title: string
  description: string
  iconColor: string
  iconBg: string
}

interface FeaturesProps {
  features?: Feature[]
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
}

const FEATURE_COLORS = {
  PRIMARY_PINK: "#f72585",
  PURPLE: "#7209b7",
  BLUE: "#4361ee",
  LIGHT_BLUE: "#4cc9f0",
  GREEN: "#06d6a0",
  YELLOW: "#ffd166",
} as const

const DEFAULT_FEATURES: Feature[] = [
  {
    icon: <MicNoneOutlinedIcon fontSize="large" />,
    title: "המרת שמע לטקסט",
    description: "הפוך הקלטות של שיעורים לטקסט בלחיצת כפתור. חסוך זמן יקר וייצר חומרים נגישים לכל התלמידים שלך.",
    iconColor: FEATURE_COLORS.PRIMARY_PINK,
    iconBg: `rgba(247, 37, 133, 0.1)`,
  },
  {
    icon: <LightbulbOutlinedIcon fontSize="large" />,
    title: "זיהוי נקודות מפתח",
    description: "המערכת מזהה אוטומטית את הנקודות החשובות ביותר בשיעור שלך ומרכזת אותן לסיכום מושלם.",
    iconColor: FEATURE_COLORS.PURPLE,
    iconBg: `rgba(114, 9, 183, 0.1)`,
  },
  {
    icon: <FolderSpecialOutlinedIcon fontSize="large" />,
    title: "ארגון חכם של קבצים",
    description: "נהל את כל הקבצים שלך בתיקיות מותאמות אישית, עם תיוג, חיפוש מתקדם ומיון אוטומטי.",
    iconColor: FEATURE_COLORS.BLUE,
    iconBg: `rgba(67, 97, 238, 0.1)`,
  },
  {
    icon: <ShareOutlinedIcon fontSize="large" />,
    title: "שיתוף קל ומאובטח",
    description: "שתף חומרים עם תלמידים או עמיתים בדיוק לפי הרשאות הגישה שתקבע, עם אבטחה מלאה.",
    iconColor: FEATURE_COLORS.LIGHT_BLUE,
    iconBg: `rgba(76, 201, 240, 0.1)`,
  },
  {
    icon: <TrendingUpOutlinedIcon fontSize="large" />,
    title: "מעקב אחר שימוש",
    description: "קבל נתונים מפורטים על צפיות, הורדות ושימוש בחומרים שלך, כדי לשפר את ההוראה שלך.",
    iconColor: FEATURE_COLORS.GREEN,
    iconBg: `rgba(6, 214, 160, 0.1)`,
  },
  {
    icon: <CloudOutlinedIcon fontSize="large" />,
    title: "גיבוי אוטומטי",
    description: "כל החומרים שלך מגובים אוטומטית בענן, כך שלעולם לא תאבד מידע חשוב.",
    iconColor: FEATURE_COLORS.YELLOW,
    iconBg: `rgba(255, 209, 102, 0.1)`,
  },
]

const getSectionStyles = () => ({
  py: 8,
  backgroundColor: "background.paper",
  textAlign: "center",
})

const getTitleStyles = () => ({
  position: "relative",
  display: "inline-block",
  mb: 6,
  "&::after": {
    content: '""',
    position: "absolute",
    width: "80px",
    height: "4px",
    backgroundColor: "secondary.main",
    bottom: "-10px",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "2px",
  },
})

const getCardStyles = () => ({
  height: "100%",
  minHeight: "320px",
  borderRadius: "15px",
  boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
  transition: "all 0.4s ease",
  "&:hover": {
    transform: "translateY(-10px)",
    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.1)",
  },
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "5px",
    background: `linear-gradient(90deg, ${FEATURE_COLORS.PRIMARY_PINK}, ${FEATURE_COLORS.LIGHT_BLUE})`,
    zIndex: 1,
  },
})

const getIconBoxStyles = (feature: Feature) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 80,
  height: 80,
  borderRadius: "20px",
  mb: 3,
  backgroundColor: feature.iconBg,
  color: feature.iconColor,
  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1) rotate(5deg)",
  },
})

const getTitleTextStyles = () => ({
  mb: 2,
  fontWeight: 700,
})

const getDescriptionStyles = () => ({
  color: "text.secondary",
  lineHeight: 1.7,
})

const Features: React.FC<FeaturesProps> = ({ features = DEFAULT_FEATURES, maxWidth = "lg" }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const titleVariants = {
    hidden: {
      y: -50,
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
        duration: 0.8,
      },
    },
  }

  const cardVariants = {
    hidden: (index: number) => ({
      x: index % 2 === 0 ? -100 : 100,
      opacity: 0,
      scale: 0.8,
      rotate: index % 2 === 0 ? -5 : 5,
    }),
    visible: (index: number) => ({
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
        delay: index * 0.1,
      },
    }),
  }

  const iconVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 10,
        delay: 0.3,
      },
    },
  }

  const renderFeatureCard = (feature: Feature, index: number) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <motion.div
        variants={cardVariants}
        custom={index}
        whileHover={{
          scale: 1.05,
          y: -10,
          transition: { duration: 0.3 },
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Card sx={getCardStyles()}>
          <CardContent sx={{ textAlign: "center", p: 4, height: "100%", display: "flex", flexDirection: "column" }}>
            <motion.div
              variants={iconVariants}
              whileHover={{
                scale: 1.2,
                rotate: 10,
                transition: { duration: 0.2 },
              }}
            >
              <Box sx={getIconBoxStyles(feature)}>{feature.icon}</Box>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Typography variant="h5" component="h3" sx={getTitleTextStyles()}>
                {index + 1}. {feature.title}
              </Typography>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Typography variant="body1" sx={getDescriptionStyles()}>
                {feature.description}
              </Typography>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Grid>
  )

  return (
    <Box sx={getSectionStyles()}>
      <Container maxWidth={maxWidth}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={titleVariants}>
            <Typography variant="h2" component="h2" sx={getTitleStyles()}>
              תכונות מרכזיות
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {features.map(renderFeatureCard)}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  )
}

export default Features