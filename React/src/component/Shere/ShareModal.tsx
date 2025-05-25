import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Typography, Box } from "@mui/material";
import { useState } from "react";

interface ShareLessonDialogProps {
  open: boolean;
  onClose: () => void;
  onShare: (email: string, isPublic: boolean) => void;
}

const ShareLessonDialog = ({ open, onClose, onShare }: ShareLessonDialogProps) => {
  const [email, setEmail] = useState("");
  const [shareType, setShareType] = useState("restricted"); // "restricted" or "public"

  const handleShare = () => {
    if (email) {
      onShare(email, shareType === "public");
      setEmail("");
      setShareType("restricted");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>שיתוף שיעור</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 1 }}>
          <TextField
            fullWidth
            label="כתובת מייל"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="dense"
            placeholder="הזן כתובת מייל"
          />
        </Box>
        
        <FormControl component="fieldset">
          <Typography variant="subtitle2" gutterBottom>סוג השיתוף:</Typography>
          <RadioGroup
            value={shareType}
            onChange={(e) => setShareType(e.target.value)}
          >
            <FormControlLabel 
              value="restricted" 
              control={<Radio />} 
              label={
                <Box>
                  <Typography variant="body1">הגבלת גישה</Typography>
                  <Typography variant="body2" color="text.secondary">
                    רק המשתמש עם כתובת המייל הזו יוכל לצפות בשיעור. אם המשתמש ישתף את הקישור, יידרש אישור נוסף ממך.
                  </Typography>
                </Box>
              } 
            />
            <FormControlLabel 
              value="public" 
              control={<Radio />} 
              label={
                <Box>
                  <Typography variant="body1">שיתוף ציבורי</Typography>
                  <Typography variant="body2" color="text.secondary">
                    כל מי שיש לו את הקישור יוכל לצפות בשיעור ללא צורך באישור נוסף.
                  </Typography>
                </Box>
              } 
            />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button 
          onClick={handleShare} 
          variant="contained" 
          disabled={!email.trim()}
        >
          שתף
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareLessonDialog;
