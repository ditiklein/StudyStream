import  { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, TextField,Typography,Container, CircularProgress,FormHelperText,Paper,Grid,InputAdornment, Link, IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, Rootstore } from '../FileAndFolderStore/FileStore';
import { register } from '../FileAndFolderStore/authSlice';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {  loading, error } = useSelector((state: Rootstore) => state.auth);
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleName: 'user'
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // מצב הצגת הסיסמה

  // פונקציה להחלפת מצב הצגת הסיסמה
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value
    });
    setFormError(null);
  };

  // פונקציה לחילוץ מסר השגיאה
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
    return "אירעה שגיאה לא צפויה";
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newUser.firstName || !newUser.lastName || !newUser.email || !newUser.password) {
      setFormError("יש למלא את כל השדות.");
      return;
    }

    try {
      const resultAction = await dispatch(register(newUser));
      console.log("resultAction", resultAction);
      
      if (register.fulfilled.match(resultAction)) {
        sessionStorage.setItem('token', resultAction.payload.token || '');
        sessionStorage.setItem('User', JSON.stringify(resultAction.payload.user));
        navigate("/personal");
      } else {
        // אם ההרשמה נכשלה
        const errorMessage = getErrorMessage(resultAction.payload || resultAction.error);
        setFormError(errorMessage);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setFormError("שגיאה בהרשמה, אנא נסה שוב.");
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      direction: 'rtl',
      overflow: 'hidden'
    }}>
      <Grid container sx={{ height: '100vh' }}>
        {/* תמונה בצד שמאל */}
        <Grid item xs={12} md={6} sx={{
          backgroundImage: 'url(/d.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          order: { xs: 2, md: 1 }
        }}></Grid>

        {/* טופס בצד ימין */}
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
                variant="h3" 
                component="div" 
                align="center" 
                sx={{ 
                  fontWeight: 'bold',
                  direction: "ltr", 
                  color: 'transparent',
                  textShadow: '0 0 15px rgba(255,255,255,0.7), 0 0 30px rgba(255,255,255,0.5)',
                  WebkitTextStroke: '1px white', 
                  mb: 2,
                  lineHeight: 1.2,
                  fontSize: {
                    xs: '1.8rem',
                    sm: '2.2rem',
                    md: '2.8rem',
                    lg: '3.5rem'
                  }
                }}
              >
                כיף שבאת<br />אורח.ת!
              </Typography>
              
              <Typography variant="h5" component="h1" mb={1} sx={{ color: 'white', direction: 'ltr' }}>
                מוכנים להצטרף אלינו?
              </Typography>
              
              <Paper elevation={0} sx={{ width: '100%', p: 2, bgcolor: 'transparent', pt: 1 }}>
                <form onSubmit={handleRegister}>
                  <StyledTextField 
                    fullWidth 
                    name="firstName" 
                    placeholder="שם פרטי*" 
                    variant="outlined" 
                    margin="dense" 
                    value={newUser.firstName}    
                    onChange={handleChange} 
                    sx={{ mb: 1 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: 'white' }} />
                        </InputAdornment>
                      ),
                    }}
                    error={!!formError}
                  />
                  
                  <StyledTextField 
                    fullWidth 
                    name="lastName" 
                    placeholder="שם משפחה*" 
                    variant="outlined" 
                    margin="dense" 
                    value={newUser.lastName}    
                    onChange={handleChange} 
                    sx={{ mb: 1 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: 'white' }} />
                        </InputAdornment>
                      ),
                    }}
                    error={!!formError}
                  />
                  
                  <StyledTextField 
                    fullWidth 
                    name="email" 
                    placeholder="אימייל*" 
                    variant="outlined" 
                    margin="dense" 
                    value={newUser.email}    
                    onChange={handleChange} 
                    sx={{ mb: 1 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'white' }} />
                        </InputAdornment>
                      ),
                    }}
                    error={!!formError}
                  />
                  
                  <StyledTextField 
                    fullWidth  
                    name="password" 
                    type={showPassword ? 'text' : 'password'}  // החלפת סוג הקלט בהתאם למצב
                    placeholder="סיסמה*"  
                    variant="outlined" 
                    margin="dense"  
                    value={newUser.password} 
                    onChange={handleChange}  
                    sx={{ mb: 1 }} 
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton
                            onClick={handleTogglePasswordVisibility}
                            edge="start"
                            sx={{ color: 'white' }}
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    error={!!formError}
                  />
                  
                  {(formError || error) && (
                    <FormHelperText error sx={{ mb: 1, color: '#ffcdd2' }}>
                      {formError || getErrorMessage(error)}
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
                      mb: 2,
                      '&:hover': { 
                        bgcolor: '#E03070' 
                      } 
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'הרשמה'}
                  </Button>

                  {/* קישור להתחברות */}
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                                             <Link
                        component="button"
                        type="button"
                        onClick={handleLoginClick}
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
                        הכנס עכשיו
                      </Link>

                     {'  ' }?אתה מחובר{' '}
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

export default Register;