// import { useEffect, useState } from "react"
// import { useSearchParams } from "react-router-dom"
// import {
//   Container,
//   Typography,
//   Box,
//   Card,
//   Button,
//   CircularProgress,
//   Divider,
//   Paper,
//   Alert,
//   AlertTitle
// } from "@mui/material"
// import {
//   CheckCircle,
//   Cancel,
//   Email
// } from "@mui/icons-material"

// const ApproveAccess = () => {
//   const [searchParams] = useSearchParams()
//   const token = searchParams.get("token")
  
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [requestInfo, setRequestInfo] = useState<{
//     email?: string
//     lessonName?: string
//   }>({})
//   const [status, setStatus] = useState<"pending" | "approved" | "rejected" | "error">("pending")
  
//   useEffect(() => {
//     if (token) {
//       fetchRequestInfo()
//     } else {
//       setError("חסר מזהה בקשה")
//       setLoading(false)
//     }
//   }, [token])
  
//   const fetchRequestInfo = async () => {
//     try {
//       const response = await fetch(`http://localhost:5220/api/shared/request/${token}`)
      
//       if (!response.ok) {
//         throw new Error("בקשת גישה לא נמצאה או שפג תוקפה")
//       }
      
//       const data = await response.json()
//       setRequestInfo({
//         email: data.email,
//         lessonName: data.lessonName
//       })
//       setLoading(false)
//     } catch (error) {
//       console.error(error)
//       setError(error instanceof Error ? error.message : "שגיאה בטעינת פרטי הבקשה")
//       setLoading(false)
//     }
//   }
  
//   const handleApproval = async (approved: boolean) => {
//     setLoading(true)
    
//     try {
//       const response = await fetch("http://localhost:5220/api/shared/approve-access", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           requestToken: token,
//           approved
//         })
//       })
      
//       if (!response.ok) {
//         throw new Error("שגיאה באישור הבקשה")
//       }
      
//       setStatus(approved ? "approved" : "rejected")
//       setLoading(false)
//     } catch (error) {
//       console.error(error)
//       setError(error instanceof Error ? error.message : "שגיאה באישור הבקשה")
//       setStatus("error")
//       setLoading(false)
//     }
//   }
  
//   if (loading) {
//     return (
//       <Container maxWidth="sm" sx={{ py: 8, textAlign: "center" }}>
//         <CircularProgress size={60} />
//         <Typography variant="h6" sx={{ mt: 2 }}>
//           טוען...
//         </Typography>
//       </Container>
//     )
//   }
  
//   if (error) {
//     return (
//       <Container maxWidth="sm" sx={{ py: 8 }}>
//         <Alert severity="error" variant="filled">
//           <AlertTitle>שגיאה</AlertTitle>
//           {error}
//         </Alert>
//       </Container>
//     )
//   }
  
//   if (status === "approved") {
//     return (
//       <Container maxWidth="sm" sx={{ py: 8 }}>
//         <Paper 
//           elevation={3} 
//           sx={{ 
//             p: 4, 
//             textAlign: "center",
//             borderRadius: 2,
//             border: "1px solid #4caf50",
//             boxShadow: "0 4px 12px rgba(76, 175, 80, 0.2)"
//           }}
//         >
//           <Box sx={{ mb: 3 }}>
//             <CheckCircle color="success" sx={{ fontSize: 60 }} />
//           </Box>
//           <Typography variant="h4" gutterBottom>
//             הגישה אושרה בהצלחה
//           </Typography>
//           <Typography variant="body1" color="text.secondary" paragraph>
//             אישרת גישה למשתמש {requestInfo.email} לשיעור {requestInfo.lessonName}.
//           </Typography>
//           <Typography variant="body1" paragraph>
//             המשתמש יקבל מייל עם קישור לצפייה בשיעור.
//           </Typography>
//         </Paper>
//       </Container>
//     )
//   }
  
//   if (status === "rejected") {
//     return (
//       <Container maxWidth="sm" sx={{ py: 8 }}>
//         <Paper 
//           elevation={3} 
//           sx={{ 
//             p: 4, 
//             textAlign: "center",
//             borderRadius: 2,
//             border: "1px solid #f44336",
//             boxShadow: "0 4px 12px rgba(244, 67, 54, 0.2)"
//           }}
//         >
//           <Box sx={{ mb: 3 }}>
//             <Cancel color="error" sx={{ fontSize: 60 }} />
//           </Box>
//           <Typography variant="h4" gutterBottom>
//             הגישה נדחתה
//           </Typography>
//           <Typography variant="body1" color="text.secondary" paragraph>
//             דחית את בקשת הגישה של {requestInfo.email} לשיעור {requestInfo.lessonName}.
//           </Typography>
//           <Typography variant="body1" paragraph>
//             המשתמש לא יוכל לצפות בשיעור.
//           </Typography>
//         </Paper>
//       </Container>
//     )
//   }
  
//   return (
//     <Container maxWidth="sm" sx={{ py: 8 }}>
//       <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
//         <Box 
//           sx={{ 
//             p: 3, 
//             background: "linear-gradient(to right, #f72585, #4361ee)",
//             color: "white"
//           }}
//         >
//           <Typography variant="h4" gutterBottom>
//             בקשת גישה לשיעור
//           </Typography>
//           <Typography variant="body1">
//             אתה מתבקש לאשר או לדחות את בקשת הגישה
//           </Typography>
//         </Box>
        
//         <Box sx={{ p: 3 }}>
//           <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//             <Email sx={{ mr: 1, color: "primary.main" }} />
//             <Typography variant="body1">
//               <strong>מייל המבקש:</strong> {requestInfo.email}
//             </Typography>
//           </Box>
          
//           <Typography variant="body1" sx={{ mb: 2 }}>
//             <strong>שם השיעור:</strong> {requestInfo.lessonName}
//           </Typography>
          
//           <Alert severity="info" sx={{ mb: 3 }}>
//             <AlertTitle>שים לב</AlertTitle>
//             אישור הגישה יאפשר למשתמש לצפות בשיעור שלך. 
//             <br />
//             הקישור יישלח למייל של המבקש.
//           </Alert>
//         </Box>
        
//         <Divider />
        
//         <Box sx={{ p: 3, display: "flex", justifyContent: "space-between" }}>
//           <Button 
//             variant="outlined" 
//             color="error" 
//             onClick={() => handleApproval(false)}
//             startIcon={<Cancel />}
//             size="large"
//           >
//             דחה בקשה
//           </Button>
//           <Button 
//             variant="contained" 
//             color="primary" 
//             onClick={() => handleApproval(true)}
//             startIcon={<CheckCircle />}
//             size="large"
//           >
//             אשר גישה
//           </Button>
//         </Box>
//       </Card>
//     </Container>
//   )
// }

// export default ApproveAccess
