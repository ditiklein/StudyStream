import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, CircularProgress 
} from '@mui/material';
import { AppDispatch, Rootstore } from '../FileAndFolderStore/FileStore';
import { addFolder, selectFoldersAndFiles } from '../FileAndFolderStore/FilesSlice';
import User from '../../Modles/User';

interface NewFolderDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Callback להצלחה
  parentFolderId: number | null;
}

const NewFolderDialog: React.FC<NewFolderDialogProps> = ({ 
  open, 
  onClose, 
  onSuccess, 
  parentFolderId 
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [folderName, setFolderName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorr, setError] = useState('');
  const storedUser = sessionStorage.getItem('User');
  const user = storedUser ? JSON.parse(storedUser) : null;
    const { folders, error } = useSelector(selectFoldersAndFiles);

  const handleSubmit = async () => {
    if (!folderName.trim()) {
      setError('אנא הכנס שם תיקייה');
      return;
    }

    // בדיקה אם התיקייה קיימת כבר
    const folderExists = folders.some(folder => 
      folder.name === folderName && folder.parentFolderId === parentFolderId
    );

    if (folderExists) {
      onClose()
      Swal.fire({
        icon: 'error',
        title: 'שגיאה',
        text: 'שם התיקייה כבר קיים!',
        confirmButtonColor: '#d33',
      });
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await dispatch(addFolder({
        name: folderName,
        parentFolderId: parentFolderId,
        ownerId: user.id,
      })).unwrap();

      setFolderName('');
      setIsSubmitting(false);

      Swal.fire({
        icon: 'success',
        title: 'התיקייה נוצרה בהצלחה!',
        timer: 1500,
        showConfirmButton: false,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        onClose();
      }
    } catch (err) {
      setError('שגיאה ביצירת התיקייה');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFolderName('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} dir="rtl">
      <DialogTitle>צור תיקייה חדשה</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="שם התיקייה"
          type="text"
          fullWidth
          variant="outlined"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mt: 1 }}
          inputProps={{ dir: 'rtl' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          ביטול
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'צור תיקייה'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewFolderDialog;
