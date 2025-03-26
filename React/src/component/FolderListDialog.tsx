import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from './FileAndFolderStore/FileStore';
import { fetchRootFolders, fetchSubFoldersAndFiles, selectFoldersAndFiles, updateFile, updateFolder } from './FileAndFolderStore/FilesSlice';

const TransferFileDialog = ({ 
  open, 
  onClose, 
  file, 
  folder, 
  currentFolder 
}: { 
  open: boolean, 
  onClose: () => void, 
  file?: any, 
  folder?: any, 
  currentFolder: number | null 
}) => {
  const [selectedFolder, setSelectedFolder] = useState<number|null>(null);
  const dispatch = useDispatch<AppDispatch>();
//   const dispatch1 = useDispatch();

  const { folders } = useSelector(selectFoldersAndFiles);
  const storedUser = sessionStorage.getItem('User');
  const user = storedUser ? JSON.parse(storedUser) : null;
//   const { allUserFolders } = useSelector(selectFoldersAndFiles);
//   useEffect(() => {
//     dispatch1(fetchUserFolders(user.id));  // שליפה של הקבצים
//   }, [dispatch1, user.id]);

  const handleFolderClick = (folderId: number) => {
    setSelectedFolder(folderId);
  };

  const handleTransfer = async () => {
    if (!selectedFolder) return;
    
    try {
      if (file) {
        await dispatch(updateFile({
          id: file.id,
          lessonName: file.lessonName,
          folderId: selectedFolder,
          ownerId: user.id,
          fileType: file.fileType,
          url: file.url
        }));
      } else if (folder) {
        await dispatch(updateFolder({
          id: folder.id,
          name: folder.name,
          ownerId: user.id,
          parentFolderId: selectedFolder
        }));
      }

      // Refresh the current view based on the current folder context
      if (currentFolder === null) {
        dispatch(fetchRootFolders(user.id));
      } else {
        dispatch(fetchSubFoldersAndFiles({ 
          parentFolderId: currentFolder, 
          ownerId: user.id 
        }));
      }

      onClose();
    } catch (error) {
      console.error('Transfer failed:', error);
    }
  };
            
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDialog-paper': {
          minWidth: 450,
          maxWidth: 550,
          direction: 'rtl',
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
        העברת קובץ או תיקייה
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
              {file ? file.lessonName : folder.name}
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
            {folders.map((folder) => (
                <ListItem key={folder.id} sx={{ padding: '6px 16px' }}>
  <Button
    fullWidth
    onClick={() => handleFolderClick(folder.id)}
    sx={{
      justifyContent: 'flex-start',
      textAlign: 'right',
      bgcolor: selectedFolder === folder.id ? '#e6f7ff' : 'transparent',
      '&:hover': { bgcolor: selectedFolder === folder.id ? '#d6f0ff' : '#f0f0f0' }
    }}
  >
    <ListItemIcon sx={{ color: '#f5c242', minWidth: 40 }}>
      <FolderIcon />
    </ListItemIcon>
    <ListItemText primary={folder.name} />
  </Button>
</ListItem>

            ))}
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
          disabled={!selectedFolder}
        >
          העבר
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferFileDialog;
