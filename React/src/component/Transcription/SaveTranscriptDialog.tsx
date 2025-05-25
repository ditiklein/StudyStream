import { 
    Button, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    CircularProgress
  } from '@mui/material';
  import { FC, useState, useEffect } from 'react';


  interface SaveTranscriptDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (transcriptName: string) => Promise<void>;
    isLoading?: boolean;
    defaultName?: string;
  }


  
  const SaveTranscriptDialog: FC<SaveTranscriptDialogProps> = ({
    open,
    onClose,
    onSave,
    isLoading = false,
    defaultName = ''
  }) => {
    const [transcriptName, setTranscriptName] = useState(defaultName || '');
  
    // איפוס הטופס בעת פתיחת הדיאלוג
    useEffect(() => {
      if (open) {
        setTranscriptName(defaultName || '');
      }
    }, [open, defaultName]);
  
    const handleSave = async () => {
      if (transcriptName.trim()) {
        await onSave(transcriptName);
      }
    };
  
    return (
      <Dialog 
        open={open} 
        onClose={() => !isLoading && onClose()}
        dir="rtl"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>שמירת תמלול</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            אנא הזן שם לתמלול שברצונך לשמור:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="transcriptName"
            label="שם התמלול"
            type="text"
            fullWidth
            variant="outlined"
            value={transcriptName}
            onChange={(e) => setTranscriptName(e.target.value)}
            disabled={isLoading}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={onClose} 
            disabled={isLoading}
          >
            ביטול
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            disabled={isLoading || !transcriptName.trim()}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? 'שומר...' : 'שמור תמלול'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }  
  export default SaveTranscriptDialog