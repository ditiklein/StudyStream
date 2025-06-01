// // import { useEffect, useState } from "react"
// // import {
// //   Container,
// //   Typography,
// //   Grid,
// //   Card,
// //   CardMedia,
// //   CardContent,
// //   CardActions,
// //   Button,
// //   Chip,
// //   Box,
// //   Tabs,
// //   Tab,
// //   IconButton,
// //   Divider,
// //   Dialog,
// //   DialogTitle,
// //   DialogContent,
// //   DialogActions,
// //   TextField
// // } from "@mui/material"
// // import {
// //   Share,
// //   FilterList,
// //   Block,
// //   MenuBook,
// //   AccessTime,
// //   CalendarToday,
// //   ViewModule,
// //   ViewList,
// // } from "@mui/icons-material"
// // import { fetchUserFiles, selectFoldersAndFiles } from "../FileAndFolderStore/FilesSlice"
// // import { useDispatch, useSelector } from "react-redux"
// // import { AppDispatch } from "../FileAndFolderStore/FileStore"
// // import ShareLessonDialog from "./ShareModal"



// // const TeacherLessons = () => {
// //   // Changed default view to list instead of grid
// //   const [currentView, setCurrentView] = useState("list")
// //   const [tabValue, setTabValue] = useState(0)
// //   const [open, setOpen] = useState(false);
// //   const [email, setEmail] = useState("");
// //   const [selectedLessonId, setSelectedLessonId] = useState(null);
  
// //   const storedUser = sessionStorage.getItem('User');
// //   const user = storedUser ? JSON.parse(storedUser) : null;
// //   const dispatch = useDispatch<AppDispatch>();
// //   const { allUserFiles } = useSelector(selectFoldersAndFiles);
// //   console.log("aaaa", allUserFiles);
  
// //   useEffect(() => {
// //     if (user && user.id) {
// //       dispatch(fetchUserFiles(user.id));
// //     }
// //   }, [dispatch]);

// //   const handleTabChange = (event, newValue) => {
// //     setTabValue(newValue)
// //   }
  
// //   const handleShareClick = (lessonId) => {
// //     setSelectedLessonId(lessonId);
// //     setOpen(true);
// //   };
  
// //   const handleClose = () => {
// //     setOpen(false);
// //     setEmail("");
// //   };
  
// //   const handleViewChange = (view) => {
// //     setCurrentView(view);
// //   };
  
// //   const handleShare = async (email) => {
// //     try {
// //       // קריאה ל-API בצד השרת
// //       const response = await shareLesson(selectedLessonId, email);
// //       const data = await response.json();
  
// //       if (response.ok) {
// //         alert("השיעור שותף בהצלחה ונשלח במייל");
// //         // הצגת הקישור שהשרת שולח
// //         alert(`הקישור לצפייה בשיעור: ${data.shareLink}`);
// //       } else {
// //         alert("שגיאה בשיתוף: " + data.message);
// //       }
// //     } catch (error) {
// //       console.error(error);
// //       alert("שגיאה בשליחה");
// //     }
// //   };
  
// //   const shareLesson = async (lessonId, email) => {
// //     // שליחת בקשה ל-API בצד השרת
// //     return fetch("http://localhost:5220/api/shared", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({ LessonId: lessonId, Email: email })
// //     });
// //   };
  
// //   return (
// //     <Container maxWidth="lg" sx={{ py: 4 }}>
// //       {/* Share Lesson Dialog */}
// //       <ShareLessonDialog 
// //         open={open} 
// //         onClose={handleClose} 
// //         onShare={handleShare}
// //       />
      
// //       <Box sx={{ mb: 4, textAlign: "left" }}>
// //         <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
// //           השיעורים שלי
// //         </Typography>
// //         <Typography variant="body1" color="text.secondary">
// //           כאן תוכלי לצפות, לנהל ולשתף את כל השיעורים שלך
// //         </Typography>
        
