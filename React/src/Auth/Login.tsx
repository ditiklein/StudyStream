import  { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {  Box, Button,  TextField,  Typography,  Container,  CircularProgress, Paper, Grid,InputAdornment, FormHelperText, Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, Rootstore } from '../component/FileAndFolderStore/FileStore';
import { login } from '../component/FileAndFolderStore/authSlice';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

// Custom styled components
const primaryColor = '#001F4D'; // צבע כחול כהה
const pinkColor = '#FF4081'; // צבע ורוד לכפתור התחברות

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    '&:hover fieldset': {
      borderColor: 'white',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'white',
    },
  },
  '& .MuiInputBase-input': {
    color: 'white',
  },
  '& .MuiInputLabel-root': {
    color: 'white',
  },
  '& .MuiOutlinedInput-root:hover': {
    '& > fieldset': {
      borderColor: 'white',
    }
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: 'white',
  },
});

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {token, loading, error } = useSelector((state: Rootstore) => state.auth);
  const navigate = useNavigate();
  sessionStorage.setItem('token',token||'') ;
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // פונקציה לחילוץ מסר השגיאה - זהה לזו שברג'יסטר
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object') {
      // אם יש response data עם message
      if (error.response?.data?.message) {
        return error.response.data.message;
      }
      // אם יש message רגיל
      if (error.message) {
        return error.message;
      }
      // אם זה אובייקט עם מאפיין message אחר
      if (error.data?.message) {
        return error.data.message;
      }
    }
    return "שגיאה בהתחברות, אנא נסה שוב.";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    setErrorMessage(null);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!credentials.email || !credentials.password) {
      setErrorMessage("יש להזין אימייל וסיסמה.");
      return;
    }
  
    try {
      const resultAction = await dispatch(login(credentials));
    
      if (login.fulfilled.match(resultAction)) {
        sessionStorage.setItem('User', JSON.stringify(resultAction.payload.user));
        navigate("/personal");
      } else {
        // אם ההתחברות נכשלה - מטפלים בהודעת השגיאה
        const errorMessage = getErrorMessage(resultAction.payload || resultAction.error || error);
        setErrorMessage(errorMessage);
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("שגיאה בהתחברות, אנא נסה שוב.");
    }
  };

  const handleRegisterClick = () => {
    navigate("/register"); // או הנתיב שלך לדף ההרשמה
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      direction: 'rtl' 
    }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        {/* התמונה - צד שמאל */}
        <Grid item xs={12} md={6} sx={{
          backgroundImage: 'url(/d.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          order: { xs: 2, md: 1 }
        }}></Grid>

        {/* הטופס - צד ימין */}
        <Grid item xs={12} md={6} sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          p: 4,
          bgcolor: primaryColor, 
          color: 'white',
          order: { xs: 1, md: 2 }
        }}>
          <Container maxWidth="sm">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography 
                variant="h2" 
                component="div" 
                align="center" 
                sx={{ 
                  fontWeight: 'bold',
                  color: 'transparent',
                  textShadow: '0 0 15px rgba(255,255,255,0.7), 0 0 30px rgba(255,255,255,0.5)',
                  WebkitTextStroke: '2px white', 
                  mb: 4,
                  direction:'ltr',
                  lineHeight: 1.1,
                  fontSize: {
                    xs: '2.5rem',  // Smaller screens
                    sm: '3rem',    // Small screens
                    md: '4rem',    // Medium screens
                    lg: '5rem'     // Large screens
                  }
                }}
              >
                כמה טוב<br />שבאת!
              </Typography>
              
              <Typography variant="h4" component="h1" mb={4} sx={{ color: 'white' }}>
                התחברות לאזור האישי
              </Typography>
              
              <Paper elevation={0} sx={{ width: '100%', p: 2, bgcolor: 'transparent' }}>
                <form onSubmit={handleLogin}>
                  <StyledTextField 
                    fullWidth 
                    name="email" 
                    placeholder="אימייל*" 
                    variant="outlined" 
                    margin="normal" 
                    value={credentials.email}    
                    onChange={handleChange} 
                    sx={{ mb: 2 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'white' }} />
                        </InputAdornment>
                      ),
                    }}
                    error={!!errorMessage}
                  />
                  
                  <StyledTextField 
                    fullWidth  
                    name="password" 
                    type="password"  
                    placeholder="סיסמה*"  
                    variant="outlined" 
                    margin="normal"  
                    value={credentials.password} 
                    onChange={handleChange}  
                    sx={{ mb: 2 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'white' }} />
                        </InputAdornment>
                      ),
                    }}
                    error={!!errorMessage}
                  />
                  
                  {(errorMessage || error) && (
                    <FormHelperText error sx={{ mb: 2, color: '#ffcdd2' }}>
                      {errorMessage || getErrorMessage(error)}
                    </FormHelperText>
                  )}
                  
                  <Button  
                    type="submit" 
                    fullWidth 
                    variant="contained" 
                    disabled={loading} 
                    sx={{   
                      bgcolor: pinkColor, 
                      py: 1.5, 
                      mb: 3,
                      '&:hover': { 
                        bgcolor: '#E03070' 
                      } 
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'התחברות'}
                  </Button>

                  {/* קישור להרשמה */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                       <Link
                        component="button"
                        type="button"
                        onClick={handleRegisterClick}
                        sx={{
                          color: 'white',
                          textDecoration: 'underline',
                          fontSize: 'inherit',
                          cursor: 'pointer',
                          '&:hover': {
                            color: '#E3F2FD',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        הירשם עכשיו
                      </Link>
                    {'  '}  ?אין לך חשבון{' '}
                     
                    </Typography>
                  </Box>

                </form>
              </Paper>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;