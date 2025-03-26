// import { AppBar, Toolbar, Typography, Button, Box, Container, useMediaQuery, useTheme } from '@mui/material';
// import FolderOpenIcon from '@mui/icons-material/FolderOpen';

// function Header() {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   return (
//     <AppBar 
//       position="sticky" 
//       color="default" 
//       elevation={3}
//       sx={{
//         backgroundColor: 'background.paper',
//         py: 1,
//       }}
//     >
//       <Container maxWidth="xl">
//         <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
//           <Box sx={{ display: 'flex', alignItems: 'center' }}>
//             <FolderOpenIcon 
//               sx={{ 
//                 display: { xs: 'flex' }, 
//                 mr: 1.5, 
//                 color: 'primary.main',
//                 fontSize: 32
//               }} 
//             />
//             <Typography
//               variant="h5"
//               noWrap
//               component="a"
//               href="/"
//               sx={{
//                 mr: 2,
//                 display: { xs: 'flex' },
//                 fontWeight: 700,
//                 color: 'primary.main',
//                 textDecoration: 'none',
//               }}
//             >
//               FolioTeach
//             </Typography>
//           </Box>

//           {/* כפתור "כניסה לאזור האישי" */}
//           <Button 
//             variant="contained" 
//             disableElevation
//             sx={{ 
//               bgcolor: 'linear-gradient(120deg, #4361ee, #7209b7)',
//               color: 'white',
//               borderRadius: '50px',
//               px: 3,
//               py: 1,
//               fontWeight: 600,
//               boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//               transition: 'all 0.3s ease',
//               '&:hover': {
//                 transform: 'translateY(-3px)',
//                 boxShadow: '0 6px 12px rgba(0, 0, 0, 0.25)'
//               }
//             }}
//           >
//             כניסה לאזור האישי
//           </Button>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }

// export default Header;