// //         {/* Moved the gradient line here, right after the heading and subtitle */}
// //         <Box
// //           sx={{
// //             height: 4,
// //             background: "linear-gradient(to right, #f72585, #4361ee)",
// //             mt: 2, // Added margin top to create some space between the text and line
// //           }}
// //         />
// //       </Box>

// //       <Box
// //         sx={{
// //           display: "flex",
// //           flexDirection: { xs: "column", md: "row" },
// //           justifyContent: "space-between",
// //           alignItems: "center",
// //           mb: 4,
// //           gap: 2,
// //         }}
// //       >
// //         <Box sx={{ display: "flex", gap: 1 }}>
// //           <IconButton 
// //             onClick={() => handleViewChange("grid")} 
// //             color={currentView === "grid" ? "primary" : "default"}
// //           >
// //             <ViewModule />
// //           </IconButton>
// //           <IconButton 
// //             onClick={() => handleViewChange("list")} 
// //             color={currentView === "list" ? "primary" : "default"}
// //           >
// //             <ViewList />
// //           </IconButton>
// //           <Button variant="outlined" startIcon={<FilterList />} sx={{ mr: 1 }}>
// //             סינון
// //           </Button>
// //         </Box>
// //       </Box>

// //       <Box sx={{ mb: 4 }}>
// //         <Tabs value={tabValue} onChange={handleTabChange} centered textColor="primary" indicatorColor="primary">
// //           <Tab label="כל השיעורים" />
// //           <Tab label="משותפים" />
// //           <Tab label="אחרונים" />
// //         </Tabs>
// //       </Box>

// //       {allUserFiles && allUserFiles.length > 0 ? (
// //         <>
// //           {currentView === "grid" ? (
// //             <Grid container spacing={3}>
// //               {allUserFiles.map((file) => (
// //                 <Grid item xs={12} sm={6} md={4} key={file.id}>
// //                   <Card
// //                     sx={{
// //                       height: "100%",
// //                       display: "flex",
// //                       flexDirection: "column",
// //                       transition: "all 0.3s ease",
// //                       "&:hover": { transform: "translateY(-5px)" },
// //                       borderRadius: "10px",
// //                     }}
// //                   >
// //                     <Box sx={{ position: "relative" }}>
// //                     <CardMedia 
// //   component="img" 
// //   height="200" 
// //   image={'/e.png'} 
// //   alt={file.title || "שיעור"}
// //   sx={{ objectFit: "contain" }}  
// // />

