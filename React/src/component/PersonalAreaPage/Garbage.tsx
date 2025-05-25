import  { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  IconButton, 
  Typography, 
  Box, 
} from '@mui/material';
import { 
  DeleteForever as DeleteForeverIcon, 
  RestoreFromTrash as RestoreIcon, 
  MicNone as MicIcon 
} from '@mui/icons-material';
import axios from 'axios';
import { keyframes } from '@emotion/react';
import { fetchRootFolders, fetchSubFoldersAndFiles, hardDeleteFile, updateFile } from '../FileAndFolderStore/FilesSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../FileAndFolderStore/FileStore';
import api from '../FileAndFolderStore/Api';

// אנימציה של הצצה
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

interface RecycleBinDialogProps {
  open: boolean;
  onClose: () => void;
  currentFolderId: number | null;
}

const RecycleBinDialog: React.FC<RecycleBinDialogProps> = ({ 
  open, 
  onClose, 
  currentFolderId 
}) => {
  const [recordings, setRecordings] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  // שמירה על המשתמש ב-useMemo כדי להימנע מהרינדור אינסופי
  const storedUser = useMemo(() => sessionStorage.getItem('User'), []);
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchDeletedLessons = useCallback(async () => {
    if (!user) return; // אם אין משתמש, אין צורך להמשיך

    try {
      const response = await axios.get(`http://localhost:5220/api/Lesson/deleted/${user.id}`);
      if (response.data) {
        setRecordings(response.data);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.log("לא נמצאו הקלטות");
      }
      console.error("Error fetching deleted lessons:", error);
    }
  }, [user]);

  useEffect(() => {
    if (open) {
      fetchDeletedLessons(); // רק כאשר הדיאלוג נפתח
    }
  },);

  const handleRestore = async (file: any) => {
    try {
      await dispatch(updateFile({
        id: file.id, 
        lessonName: file.lessonName,
        folderId: currentFolderId, 
        ownerId: user.id,
        fileType: file.fileType, 
        url: file.url,
        isDeleted: false
      })).unwrap();

      if (currentFolderId === null) {
        await dispatch(fetchRootFolders(user?.id)).unwrap();
      } else {
        await dispatch(fetchSubFoldersAndFiles({ 
          parentFolderId: currentFolderId, 
          ownerId: user?.id 
        })).unwrap();
      }

      await fetchDeletedLessons(); // עדכון הנתונים אחרי שחזור

      onClose(); // סגירת הדיאלוג לאחר פעולה
    } catch (error) {
      console.error("Error restoring file:", error);
    }
  };

  const handlePermanentDelete = async (file: any) => {
    try {
      // קריאת API למחיקת הקובץ מ-S3
      await api.delete(`upload/delete/${file.lessonName}`);
      console.log(`File ${file.lessonName} deleted from S3 successfully`);
      
      await dispatch(hardDeleteFile(file.id));
      onClose(); // סגירת הדיאלוג לאחר מחיקה
    } catch (error) {
      console.error("Error deleting lesson permanently:", error);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      sx={{
        animation: `${fadeIn} 0.5s ease-in-out`,
      }}
    >
      <DialogTitle sx={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        fontWeight: 700,
        color: 'primary.main',
        paddingBottom: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <RestoreIcon sx={{ color: 'green', fontSize: 28 }} />
          פח מחזור הקלטות
        </Box>
        <Typography variant="body2" color="text.secondary">
          {recordings.length} הקלטות נמחקו
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {recordings.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: 300, 
            opacity: 0.7 
          }}>
            <MicIcon sx={{ fontSize: 80, color: 'primary.main' }} />
            <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
              אין הקלטות בפח המחזור
            </Typography>
          </Box>
        ) : (
          <List>
            {recordings.map((recording) => (
              <Box 
                key={recording.id}
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: 2,
                  mb: 1,
                  padding: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <ListItem>
                  <ListItemIcon>
                    <MicIcon sx={{ color: 'primary.main' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={recording.name} 
                    secondary={`נמחק ב-${new Date(recording.deletedAt).toLocaleString()}`} 
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleRestore(recording)}
                      title="שחזר"
                      sx={{ '&:hover': { color: 'green' } }}
                    >
                      <RestoreIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handlePermanentDelete(recording)}
                      title="מחק לצמיתות"
                      sx={{ '&:hover': { color: 'darkred' } }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecycleBinDialog;
