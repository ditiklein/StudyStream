
// import { AppBar, Toolbar, Button, Box, Container, Typography } from '@mui/material';
// import { Link, Outlet, useNavigate } from 'react-router-dom';
// import { NameAvatar } from './Auth/Avatar';
// import HomeIcon from '@mui/icons-material/Home';
// import PersonIcon from '@mui/icons-material/Person';
// import LogoutIcon from '@mui/icons-material/Logout';

// const Layout = () => {
//   const navigate = useNavigate();
//   const user = JSON.parse(sessionStorage.getItem('User') || 'null');

//   const handleLogout = () => {
//     sessionStorage.removeItem('User');
//     navigate('/home');
//   };

//   return (
//     <div>
//       <AppBar
//         position="sticky"
//         color="default"
//         elevation={3}
//         sx={{
//           backgroundColor: 'background.paper',
//           py: 0.5,
//           height: 70,
//         }}
//       >
//         <Container maxWidth="xl" sx={{ height: '100%' }}>
//           <Toolbar
//             disableGutters
//             sx={{
//               justifyContent: 'space-between',
//               height: '100%',
//               minHeight: '100% !important',
//               alignItems: 'center',
//               px: 2,
//               flexDirection: 'row-reverse', // משנה את סדר האלמנטים: כפתורים בצד ימין, לוגו בשמאל
//             }}
//           >
//             {/* Right side: Buttons and Avatar */}
//             {!user ? (
//               <Button
//                 component={Link}
//                 to="/login"
//                 variant="contained"
//                 disableElevation
//                 sx={{
//                   borderRadius: '50px',
//                   px: 3,
//                   py: 1,
//                   backgroundColor: '#1976D2',
//                   boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//                   transition: 'all 0.3s ease',
//                   '&:hover': {
//                     transform: 'translateY(-3px)',
//                     boxShadow: '0 6px 12px rgba(0, 0, 0, 0.25)',
//                     backgroundColor: '#1565C0',
//                   },
//                 }}
//               >
//                 כניסה לאזור האישי
//               </Button>
//             ) : (
//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
//                 {/* Navigation Links */}
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
//                   <Box
//                     component={Link}
//                     to="/home"
//                     sx={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 1,
//                       px: 3,
//                       py: 2,
//                       textDecoration: 'none',
//                       color: '#1976D2',
//                       borderLeft: '3px solid #1976D2',
//                       height: '40px',
//                       '&:hover': {
//                         backgroundColor: 'rgba(25, 118, 210, 0.05)',
//                         color: '#1565C0',
//                       },
//                       transition: 'all 0.2s ease',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     <HomeIcon sx={{ fontSize: 20 }} />
//                     <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                       עמוד בית
//                     </Typography>
//                   </Box>

//                   <Box
//                     component={Link}
//                     to="/personal"
//                     sx={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 1,
//                       px: 3,
//                       py: 2,
//                       textDecoration: 'none',
//                       color: '#1976D2',
//                       borderLeft: '3px solid #1976D2',
//                       height: '40px',
//                       '&:hover': {
//                         backgroundColor: 'rgba(25, 118, 210, 0.05)',
//                         color: '#1565C0',
//                       },
//                       transition: 'all 0.2s ease',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     <PersonIcon sx={{ fontSize: 20 }} />
//                     <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                       אזור אישי
//                     </Typography>
//                   </Box>

//                   <Box
//                     onClick={handleLogout}
//                     sx={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 1,
//                       px: 3,
//                       py: 2,
//                       color: '#f44336',
//                       borderLeft: '3px solid #1976D2',
//                       height: '40px',
//                       '&:hover': {
//                         backgroundColor: 'rgba(244, 67, 54, 0.05)',
//                         color: '#d32f2f',
//                       },
//                       transition: 'all 0.2s ease',
//                       cursor: 'pointer',
//                     }}
//                   >
//                     <LogoutIcon sx={{ fontSize: 20 }} />
//                     <Typography variant="body2" sx={{ fontWeight: 500 }}>
//                       התנתקות
//                     </Typography>
//                   </Box>
//                 </Box>

//                 {/* Avatar Section */}
//                 <Box sx={{ display: 'flex', alignItems: 'center', pl: 3 }}>
//                   <NameAvatar name={user.firstName} />
//                 </Box>
//               </Box>
//             )}

//             {/* Left side: Logo */}
//             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//               <img
//                 src="/StudyStraemLogo.png"
//                 alt="Company Logo"
//                 style={{
//                   height: 70,
//                   width: 110,
//                   marginLeft: 16,
//                   marginTop: 10,
//                 }}
//               />
//             </Box>
//           </Toolbar>
//         </Container>
//       </AppBar>

//       <Outlet />
//     </div>
//   );
// };

// export default Layout;
import { AppBar, Toolbar, Button, Box, Container, Typography } from '@mui/material';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { NameAvatar } from './Auth/Avatar';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

const Layout = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('User') || 'null');

  const handleLogout = () => {
    sessionStorage.removeItem('User');
    navigate('/home');
  };

  return (
    <div>
      <AppBar
        position="sticky"
        color="default"
        elevation={3}
        sx={{
          backgroundColor: 'background.paper',
          py: 0.5,
          height: 70,
        }}
      >
        <Container maxWidth="xl" sx={{ height: '100%' }}>
          <Toolbar
            disableGutters
            sx={{
              justifyContent: 'space-between',
              height: '100%',
              minHeight: '100% !important',
              alignItems: 'center',
              px: 2,
              flexDirection: 'row-reverse', // משנה את סדר האלמנטים: כפתורים בצד ימין, לוגו בשמאל
            }}
          >
            {/* Right side: Buttons and Avatar */}
            {!user ? (
              <Button
                component={Link}
                to="/login"
                variant="contained"
                disableElevation
                sx={{
                  borderRadius: '50px',
                  px: 3,
                  py: 1,
                  backgroundColor: '#1976D2',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.25)',
                    backgroundColor: '#1565C0',
                  },
                }}
              >
                כניסה לאזור האישי
              </Button>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {/* Navigation Links */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <Box
                    component={Link}
                    to="/home"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 3,
                      py: 2,
                      textDecoration: 'none',
                      color: '#1976D2',
                      height: '40px',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.05)',
                        color: '#1565C0',
                      },
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <HomeIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      עמוד בית
                    </Typography>
                  </Box>

                  <Box
                    component={Link}
                    to="/personal"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 3,
                      py: 2,
                      textDecoration: 'none',
                      color: '#1976D2',
                      borderLeft: '3px solid #1976D2',
                      height: '40px',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.05)',
                        color: '#1565C0',
                      },
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      אזור אישי
                    </Typography>
                  </Box>

                  <Box
                    onClick={handleLogout}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 3,
                      py: 2,
                      color: '#1976D2',
                      borderLeft: '3px solid #1976D2',
                      height: '40px',
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.05)',
                        color: '#1565C0',
                      },
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                  >
                    <LogoutIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      התנתקות
                    </Typography>
                  </Box>
                </Box>

                {/* Avatar Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 3 }}>
                  <NameAvatar name={user.firstName} />
                </Box>
              </Box>
            )}

            {/* Left side: Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src="/StudyStraemLogo.png"
                alt="Company Logo"
                style={{
                  height: 70,
                  width: 110,
                  marginLeft: 16,
                  marginTop: 10,
                }}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Outlet />
    </div>
  );
};

export default Layout;