// //                       <Chip
// //                         label={file.category || "כללי"}
// //                         color="primary"
// //                         size="small"
// //                         sx={{ position: "absolute", top: 12, right: 12 }}
// //                       />
// //                     </Box>
// //                     <CardContent sx={{ flexGrow: 1, textAlign: "le" }}>
// //                       <Typography variant="h3" component="h3" gutterBottom>
// //                         {file.lessonName || "שיעור ללא כותרת"}
// //                       </Typography>
// //                       <Typography variant="body1" color="text.secondary" paragraph>
// //                         {file.description || "אין תיאור לשיעור זה"}
// //                       </Typography>
// //                       <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
// //                         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
// //                           <Typography variant="caption">{file.views || 0} צפיות</Typography>
// //                           <MenuBook fontSize="small" />
// //                         </Box>
// //                         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
// //                           <Typography variant="caption">
// //                             {file.createdAt ? new Date(file.createdAt).toLocaleDateString("he-IL") : "לא זמין"}
// //                           </Typography>
// //                           <CalendarToday fontSize="small" />
// //                         </Box>
// //                         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
// //                           <Typography variant="caption">{file.duration || "לא זמין"}</Typography>
// //                           <AccessTime fontSize="small" />
// //                         </Box>
// //                       </Box>
// //                     </CardContent>
// //                     <Divider />
// //                     <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
// //                       <Button 
// //                         variant="contained" 
// //                         color="primary" 
// //                         endIcon={<Share />}
// //                         onClick={() => handleShareClick(file.id)}
// //                       >
// //                         שיתוף
// //                       </Button>
// //                       <Button variant="outlined" size="small" endIcon={<Block />}>
// //                         הסרת שיתוף
// //                       </Button>
// //                     </CardActions>
// //                   </Card>
// //                 </Grid>
// //               ))}
// //             </Grid>
// //           ) : (
// //             <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
// //               {allUserFiles.map((file) => (
// //                 <Card key={file.id} sx={{ borderRadius: "10px" }}>
// //                   <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
// //                     <Box
// //                       sx={{
// //                         display: "flex",
// //                         flexDirection: { xs: "row", md: "column" },
// //                         justifyContent: "center",
// //                         p: 2,
// //                         borderTop: { xs: 1, md: 0 },
// //                         borderRight: { xs: 0, md: 1 },
// //                         borderColor: "divider",
// //                       }}
// //                     >
// //                       <Button
// //                         onClick={() => handleShareClick(file.id)}
// //                         variant="contained"
// //                         color="primary"
// //                         endIcon={<Share />}
// //                         sx={{ mb: { xs: 0, md: 1 }, ml: { xs: 1, md: 0 } }}
// //                       >
// //                         שיתוף
// //                       </Button>
// //                       <Button variant="outlined" endIcon={<Block />}>
// //                         הסרת שיתוף
// //                       </Button>
// //                     </Box>
// //                     <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
// //                       <CardContent sx={{ textAlign: "right" }}>
// //                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
// //                           <Typography variant="h3" component="h3">
// //                             {file.lessonName || "שיעור ללא כותרת"}
// //                           </Typography>
// //                           <Chip label={file.category || "כללי"} color="primary" size="small" />
// //                         </Box>
// //                         <Typography variant="body1" color="text.secondary" paragraph>
// //                           {file.Description || "אין תיאור לשיעור זה"}
// //                         </Typography>
// //                         <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
// //                           <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
// //                             <Typography variant="caption">{file.views || 0} צפיות</Typography>
// //                             <MenuBook fontSize="small" />
// //                           </Box>
// //                           <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
// //                             <Typography variant="caption">
// //                               {file.createdAt ? new Date(file.createdAt).toLocaleDateString("he-IL") : "לא זמין"}
// //                             </Typography>
// //                             <CalendarToday fontSize="small" />
// //                           </Box>
// //                           <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
// //                             <Typography variant="caption">{file.duration || "לא זמין"}</Typography>
// //                             <AccessTime fontSize="small" />
// //                           </Box>
// //                         </Box>
// //                       </CardContent>
// //                     </Box>
// //                     <CardMedia
// //   component="img"
// //   sx={{ 
// //     width: { xs: "60%", md: 110 },  // הקטנה של הרוחב
// //     height: { xs: 110, md: "60%" }, // הקטנה של הגובה
// //     objectFit: "cover"  // יוודא שהתמונה תמלא את המיכל
// //   }}
// //   image={'/e.png'}
// //   alt={file.title || "שיעור"}
// // />




// //                   </Box>
// //                 </Card>
// //               ))}
// //             </Box>
// //           )}
// //         </>
// //       ) : (
// //         <Box sx={{ textAlign: "center", py: 5 }}>
// //           <Typography variant="h5">לא נמצאו שיעורים</Typography>
// //           <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
// //             לא נמצאו שיעורים במערכת
// //           </Typography>
// //         </Box>
// //       )}

// //     </Container>
// //   )
// // }

// // export default TeacherLessons




// import { useEffect, useState } from "react"
// import {
//   Container,
//   Typography,
//   Grid,
//   Card,
//   CardMedia,
//   CardContent,
//   CardActions,
//   Button,
//   Chip,
//   Box,
//   Tabs,
//   Tab,
//   IconButton,
//   Divider,
//   Snackbar,
//   Alert
// } from "@mui/material"
// import {
//   Share,
//   FilterList,
//   Block,
//   MenuBook,
//   AccessTime,
//   CalendarToday,
//   ViewModule,
//   ViewList,
// } from "@mui/icons-material"
// import { fetchUserFiles, selectFoldersAndFiles } from "../FileAndFolderStore/FilesSlice"
// import { useDispatch, useSelector } from "react-redux"
// import { AppDispatch } from "../FileAndFolderStore/FileStore"
// import ShareLessonDialog from "./ShareModal"

