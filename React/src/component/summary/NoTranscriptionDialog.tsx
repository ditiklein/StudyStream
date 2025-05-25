


import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  Box,
  Alert,
  AlertTitle
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

interface Props {
  open: boolean;
  onClose: () => void;
}

const NoTranscriptDialog: React.FC<Props> = ({ open, onClose }) => (
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
    <DialogActions sx={{ p: 2, pt: 0 }}>
      <Button 
        onClick={onClose} 
        variant="contained"
        color="primary"
        sx={{ borderRadius: 2 }}
      >
        הבנתי
      </Button>
    </DialogActions>
  </Dialog>
);

export default NoTranscriptDialog;