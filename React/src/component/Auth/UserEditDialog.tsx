
import {Dialog,DialogTitle,DialogContent,DialogActions,TextField,Button,Stack,Typography,Box,IconButton,Avatar,Divider,
} from '@mui/material';
import { useState } from 'react';
import User from '../../Modles/User';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../FileAndFolderStore/FileStore';
import { updateUser } from '../FileAndFolderStore/authSlice';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import SaveIcon from '@mui/icons-material/Save';

interface UserEditDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({ open, onClose, user }) => {
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setlastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(user?.email || '');
  const dispatch = useDispatch<AppDispatch>();

  const handleSave = () => {
    if (!user) return;

    const updatedUser = {
      firstName,
      lastName,
      email,
      password: user.password,
    };

    dispatch(updateUser({ id: user.id, data: updatedUser }))
      .unwrap()
      .then(() => {
        sessionStorage.setItem('User', JSON.stringify({ ...user, ...updatedUser }));
        onClose();
      })
      .catch((error: any) => {
        console.error("שגיאה בעדכון המשתמש:", error);
      });
  };

  const getInitials = () => {
    return `${firstName.charAt(0) || user?.firstName?.charAt(0) || ''}${lastName.charAt(0) || user?.lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      dir="rtl"
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          boxShadow: '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.20)',
          overflow: 'visible',
        }
      }}
    >
      {/* Header עם X וכותרת */}
      <DialogTitle 
        sx={{ 
          p: 0,
          position: 'relative',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px 12px 0 0',
        }}
      >
        <Box sx={{ p: 3 }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: 'white',
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Avatar
              sx={{
                width: 60,
                height: 60,
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '3px solid rgba(255,255,255,0.3)',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}
            >
              {getInitials() || <PersonIcon />}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
                עריכת פרטי משתמש
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                עדכן את הפרטים האישיים שלך
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            {/* שדות הטקסט */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                פרטים אישיים
              </Typography>
              <Stack spacing={2.5}>
                <TextField
                  label="שם פרטי"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ color: 'action.active', mr: 1 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                      }
                    }
                  }}
                />
                
                <TextField
                  label="שם משפחה"
                  value={lastName}
                  onChange={(e) => setlastName(e.target.value)}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ color: 'action.active', mr: 1 }} />,
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      },
                      '&.Mui-focused': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                      }
                    }
                  }}
                />
              </Stack>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 600 }}>
                פרטי התקשרות
              </Typography>
              <TextField
                label="כתובת אימייל"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                variant="outlined"
                type="email"
                InputProps={{
                  startAdornment: <EmailIcon sx={{ color: 'action.active', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    },
                    '&.Mui-focused': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                    }
                  }
                }}
              />
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions 
        sx={{ 
          p: 3, 
          pt: 1,
          gap: 1.5,
          justifyContent: 'flex-end',
          backgroundColor: '#fafafa',
          borderRadius: '0 0 12px 12px'
        }}
      >
        <Button 
          onClick={onClose}
          variant="outlined"
          size="large"
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.2,
            borderColor: '#e0e0e0',
            color: '#666',
            '&:hover': {
              borderColor: '#bdbdbd',
              backgroundColor: '#f5f5f5',
              transform: 'translateY(-1px)',
            }
          }}
        >
          ביטול
        </Button>
        
        <Button 
          variant="contained" 
          onClick={handleSave}
          size="large"
          startIcon={<SaveIcon />}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease-in-out',
          }}
        >
          שמור שינויים
        </Button>
      </DialogActions>
    </Dialog>
  );
};