// const TeacherLessons = () => {
//   // Changed default view to list instead of grid
//   const [currentView, setCurrentView] = useState("list")
//   const [tabValue, setTabValue] = useState(0)
//   const [open, setOpen] = useState(false)
//   const [selectedLessonId, setSelectedLessonId] = useState(null)
//   const [snackbar, setSnackbar] = useState({
//     open: false,
//     message: "",
//     severity: "success"
//   })
  
//   const storedUser = sessionStorage.getItem('User')
//   const user = storedUser ? JSON.parse(storedUser) : null
//   const dispatch = useDispatch<AppDispatch>()
//   const { allUserFiles } = useSelector(selectFoldersAndFiles)
  
//   useEffect(() => {
//     if (user && user.id) {
//       dispatch(fetchUserFiles(user.id))
//     }
//   }, [dispatch])

//   const handleTabChange = (event, newValue) => {
//     setTabValue(newValue)
//   }
  
//   const handleShareClick = (lessonId) => {
//     setSelectedLessonId(lessonId)
//     setOpen(true)
//   }
  
//   const handleClose = () => {
//     setOpen(false)
//   }
  
//   const handleViewChange = (view) => {
//     setCurrentView(view)
//   }
  
//   const handleShare = async (email, isPublic) => {
//     try {
//       // Call the API
//       const response = await shareLesson(selectedLessonId, email, isPublic)
//       const data = await response.json()
  
//       if (response.ok) {
//         setSnackbar({
//           open: true,
//           message: "השיעור שותף בהצלחה ונשלח במייל",
//           severity: "success"
//         })
        
//         // Copy link to clipboard
//         navigator.clipboard.writeText(data.shareLink)
//           .then(() => {
//             setSnackbar({
//               open: true,
//               message: "הקישור הועתק ללוח",
//               severity: "info"
//             })
//           })
//           .catch(err => console.error("Failed to copy link: ", err))
//       } else {
//         setSnackbar({
//           open: true,
//           message: "שגיאה בשיתוף: " + data.message,
//           severity: "error"
//         })
//       }
//     } catch (error) {
//       console.error(error)
//       setSnackbar({
//         open: true,
//         message: "שגיאה בשליחה",
//         severity: "error"
//       })
//     }
//   }
  
//   const shareLesson = async (lessonId, email, isPublic) => {
//     // Send request to the server API
//     return fetch("http://localhost:5220/api/shared", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ 
//         lessonId: lessonId, 
//         email: email,
//         isPublic: isPublic 
//       })
//     })
//   }
// console.log("allUserFiles",allUserFiles);

//   const handleRemoveShare = async (lessonId) => {
//     try {
//       const response = await fetch(`http://localhost:5220/api/shared/${lessonId}`, {
//         method: "DELETE"
//       })
      
//       if (response.ok) {
//         setSnackbar({
//           open: true,
//           message: "השיתוף הוסר בהצלחה",
//           severity: "success"
//         })
//       } else {
//         const data = await response.json()
//         setSnackbar({
//           open: true,
//           message: "שגיאה בהסרת השיתוף: " + data.message,
//           severity: "error"
//         })
//       }
//     } catch (error) {
//       console.error(error)
//       setSnackbar({
//         open: true,
//         message: "שגיאה בהסרת השיתוף",
//         severity: "error"
//       })
//     }
//   }
  
//   const handleCloseSnackbar = () => {
//     setSnackbar(prev => ({ ...prev, open: false }))
//   }
  
//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       {/* Share Lesson Dialog */}
//       <ShareLessonDialog 
//         open={open} 
//         onClose={handleClose} 
//         onShare={handleShare}
//       />
      
//       {/* Snackbar for notifications */}
//       <Snackbar
//         open={snackbar.open}
//         autoHideDuration={6000}
//         onClose={handleCloseSnackbar}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
//       >
//         <Alert 
//           onClose={handleCloseSnackbar} 
//           severity={snackbar.severity as any} 
//           variant="filled"
//         >
//           {snackbar.message}
//         </Alert>
//       </Snackbar>
      
