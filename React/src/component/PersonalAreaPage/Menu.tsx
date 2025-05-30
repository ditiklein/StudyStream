
// import * as React from 'react';
// import { useDispatch } from 'react-redux';
// import IconButton from '@mui/material/IconButton';
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import { deleteFolder } from '../FileAndFolderStore/FilesSlice';
// import { AppDispatch } from '../FileAndFolderStore/FileStore';
// import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'; // אייקון של העברה
// import TransferFileDialog from './FolderListDialog';
// import DownloadIcon from '@mui/icons-material/Download';

// const ITEM_HEIGHT = 48;

// interface LongMenuProps {
//   id: number;
//   onEdit?: () => void;
//   folder:any
//   currentFolder:any
// }

// export default function LongMenu({ id, onEdit,folder,currentFolder}: LongMenuProps) {
//   const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
//   const open = Boolean(anchorEl);
//   const dispatch = useDispatch<AppDispatch>();
//   const [openTransferDialog, setOpenTransferDialog] = React.useState(false); // מצב לפתיחת דיאלוג

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     event.stopPropagation();
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };
//   const handleMove = (event: React.MouseEvent) => {
//     event.stopPropagation();

//     handleClose();
//     setOpenTransferDialog(true);

//   };

//   const handleDelete = (event: React.MouseEvent) => {
//     event.stopPropagation();
//     dispatch(deleteFolder(id));
//     handleClose();
//   };
// const handleDownloadZip = (event: React.MouseEvent) => {
//   event.stopPropagation();
//   handleClose();
// };

//   const handleEdit = (event: React.MouseEvent) => {
//     event.stopPropagation();
//     if (onEdit) {
//       onEdit();
//     }
//     handleClose();
//   };

//   return (
//     <div onClick={(e) => e.stopPropagation()}>
//       <IconButton
//         aria-label="more"
//         id="long-button"
//         aria-controls={open ? 'long-menu' : undefined}
//         aria-expanded={open ? 'true' : undefined}
//         aria-haspopup="true"
//         onClick={handleClick}
//         size="small"
//       >
//         <MoreVertIcon />
//       </IconButton>
//       <Menu
//         id="long-menu"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         slotProps={{
//           paper: {
//             style: {
//               maxHeight: ITEM_HEIGHT * 4.5,
//               width: '20ch',
//             },
//           },
//         }}
//       >
//         <MenuItem onClick={handleEdit}>
//           <ListItemIcon><EditIcon /></ListItemIcon>
//           <ListItemText>עריכה</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={handleDelete}>
//           <ListItemIcon><DeleteIcon /></ListItemIcon>
//           <ListItemText>מחיקה</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={handleMove}> {/* עדכון כאן */}
//           <ListItemIcon><DriveFileMoveIcon /></ListItemIcon>
//           <ListItemText>העברה</ListItemText>
//         </MenuItem>
//         <MenuItem onClick={handleDownloadZip}>
//   <ListItemIcon><DownloadIcon /></ListItemIcon>
//   <ListItemText>הורדה כקובץ ZIP</ListItemText>
// </MenuItem>

//       </Menu>
//       <TransferFileDialog open={openTransferDialog} onClose={() => setOpenTransferDialog(false)} folder={folder} file={null} currentFolder={currentFolder}/>

//     </div>
//   );
// }



import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import { AppDispatch, Rootstore } from '../FileAndFolderStore/FileStore';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import TransferFileDialog from './FolderListDialog';
import DownloadIcon from '@mui/icons-material/Download';
import { Snackbar, Alert } from '@mui/material';
import { deleteFolder, downloadFolderAsZip } from '../FileAndFolderStore/FilesSlice';

const ITEM_HEIGHT = 48;

interface LongMenuProps {
  id: number;
  onEdit?: () => void;
  folder: any;
  currentFolder: any;
}

export default function LongMenu({ id, onEdit, folder, currentFolder }: LongMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openTransferDialog, setOpenTransferDialog] = React.useState(false);
  const [downloadingZip, setDownloadingZip] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState<'success' | 'error'>('success');
  
  const open = Boolean(anchorEl);
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector((state: Rootstore) => state.files.error);

  React.useEffect(() => {
    if (error && downloadingZip) {
      setSnackbarMessage(error);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setDownloadingZip(false);
    }
  }, [error, downloadingZip, dispatch]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMove = (event: React.MouseEvent) => {
    event.stopPropagation();
    handleClose();
    setOpenTransferDialog(true);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(deleteFolder(id));
    handleClose();
  };

  const handleDownloadZip = async (event: React.MouseEvent) => {
    event.stopPropagation();
    handleClose();
    
    if (downloadingZip) {
      return; // מונע לחיצות כפולות
    }
    
    setDownloadingZip(true);
    
    try {
      console.log(`🔄 מתחיל הורדת תיקייה: ${folder?.name || 'ללא שם'}`);
      
      const result = await dispatch(downloadFolderAsZip({ 
        folderId: id, 
        folderName: folder?.name 
      })).unwrap();
      console.log(result);
      
      // הודעת הצלחה
      setSnackbarMessage(`תיקייה "${folder?.name || 'ללא שם'}" הורדה בהצלחה כקובץ ZIP`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      console.log('✅ הורדת ZIP הושלמה בהצלחה');
      
    } catch (error: any) {
      console.error('❌ שגיאה בהורדת ZIP:', error);
      
      setSnackbarMessage(error || 'שגיאה בהורדת התיקייה');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onEdit) {
      onEdit();
    }
    handleClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <div onClick={(e) => e.stopPropagation()}>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? 'long-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          size="small"
          disabled={downloadingZip}
        >
          <MoreVertIcon />
        </IconButton>
        
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '20ch',
              },
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon><EditIcon /></ListItemIcon>
            <ListItemText>עריכה</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleDelete}>
            <ListItemIcon><DeleteIcon /></ListItemIcon>
            <ListItemText>מחיקה</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleMove}>
            <ListItemIcon><DriveFileMoveIcon /></ListItemIcon>
            <ListItemText>העברה</ListItemText>
          </MenuItem>
          
          <MenuItem 
            onClick={handleDownloadZip}
            disabled={downloadingZip }
          >
            <ListItemIcon>
              {downloadingZip ? (
                <CircularProgress size={20} />
              ) : (
                <DownloadIcon />
              )}
            </ListItemIcon>
            <ListItemText>
              {downloadingZip ? 'מוריד...' : 'הורדה כקובץ ZIP'}
            </ListItemText>
          </MenuItem>
        </Menu>

        <TransferFileDialog 
          open={openTransferDialog} 
          onClose={() => setOpenTransferDialog(false)} 
          folder={folder} 
          file={null} 
          currentFolder={currentFolder}
        />
      </div>

      {/* Snackbar להודעות משתמש */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
