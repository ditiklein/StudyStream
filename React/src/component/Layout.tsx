import { AppBar, Toolbar, Button, Box, Container} from '@mui/material'; 
import { Link, Outlet, useNavigate } from 'react-router-dom'; 
import { NameAvatar } from './Auth/Avatar';  

const Layout = () => {   
  // const theme = useTheme();   
  const navigate = useNavigate();   
  // const isMobile = useMediaQuery(theme.breakpoints.down('md'));      

  // Get user from session storage   
  const user = JSON.parse(sessionStorage.getItem('User') || 'null');    

  // Handle logout function   
  const handleLogout = () => {     
    // Remove user from session storage     
    sessionStorage.removeItem('User');     
    // Redirect to login page     
    navigate('/home');   
  };    

  return (     
    <div>       
      {/* Header */}       
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
              px: 2
            }}
          >             
            {/* Logo Section - Added to the right side */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src="/StudyStraemLogo.png" 
                alt="Company Logo" 
                style={{ 
                  height: 70, 
                  width: 110, 
                  marginRight: 16, 
                  marginTop: 10
                }} 
              />
            </Box>              

            {/* Conditional Rendering Based on User Authentication */}             
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
                    backgroundColor: '#1565C0'                   
                  }                 
                }}               
              >                 
                כניסה לאזור האישי               
              </Button>             
            ) : (               
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>                 
                {/* Logout Button */}                 
                <Button                    
                  variant="outlined"                   
                  color="primary"                   
                  onClick={handleLogout}                   
                  sx={{                      
                    borderRadius: '50px',                     
                    px: 3,                     
                    py: 1,                   
                  }}                 
                >                   
                  התנתקות                 
                </Button>

                {/* Avatar Component */}                 
                <NameAvatar name={user.firstName}/>                  
              </Box>             
            )}           
          </Toolbar>         
        </Container>       
      </AppBar>        

      {/* Outlet */}       
      <Outlet />     
    </div>   
  ); 
};  

export default Layout; 
