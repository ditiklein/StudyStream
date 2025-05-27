import {  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,Box,
  Alert,AlertTitle
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { Lesson } from "../../Modles/File";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedLesson?: Lesson | null;
}

const NoTranscriptDialog: React.FC<Props> = ({ open, onClose, selectedLesson }) => {
  const navigate = useNavigate();

  const handleNavigateToTranscript = () => {
    onClose();
    navigate('/transcription', { 
      state: { 
        selectedRecording: selectedLesson 
      } 
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 3,
          maxWidth: '480px',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
        }
      }}
    >
      <DialogTitle sx={{ pb: 2, pt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #4361ee 0%, #7209b7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <MicIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
          <Typography variant="h5" fontWeight="bold" textAlign="center" sx={{ color: '#1a237e' }}>
     חסר תמלול
          </Typography>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ px: 3 }}>
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3, 
            borderRadius: 2,
            border: '1px solid #e3f2fd',
            backgroundColor: '#f8fcff',
            '& .MuiAlert-icon': {
              color: '#1976d2'
            }
          }}
        >
          <AlertTitle sx={{ fontWeight: 'bold', color: '#1565c0' }}>
            אין תמלול עבור שיעור זה
          </AlertTitle>
          כדי ליהנות מפיצ'רי הסיכום ונקודות חשובות, נדרש תמלול של השיעור
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2, color: '#424242', lineHeight: 1.6 }}>
            השיעור שלך מוכן לתמלול! לאחר התמלול תוכל ליהנות מ:
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AutoAwesomeIcon sx={{ color: '#4361ee', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#424242' }}>
                סיכום אוטומטי של תוכן השיעור
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AutoAwesomeIcon sx={{ color: '#4361ee', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#424242' }}>
                חילוץ נקודות חשובות מהשיעור
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AutoAwesomeIcon sx={{ color: '#4361ee', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#424242' }}>
                חיפוש וניתוח תוכן מתקדם
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 1, gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          color="primary"
          sx={{ 
            borderRadius: 2,
            px: 3,
            py: 1,
            border: '2px solid #e0e0e0',
            color: '#757575',
            '&:hover': {
              border: '2px solid #bdbdbd',
              bgcolor: '#f5f5f5'
            }
          }}
        >
          אולי מאוחר יותר
        </Button>
        <Button 
          onClick={handleNavigateToTranscript} 
          variant="contained"
          sx={{ 
            borderRadius: 2,
            px: 4,
            py: 1.2,
            background: 'linear-gradient(135deg, #4361ee 0%, #7209b7 100%)',
            boxShadow: '0 4px 15px rgba(67, 97, 238, 0.3)',
            fontSize: '1rem',
            fontWeight: 'bold',
            '&:hover': {
              background: 'linear-gradient(135deg, #3651d4 0%, #6108a3 100%)',
              boxShadow: '0 6px 20px rgba(67, 97, 238, 0.4)',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
          endIcon={<ArrowBackIcon />}
        >
          בואו נתמלל!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoTranscriptDialog;