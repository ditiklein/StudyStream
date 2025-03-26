import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  CircularProgress,
  Paper,
  Grid,
  InputAdornment
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, Rootstore } from '../component/FileAndFolderStore/FileStore';
import { login } from '../component/FileAndFolderStore/authSlice';
import ErrorAlert from '../Eror';
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
  const { loading, error } = useSelector((state: Rootstore) => state.auth);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  // const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
  
    const resultAction = await dispatch(login(credentials));
  
    if (login.fulfilled.match(resultAction)) {
      sessionStorage.setItem('User', JSON.stringify(resultAction.payload.user));
      navigate("/personal");
    } else if (login.rejected.match(resultAction)) {
      setErrorMessage(error || "שגיאה בהתחברות, אנא נסה שוב.");
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      direction: 'rtl' 
    }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        <Grid item xs={12} md={6} sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          p: 4,
          bgcolor: primaryColor, 
          color: 'white'
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
                  direction:'rtl',
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
                {errorMessage && <ErrorAlert error={errorMessage} onClose={() => setErrorMessage(null)} />}
                
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
                    sx={{ mb: 3 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'white' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  
                  <Button  
                    type="submit" 
                    fullWidth 
                    variant="contained" 
                    disabled={loading} 
                    sx={{   
                      bgcolor: pinkColor, 
                      py: 1.5, 
                      '&:hover': { 
                        bgcolor: '#E03070' 
                      } 
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'התחברות'}
                  </Button>
                </form>
              </Paper>
            </Box>
          </Container>
        </Grid>

        <Grid item xs={12} md={6} sx={{
          backgroundImage: 'url(/d.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}></Grid>
      </Grid>
    </Box>
  );
};

export default Login;