//       <Box sx={{ mb: 4, textAlign: "left" }}>
//         <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
//           השיעורים שלי
//         </Typography>
//         <Typography variant="body1" color="text.secondary">
//           כאן תוכלי לצפות, לנהל ולשתף את כל השיעורים שלך
//         </Typography>
        
//         {/* Gradient line */}
//         <Box
//           sx={{
//             height: 4,
//             background: "linear-gradient(to right, #f72585, #4361ee)",
//             mt: 2,
//           }}
//         />
//       </Box>

//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column", md: "row" },
//           justifyContent: "space-between",
//           alignItems: "center",
//           mb: 4,
//           gap: 2,
//         }}
//       >
//         <Box sx={{ display: "flex", gap: 1 }}>
//           <IconButton 
//             onClick={() => handleViewChange("grid")} 
//             color={currentView === "grid" ? "primary" : "default"}
//           >
//             <ViewModule />
//           </IconButton>
//           <IconButton 
//             onClick={() => handleViewChange("list")} 
//             color={currentView === "list" ? "primary" : "default"}
//           >
//             <ViewList />
//           </IconButton>
//           <Button variant="outlined" startIcon={<FilterList />} sx={{ mr: 1 }}>
//             סינון
//           </Button>
//         </Box>
//       </Box>

//       <Box sx={{ mb: 4 }}>
//         <Tabs value={tabValue} onChange={handleTabChange} centered textColor="primary" indicatorColor="primary">
//           <Tab label="כל השיעורים" />
//           <Tab label="משותפים" />
//           <Tab label="אחרונים" />
//         </Tabs>
//       </Box>

