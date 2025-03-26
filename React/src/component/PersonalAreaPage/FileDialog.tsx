import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Typography } from "@mui/material";
import FilePreview from "./FilePerview";

interface FileDialogProps {
  open: boolean;
  files: File[];
  onClose: () => void;
  onConfirm: (files: File[], confirmed: boolean) => void;
  uploadProgress: number;
}

const FileDialog: React.FC<FileDialogProps> = ({ open, files, onClose, onConfirm, uploadProgress }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth dir="rtl">
      <DialogTitle>אישור העלאת קבצים</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          הקבצים הבאים נבחרו להעלאה:
        </Typography>
        <FilePreview
          files={files}
          onRemove={(index) => {
            const newFiles = [...files];
            newFiles.splice(index, 1);
            onConfirm(newFiles, false);
          }}
        />

        {uploadProgress > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              מתבצעת העלאה: {uploadProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 1 }} />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          ביטול
        </Button>
        <Button 
          onClick={() => onConfirm(files, true)} 
          variant="contained" 
          color="primary"
          disabled={files.length === 0 || uploadProgress > 0}
        >
          {uploadProgress > 0 ? 'מעלה...' : 'העלאה'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileDialog;
