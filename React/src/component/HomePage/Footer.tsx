// import { Box, Button, Typography, Container, Grid, IconButton } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import FacebookIcon from '@mui/icons-material/Facebook';
// import InstagramIcon from '@mui/icons-material/Instagram';
// import LinkedInIcon from '@mui/icons-material/LinkedIn';

// const GradientBox = styled(Box)(({ theme }) => ({
//   background: 'linear-gradient(90deg, #3f51b5 0%, #7e57c2 100%)',
//   padding: theme.spacing(6, 2),
//   color: 'white',
//   direction: 'rtl',
// }));

// const RoundedButton = styled(Button)(({ theme }) => ({
//   borderRadius: '50px',
//   padding: theme.spacing(1, 3),
//   fontWeight: 'bold',
//   textTransform: 'none',
  
//     backgroundColor: '#ec407a',
//     '&:hover': {
//       backgroundColor: '#d81b60',
//     },
//   }),
// );

// const SocialIconButton = styled(IconButton)(({ theme }) => ({
//   backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   color: 'white',
//   margin: theme.spacing(0, 1),
//   '&:hover': {
//     backgroundColor: 'rgba(255, 255, 255, 0.3)',
//   },
// }));

// const Footer = () => {
//   return (
//     <GradientBox>
//       <Container maxWidth="lg">
//         <Grid container justifyContent="space-between" alignItems="center" spacing={4}>
//           {/* כאן החלפתי בין צד שמאל לצד ימין */}
//           <Grid item xs={12} md={6}>
//             <Box display="flex" justifyContent={{ xs: 'center', md: 'flex-end' }} alignItems="center">
//               <Box>
//                 <SocialIconButton aria-label="facebook">
//                   <FacebookIcon />
//                 </SocialIconButton>
//                 <SocialIconButton aria-label="instagram">
//                   <InstagramIcon />
//                 </SocialIconButton>
//                 <SocialIconButton aria-label="linkedin">
//                   <LinkedInIcon />
//                 </SocialIconButton>
//               </Box>
              
//               <RoundedButton 
//                 variant="contained" 
//                 sx={{ 
//                   backgroundColor: 'white', 
//                   color: '#7e57c2',
//                   '&:hover': { backgroundColor: '#f5f5f5' },
//                   ml: 3 // שיניתי מ-mr ל-ml
//                 }}
//               >
//                 צור קשר
//               </RoundedButton>
//             </Box>
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <Box display="flex" flexDirection="column" alignItems="flex-end"> {/* שיניתי מ-flex-end ל-flex-start */}
//               <Typography variant="h4" fontWeight="bold" gutterBottom>
//                 התחל ללמוד עוד היום
//               </Typography>
//               <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
//                 גלה את הקורסים המובילים שלנו ופתח את הפוטנציאל שלך
//               </Typography>
//               <RoundedButton variant="contained" size="large" href="/register"
              
// >
//                 הצטרף עכשיו
//               </RoundedButton>
//             </Box>
//           </Grid>
//         </Grid>
//       </Container>
//     </GradientBox>
//   );
// };

// export default Footer;
"use client"

import { Box, Button, Typography, Container, Grid, IconButton } from "@mui/material"
import { styled } from "@mui/material/styles"
import { motion } from "framer-motion"
import FacebookIcon from "@mui/icons-material/Facebook"
import InstagramIcon from "@mui/icons-material/Instagram"
import LinkedInIcon from "@mui/icons-material/LinkedIn"

const GradientBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(90deg, #3f51b5 0%, #7e57c2 100%)",
  padding: theme.spacing(6, 2),
  color: "white",
  direction: "rtl",
}))

const RoundedButton = styled(Button)(({ theme }) => ({
  borderRadius: "50px",
  padding: theme.spacing(1, 3),
  fontWeight: "bold",
  textTransform: "none",

  backgroundColor: "#ec407a",
  "&:hover": {
    backgroundColor: "#d81b60",
  },
}))

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  color: "white",
  margin: theme.spacing(0, 1),
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
}))

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  }

  const leftSlideVariants = {
    hidden: {
      x: -100,
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 0.8,
      },
    },
  }

  const rightSlideVariants = {
    hidden: {
      x: 100,
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 15,
        duration: 0.8,
      },
    },
  }

  const socialIconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: (i: number) => ({
      scale: 1,
      rotate: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 200,
        damping: 10,
      },
    }),
  }

  return (
    <GradientBox>
      <Container maxWidth="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Grid container justifyContent="space-between" alignItems="center" spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div variants={rightSlideVariants}>
                <Box display="flex" justifyContent={{ xs: "center", md: "flex-end" }} alignItems="center">
                  <Box>
                    {[FacebookIcon, InstagramIcon, LinkedInIcon].map((Icon, index) => (
                      <motion.div
                        key={index}
                        style={{ display: "inline-block" }}
                        variants={socialIconVariants}
                        custom={index}
                        whileHover={{
                          scale: 1.2,
                          rotate: 10,
                          transition: { duration: 0.2 },
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <SocialIconButton aria-label={`social-${index}`}>
                          <Icon />
                        </SocialIconButton>
                      </motion.div>
                    ))}
                  </Box>

                  <motion.div
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RoundedButton
                      variant="contained"
                      sx={{
                        backgroundColor: "white",
                        color: "#7e57c2",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                        ml: 3,
                      }}
                    >
                      צור קשר
                    </RoundedButton>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={leftSlideVariants}>
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                  >
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      התחל ללמוד עוד היום
                    </Typography>
                  </motion.div>

                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                      גלה את הקורסים המובילים שלנו ופתח את הפוטנציאל שלך
                    </Typography>
                  </motion.div>

                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, type: "spring", stiffness: 150 }}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <RoundedButton variant="contained" size="large" href="/register">
                      הצטרף עכשיו
                    </RoundedButton>
                  </motion.div>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </GradientBox>
  )
}

export default Footer
