// import React from 'react';
// import {
//   Box,
//   Container,
//   Typography,
//   Grid,
//   useTheme,
//   useMediaQuery,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import { useSelector } from 'react-redux';
// import Swal from 'sweetalert2';
// import { selectKeyPoints } from '../../FileAndFolderStore/KeyPointsSlice';
// import { useTranscriptionProcess } from './useTranscriptionProcess';
// import { TranscriptionResults } from './TranscriptionResults';
// import { FileUploadArea } from './FileUploadArea';
// import { DEMO_STEPS, DemoStep } from './DemoSteps';
// const Demo: React.FC = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
//   const keyPointsState = useSelector(selectKeyPoints);
//   const {
//     isLoading,
//     processingStage,
//     transcriptionResult,
//     error,
//     processFile,
//     clearError
//   } = useTranscriptionProcess();

//   const handleNewTranscription = () => {
//     Swal.fire({
//       title: 'הירשם עכשיו!',
//       text: 'אתה צריך לפתוח אזור אישי אצלנו בשביל להמשיך להנות מהיכולות שלנו',
//       icon: 'info',
//       confirmButtonText: 'להרשמה',
//       confirmButtonColor: theme.palette.primary.main,
//       showCancelButton: true,
//       cancelButtonText: 'לא עכשיו',
//       cancelButtonColor: '#d33',
//       customClass: {
//         popup: 'swal-rtl'
//       }
//     }).then((result) => {
//       if (result.isConfirmed) {
//         window.location.href = '/signup';
//       }
//     });
//   };

//   return (
//     <Box sx={{ py: 8, bgcolor: 'background.paper' }} dir="rtl">
//       <Container>
//         <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
//           כיצד זה עובד
//         </Typography>
//         <Typography 
//           variant="body1" 
//           textAlign="center" 
//           paragraph 
//           sx={{ maxWidth: 800, mx: 'auto', mb: 6 }}
//         >
//           הסתכל כיצד המערכת יכולה להפוך את ההקלטות שלך לטקסט מוכן לשימוש ולסכם את הנקודות החשובות בשיעור:
//         </Typography>
        
//         <Grid container spacing={4} direction={isMobile ? 'column' : 'row'}>
//           <Grid item xs={12} md={6}>
//             {transcriptionResult ? (
//               <TranscriptionResults
//                 transcriptionResult={transcriptionResult}
//                 keyPoints={keyPointsState.keyPoints}
//                 summary={keyPointsState.summary}
//                 fileName="הקובץ שהועלה"
//                 onNewTranscription={handleNewTranscription}
//               />
//             ) : (
//               <FileUploadArea
//                 isLoading={isLoading}
//                 processingStage={processingStage}
//                 onFileProcess={processFile}
//               />
//             )}
//           </Grid>
          
//           <Grid item xs={12} md={6}>
//             <Box sx={{ textAlign: 'right' }}>
// {DEMO_STEPS.map((step, index) => (
//   <DemoStep key={index} {...step} />
// ))}
//             </Box>
//           </Grid>
//         </Grid>
//       </Container>
      
//       <Snackbar open={!!error} autoHideDuration={6000} onClose={clearError}>
//         <Alert onClose={clearError} severity="error" sx={{ width: '100%' }}>
//           {error}
//         </Alert>
//       </Snackbar>
      
//       <Snackbar 
//         open={!!keyPointsState.error} 
//         autoHideDuration={6000} 
//         onClose={() => {/* dispatch clear error action */}}
//       >
//         <Alert severity="warning" sx={{ width: '100%' }}>
//           {keyPointsState.error || "שגיאה בעיבוד נקודות חשובות או סיכום"}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default Demo;


"use client"

import type React from "react"
import { Box, Container, Typography, Grid, useTheme, useMediaQuery, Snackbar, Alert } from "@mui/material"
import { useSelector } from "react-redux"
import Swal from "sweetalert2"
import { motion } from "framer-motion"
import { selectKeyPoints } from "../../FileAndFolderStore/KeyPointsSlice"
import { useTranscriptionProcess } from "./useTranscriptionProcess"
import { TranscriptionResults } from "./TranscriptionResults"
import { FileUploadArea } from "./FileUploadArea"
import { DEMO_STEPS, DemoStep } from "./DemoSteps"

const Demo: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const keyPointsState = useSelector(selectKeyPoints)
  const { isLoading, processingStage, transcriptionResult, error, processFile, clearError } = useTranscriptionProcess()

  const handleNewTranscription = () => {
    Swal.fire({
      title: "הירשם עכשיו!",
      text: "אתה צריך לפתוח אזור אישי אצלנו בשביל להמשיך להנות מהיכולות שלנו",
      icon: "info",
      confirmButtonText: "להרשמה",
      confirmButtonColor: theme.palette.primary.main,
      showCancelButton: true,
      cancelButtonText: "לא עכשיו",
      cancelButtonColor: "#d33",
      customClass: {
        popup: "swal-rtl",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/signup"
      }
    })
  }

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
        duration: 0.8,
      },
    },
  }

  const rightSlideVariants = {
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
        duration: 0.8,
      },
    },
  }

  const titleVariants = {
    hidden: {
      y: -50,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10,
        duration: 0.6,
      },
    },
  }

  const subtitleVariants = {
    hidden: {
      y: 30,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.3,
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.7,
      },
    },
  }

  return (
    <Box sx={{ py: 8, bgcolor: "background.paper" }} dir="rtl">
      <Container>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={titleVariants}>
            <Typography variant="h2" component="h2" textAlign="center" gutterBottom>
              כיצד זה עובד
            </Typography>
          </motion.div>

          <motion.div variants={subtitleVariants}>
            <Typography variant="body1" textAlign="center" paragraph sx={{ maxWidth: 800, mx: "auto", mb: 6 }}>
              הסתכל כיצד המערכת יכולה להפוך את ההקלטות שלך לטקסט מוכן לשימוש ולסכם את הנקודות החשובות בשיעור:
            </Typography>
          </motion.div>
        </motion.div>

        <Grid container spacing={4} direction={isMobile ? "column" : "row"}>
          <Grid item xs={12} md={6}>
            <motion.div
              variants={leftSlideVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              {transcriptionResult ? (
                <TranscriptionResults
                  transcriptionResult={transcriptionResult}
                  keyPoints={keyPointsState.keyPoints}
                  summary={keyPointsState.summary}
                  fileName="הקובץ שהועלה"
                  onNewTranscription={handleNewTranscription}
                />
              ) : (
                <FileUploadArea isLoading={isLoading} processingStage={processingStage} onFileProcess={processFile} />
              )}
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              variants={rightSlideVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <Box sx={{ textAlign: "right" }}>
                {DEMO_STEPS.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.2,
                      type: "spring",
                      stiffness: 100,
                      damping: 12,
                    }}
                    whileHover={{
                      x: -10,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <DemoStep {...step} />
                  </motion.div>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={clearError}>
        <Alert onClose={clearError} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!keyPointsState.error}
        autoHideDuration={6000}
        onClose={() => {
          /* dispatch clear error action */
        }}
      >
        <Alert severity="warning" sx={{ width: "100%" }}>
          {keyPointsState.error || "שגיאה בעיבוד נקודות חשובות או סיכום"}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default Demo
