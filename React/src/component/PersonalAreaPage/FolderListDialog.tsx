import { useEffect, useState } from 'react';
import {Dialog,DialogTitle, DialogContent, DialogActions, Button, List,
  ListItem, ListItemIcon, ListItemText, Box,Typography, CircularProgress,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../FileAndFolderStore/FileStore';
import { fetchRootFolders, fetchSubFoldersAndFiles, updateFile, updateFolder } from '../FileAndFolderStore/FilesSlice';
import api from '../FileAndFolderStore/Api';
import { Lesson } from '../../Modles/File';
import { Folder } from '../../Modles/Folder';

interface TransferFileDialogProps {
  open: boolean;
  onClose: () => void;
  file?: Lesson|null;
  folder?: Folder;
  currentFolder: number | null;
}

const TransferFileDialog = ({ 
  open, 
  onClose, 
  file, 
  folder, 
  currentFolder 
}: TransferFileDialogProps) => {
  const [selectedFolder, setSelectedFolder] = useState<number|null>(null);
  const [userFolders, setUserFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const storedUser = sessionStorage.getItem('User');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const fetchUserFoldersFromAPI = async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      console.log('שולף תיקיות עבור משתמש:', userId);
      
      const response = await api.get(`/Folder/folders/${userId}`);
      console.log('תשובה מהשרת:', response.data);
      
      setUserFolders(response.data || []);
    } catch (error) {
      console.error('שגיאה בשליפת תיקיות:', error);
      setError('שגיאה בטעינת תיקיות');
      setUserFolders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && user?.id) {
      fetchUserFoldersFromAPI(user.id);
    } else {
      setUserFolders([]);
      setSelectedFolder(null);
      setError(null);
    }
  }, [open, user?.id]);

  const filteredFolders = userFolders.filter(f => {
    if (folder) {
      return f.id !== folder.id;
    }
    return true;
  });

  console.log('תיקיות מסוננות:', filteredFolders);

  const handleFolderClick = (folderId: number) => {
    console.log('נבחרה תיקייה:', folderId);
    setSelectedFolder(folderId);
  };

  const handleTransfer = async () => {
    if (!selectedFolder) {
      console.log('לא נבחרה תיקייה');
      return;
    }
    
    console.log('מתחיל העברה לתיקייה:', selectedFolder);
    
    try {
      if (file) {
        console.log('מעביר קובץ:', file);
        await dispatch(updateFile({
          id: file.id,
          lessonName: file.lessonName||'',
          folderId: selectedFolder,
          ownerId: user.id,
          fileType: file.fileType||'',
          url: file.urlName||'',
          isDeleted: file.isDeleted
        }));
      } else if (folder) {
        console.log('מעביר תיקייה:', folder);
        await dispatch(updateFolder({
          id: folder.id,
          name: folder.name||'',
          ownerId: user.id,
          parentFolderId: selectedFolder
        }));
      }

      if (currentFolder === null) {
        dispatch(fetchRootFolders(user.id));
      } else {
        dispatch(fetchSubFoldersAndFiles({ 
          parentFolderId: currentFolder, 
          ownerId: user.id 
        }));
      }

      console.log('העברה הושלמה בהצלחה');
      onClose();
    } catch (error) {
      console.error('העברה נכשלה:', error);
    }
  };

  const renderFolderList = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (error) {
      return (
        <ListItem>
          <Typography sx={{ p: 2, color: 'error.main' }}>
            {error}
          </Typography>
        </ListItem>
      );
    }

    if (filteredFolders.length === 0) {
      return (
        <ListItem>
          <Typography sx={{ p: 2, color: 'text.secondary' }}>
            לא נמצאו תיקיות זמינות להעברה
          </Typography>
        </ListItem>
      );
    }

    return filteredFolders.map((folderItem) => (
      <ListItem key={folderItem.id} sx={{ padding: '6px 16px' }}>
        <Button
          fullWidth
          onClick={() => handleFolderClick(folderItem.id)}
          sx={{
            justifyContent: 'flex-end',
            textAlign: 'left',
            bgcolor: selectedFolder === folderItem.id ? '#e6f7ff' : 'transparent',
            '&:hover': { bgcolor: selectedFolder === folderItem.id ? '#d6f0ff' : '#f0f0f0' }
          }}
        >
          <ListItemIcon sx={{ color: '#f5c242', minWidth: 40 }}>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText primary={folderItem.name} />
        </Button>
      </ListItem>
    ));
  };
            
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          minWidth: 450,
          maxWidth: 550,
          direction: 'ltr',
          height: 'auto',
          maxHeight: '85vh'
        }
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#1e88e5',
          color: 'white',
          fontWeight: 'medium',
          padding: '12px 16px'
        }}
      >
        העברת {file ? 'קובץ' : 'תיקייה'}
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Box display="flex" flexDirection="column">
          <Box
            display="flex"
            alignItems="center"
            marginBottom={2.5}
            marginTop={2}
            p={1.5}
            borderRadius={1}
            bgcolor="#f0f7ff"
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {file ? <InsertDriveFileIcon color="primary" /> : <FolderIcon color="primary" />}
            </ListItemIcon>
            <Typography>
              {file ? file.lessonName : folder?.name}
            </Typography>
          </Box>
          <List
            sx={{
              border: '1px solid #e0e0e0',
              borderRadius: 1,
              maxHeight: 250,
              overflow: 'auto'
            }}
          >
            {renderFolderList()}
          </List>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-start', padding: '12px 16px' }}>
        <Button onClick={onClose} color="inherit" sx={{ mr: 1 }}>
          ביטול
        </Button>
        <Button
          onClick={handleTransfer}
          color="primary"
          variant="contained"
          disabled={!selectedFolder || loading}
        >
          העבר
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferFileDialog;