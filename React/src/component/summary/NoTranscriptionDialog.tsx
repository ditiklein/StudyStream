import {  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography,Box,
  Alert,AlertTitle
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";
import { Lesson } from "../../Modles/File";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedLesson?: Lesson | null; // הוספת המידע על השיעור הנבחר
}

const NoTranscriptDialog: React.FC<Props> = ({ open, onClose, selectedLesson }) => {
  const navigate = useNavigate();

  const handleNavigateToTranscript = () => {
    onClose(); // סוגר את הדיאלוג
    
    // העברת מידע על השיעור הנבחר דרך state
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
        borderRadius: 2,
        maxWidth: '400px'
      }
    }}
  >
    <DialogTitle sx={{ pb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <ErrorOutlineIcon color="warning" sx={{ mr: 1 }} />
        <Typography variant="h6" fontWeight="bold">לא נמצא תמלול</Typography>
      </Box>
    </DialogTitle>
    <DialogContent>
      <Alert severity="warning" sx={{ mb: 2 }}>
        <AlertTitle>שגיאה בטעינת תמלול</AlertTitle>
        אין תמלול זמין עבור שיעור זה.
      </Alert>
      <Typography variant="body2">
        יש לבצע תמלול תחילה על מנת להשתמש בפיצ'רים של סיכום ונקודות חשובות.
        צור קשר עם מנהל המערכת אם אתה מאמין שזו שגיאה.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
      <Button 
        onClick={onClose} 
        variant="outlined"
        color="primary"
        sx={{ borderRadius: 2 }}
      >
        הבנתי
      </Button>
      <Button 
        onClick={handleNavigateToTranscript} 
        variant="contained"
        color="primary"
        sx={{ borderRadius: 2 }}
      >
        מעבר לעמוד התמלול
      </Button>
    </DialogActions>
  </Dialog>
  );
};

export default NoTranscriptDialog;