//       {allUserFiles && allUserFiles.length > 0 ? (
//         <>
//           {currentView === "grid" ? (
//             <Grid container spacing={3}>
//               {allUserFiles.map((file) => (
//                 <Grid item xs={12} sm={6} md={4} key={file.id}>
//                   <Card
//                     sx={{
//                       height: "100%",
//                       display: "flex",
//                       flexDirection: "column",
//                       transition: "all 0.3s ease",
//                       "&:hover": { transform: "translateY(-5px)" },
//                       borderRadius: "10px",
//                     }}
//                   >
//                     <Box sx={{ position: "relative" }}>
//                       <CardMedia 
//                         component="img" 
//                         height="200" 
//                         image={'/e.png'} 
//                         alt={file.title || "שיעור"}
//                         sx={{ objectFit: "contain" }}  
//                       />
//                       <Chip
//                         label={file.category || "כללי"}
//                         color="primary"
//                         size="small"
//                         sx={{ position: "absolute", top: 12, right: 12 }}
//                       />
//                     </Box>
//                     <CardContent sx={{ flexGrow: 1, textAlign: "le" }}>
//                       <Typography variant="h3" component="h3" gutterBottom>
//                         {file.lessonName || "שיעור ללא כותרת"}
//                       </Typography>
//                       <Typography variant="body1" color="text.secondary" paragraph>
//                         {file.description || "אין תיאור לשיעור זה"}
//                       </Typography>
//                       <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                           <Typography variant="caption">{file.views || 0} צפיות</Typography>
//                           <MenuBook fontSize="small" />
//                         </Box>
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                           <Typography variant="caption">
//                             {file.createdAt ? new Date(file.createdAt).toLocaleDateString("he-IL") : "לא זמין"}
//                           </Typography>
//                           <CalendarToday fontSize="small" />
//                         </Box>
//                         <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                           <Typography variant="caption">{file.duration || "לא זמין"}</Typography>
//                           <AccessTime fontSize="small" />
//                         </Box>
//                       </Box>
//                     </CardContent>
//                     <Divider />
//                     <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
//                       <Button 
//                         variant="contained" 
//                         color="primary" 
//                         endIcon={<Share />}
//                         onClick={() => handleShareClick(file.id)}
//                       >
//                         שיתוף
//                       </Button>
//                       <Button 
//                         variant="outlined" 
//                         size="small" 
//                         endIcon={<Block />}
//                         onClick={() => handleRemoveShare(file.id)}
//                       >
//                         הסרת שיתוף
//                       </Button>
//                     </CardActions>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           ) : (
//             <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//               {allUserFiles.map((file) => (
//                 <Card key={file.id} sx={{ borderRadius: "10px" }}>
//                   <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         flexDirection: { xs: "row", md: "column" },
//                         justifyContent: "center",
//                         p: 2,
//                         borderTop: { xs: 1, md: 0 },
//                         borderRight: { xs: 0, md: 1 },
//                         borderColor: "divider",
//                       }}
//                     >
//                       <Button
//                         onClick={() => handleShareClick(file.id)}
//                         variant="contained"
//                         color="primary"
//                         endIcon={<Share />}
//                         sx={{ mb: { xs: 0, md: 1 }, ml: { xs: 1, md: 0 } }}
//                       >
//                         שיתוף
//                       </Button>
//                       <Button 
//                         variant="outlined" 
//                         endIcon={<Block />}
//                         onClick={() => handleRemoveShare(file.id)}
//                       >
//                         הסרת שיתוף
//                       </Button>
//                     </Box>
//                     <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
//                       <CardContent sx={{ textAlign: "right" }}>
//                         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
//                           <Typography variant="h3" component="h3">
//                             {file.urlName || "שיעור ללא כותרת"}
//                           </Typography>
//                           <Chip label={file.category || "כללי"} color="primary" size="small" />
//                         </Box>
//                         <Typography variant="body1" color="text.secondary" paragraph>
//                           {file.description || "אין תיאור לשיעור זה"}
//                         </Typography>
//                         <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 2 }}>
//                           <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                             <Typography variant="caption">{file.views || 0} צפיות</Typography>
//                             <MenuBook fontSize="small" />
//                           </Box>
//                           <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                             <Typography variant="caption">
//                               {file.createdAt ? new Date(file.createdAt).toLocaleDateString("he-IL") : "לא זמין"}
//                             </Typography>
//                             <CalendarToday fontSize="small" />
//                           </Box>
//                           <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                             <Typography variant="caption">{file.duration || "לא זמין"}</Typography>
//                             <AccessTime fontSize="small" />
//                           </Box>
//                         </Box>
//                       </CardContent>
//                     </Box>
//                     <CardMedia
//                       component="img"
//                       sx={{ 
//                         width: { xs: "60%", md: 110 },
//                         height: { xs: 110, md: "60%" },
//                         objectFit: "cover"
//                       }}
//                       image={'/e.png'}
//                       alt={file.title || "שיעור"}
//                     />
//                   </Box>
//                 </Card>
//               ))}
//             </Box>
//           )}
//         </>
//       ) : (
//         <Box sx={{ textAlign: "center", py: 5 }}>
//           <Typography variant="h5">לא נמצאו שיעורים</Typography>
//           <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
//             לא נמצאו שיעורים במערכת
//           </Typography>
//         </Box>
//       )}
//     </Container>
//   )
// }

// export default TeacherLessons
import { Box, Typography, Container, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

const TeacherLessons = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 4,
        }}
      >
        {/* אייקון מרכזי */}
        <Box sx={{ fontSize: 80, mb: 3 }}>🚧</Box>

        <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#1976D2', mb: 2 }}>
          🚧 בשיפוצים 🚧
        </Typography>

        <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
          אנחנו עובדים קשה כדי להביא לכם משהו מדהים!
        </Typography>

        <Typography variant="body1" sx={{ color: '#888', mb: 4, maxWidth: '600px' }}>
          העמוד הזה בשלבי פיתוח ובקרוב יהיה זמין עם תכונות חדשות ומרגשות. תודה על הסבלנות! 💪
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/home')}
          sx={{ borderRadius: '50px', px: 4 }}
        >
          חזרה לעמוד הבית
        </Button>
      </Box>
    </Container>
  );
};

export default TeacherLessons;