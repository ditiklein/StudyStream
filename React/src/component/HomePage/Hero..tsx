// import { Box, Container, Typography, Button, Grid } from "@mui/material";
// import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
// import ImageCarousel from "./Imagecorsol";
// import { Link } from 'react-router-dom';

// function Hero() {
//   // const theme = useTheme();
//   // const isMobile = useMediaQuery(theme.breakpoints.down("md"));

//   return (
//     <Box
//       sx={{
//         position: "relative",
//         overflow: "hidden",
//         height: "60vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       {/* קרוסלת תמונות כרקע */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           zIndex: 1,
//         }}
//       >
//         <ImageCarousel />
//       </Box>

//       <Container
//         maxWidth="xl"
//         sx={{
//           position: "relative",
//           zIndex: 2,
//           textAlign: "center",
//         }}
//       >
//         <Grid container spacing={4} alignItems="center" justifyContent="center">
//           {/* טקסט ממורכז */}
//           <Grid item xs={12} md={6}>
//             <Typography
//               variant="h1"
//               component="h1"
//               sx={{
//                 fontSize: { xs: "2.2rem", md: "3rem" },
//                 fontWeight: 800,
//                 mb: 3,
//                 textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
//                 lineHeight: 1.2,
//               }}
//             >
//               נהל את חומרי הלימוד שלך בצורה חכמה
//             </Typography>

//             <Typography
//               variant="body1"
//               sx={{
//                 fontSize: { xs: "1.1rem", md: "1.2rem" },
//                 mb: 4,
//                 maxWidth: "600px",
//                 mx: "auto",
//                 lineHeight: 1.7,
//               }}
//             >
//               המערכת המתקדמת לניהול קבצי לימוד, שיעורים והקלטות עבור מורים ומרצים. ארגן, גלה תובנות ושתף בקלות את כל החומרים שלך במקום אחד.
//             </Typography>

//             <Button
//               variant="contained"
//               component={Link}
//               to="/register"
//               endIcon={<RocketLaunchIcon />}
//               sx={{
//                 bgcolor: "#f72585",
//                 fontSize: { xs: "1rem", md: "1.1rem" },
//                 fontWeight: 700,
//                 borderRadius: "50px",
//                 px: { xs: 3, md: 4 },
//                 py: { xs: 1.2, md: 1.5 },
//                 boxShadow: "0 4px 15px rgba(247, 37, 133, 0.3)",
//                 transition: "all 0.3s ease, background-color 0.5s ease", // Added longer transition for background-color
//                 "&:hover": {
//                   bgcolor: "#1976D2", // Changed to blue on hover
//                   transform: "translateY(-5px)",
//                   boxShadow: "0 8px 25px rgba(25, 118, 210, 0.4)",
//                 },
//               }}
//             >
//               הצטרף עכשיו
//             </Button>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// }

// export default Hero;
"use client"

import { Box, Container, Typography, Button, Grid } from "@mui/material"
import { motion } from "framer-motion"
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch"
import ImageCarousel from "./Imagecorsol"
import { Link } from "react-router-dom"

function Hero() {
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

  const titleVariants = {
    hidden: {
      x: -100,
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 1,
      },
    },
  }

  const subtitleVariants = {
    hidden: {
      x: 100,
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 1,
        delay: 0.3,
      },
    },
  }

  const buttonVariants = {
    hidden: {
      y: 50,
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 12,
        duration: 0.8,
        delay: 0.6,
      },
    },
  }

  const backgroundVariants = {
    hidden: {
      scale: 1.1,
      opacity: 0,
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        height: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* קרוסלת תמונות כרקע */}
      <motion.div
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <ImageCarousel />
      </motion.div>

      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
        }}
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <motion.div variants={titleVariants}>
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: { xs: "2.2rem", md: "3rem" },
                    fontWeight: 800,
                    mb: 3,
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                    lineHeight: 1.2,
                  }}
                >
                  נהל את חומרי הלימוד שלך בצורה חכמה
                </Typography>
              </motion.div>

              <motion.div variants={subtitleVariants}>
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: "1.1rem", md: "1.2rem" },
                    mb: 4,
                    maxWidth: "600px",
                    mx: "auto",
                    lineHeight: 1.7,
                  }}
                >
                  המערכת המתקדמת לניהול קבצי לימוד, שיעורים והקלטות עבור מורים ומרצים. ארגן, גלה תובנות ושתף בקלות את כל
                  החומרים שלך במקום אחד.
                </Typography>
              </motion.div>

              <motion.div
                variants={buttonVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  component={Link}
                  to="/register"
                  endIcon={<RocketLaunchIcon />}
                  sx={{
                    bgcolor: "#f72585",
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    fontWeight: 700,
                    borderRadius: "50px",
                    px: { xs: 3, md: 4 },
                    py: { xs: 1.2, md: 1.5 },
                    boxShadow: "0 4px 15px rgba(247, 37, 133, 0.3)",
                    transition: "all 0.3s ease, background-color 0.5s ease",
                    "&:hover": {
                      bgcolor: "#1976D2",
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 25px rgba(25, 118, 210, 0.4)",
                    },
                  }}
                >
                  הצטרף עכשיו
                </Button>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  )
}

export default Hero

