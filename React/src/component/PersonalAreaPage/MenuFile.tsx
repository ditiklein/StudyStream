import * as React from 'react';
import { useDispatch } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InputIcon from '@mui/icons-material/Input';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AppDispatch } from '../FileAndFolderStore/FileStore';
import { deleteFile } from '../FileAndFolderStore/FilesSlice';
import TransferFileDialog from '../FolderListDialog';
import { Lesson } from '../../Modles/File';

const ITEM_HEIGHT = 48;

interface FileMenuProps {
  id: number;
  onEdit?: () => void;
  onUpload?: () => void;
  onPlayAudio?: () => void;
  onEditAudio?: () => void;
  file: Lesson;
  currentFolder: any;
}

export default function FileMenu({ 
  id, 
  onEdit, 
  onUpload, 
  onPlayAudio, 
  onEditAudio,
  file, 
  currentFolder 
}: FileMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openTransferDialog, setOpenTransferDialog] = React.useState(false);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch<AppDispatch>();

  // בדיקה אם הקובץ הוא קובץ שמע
  const isAudioFile = (fileName: string) => {
    const audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
    return audioExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch(deleteFile(id));
    handleClose();
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (onEdit) onEdit();
    handleClose();
  };

  const handleUpload = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (onUpload) onUpload();
    handleClose();
  };

  const handlePlayAudio = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (onPlayAudio) onPlayAudio();
    handleClose();
  };

  const handleEditAudio = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (onEditAudio) onEditAudio();
    handleClose();
  };

  const handleMove = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    console.log("לחיצה על העברה - מנסה לפתוח את הדיאלוג"); // הוספת לוג לבדיקה
    handleClose();
    // השהייה קצרה לפני פתיחת הדיאלוג כדי לוודא שהתפריט נסגר
    setTimeout(() => {
      console.log("פותח את הדיאלוג עכשיו"); // הוספת לוג נוסף
      setOpenTransferDialog(true);
    }, 100);
  };

  // הוספת useEffect לבדיקת מצב הדיאלוג
  React.useEffect(() => {
    console.log("מצב הדיאלוג השתנה:", openTransferDialog);
  }, [openTransferDialog]);

  return (
    <>
      <div onClick={(e) => e.stopPropagation()}>
        <IconButton
          aria-label="more"
          id="file-menu-button"
          aria-controls={open ? 'file-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          size="small"
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="file-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          slotProps={{
            paper: {
              style: {
                maxHeight: ITEM_HEIGHT * 6.5,
                width: '20ch',
              },
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <ListItemIcon><EditIcon /></ListItemIcon>
            <ListItemText>עריכה</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleUpload}>
            <ListItemIcon><InputIcon /></ListItemIcon>
            <ListItemText>הורדה</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleDelete}>
            <ListItemIcon><DeleteIcon /></ListItemIcon>
            <ListItemText>מחיקה</ListItemText>
          </MenuItem>
          
          {isAudioFile(file.lessonName || file.urlName || '') && (
            <MenuItem onClick={handlePlayAudio}>
              <ListItemIcon><VolumeUpIcon /></ListItemIcon>
              <ListItemText>השמעת שמע</ListItemText>
            </MenuItem>
          )}
          
          {isAudioFile(file.lessonName || file.urlName || '') && (
            <MenuItem onClick={handleEditAudio}>
              <ListItemIcon><AudiotrackIcon /></ListItemIcon>
              <ListItemText>עריכת שמע</ListItemText>
            </MenuItem>
          )}
          
          <MenuItem onClick={handleMove}>
            <ListItemIcon><DriveFileMoveIcon /></ListItemIcon>
            <ListItemText>העברה</ListItemText>
          </MenuItem>
        </Menu>
      </div>

      {/* הדיאלוג מחוץ לתפריט - הוספת console.log לבדיקה */}
      {console.log("רינדור הדיאלוג - מצב פתוח:", openTransferDialog)}
      <TransferFileDialog
        open={openTransferDialog}
        onClose={() => {
          console.log("סגירת הדיאלוג");
          setOpenTransferDialog(false);
        }}
        file={file}
        folder={currentFolder}
        currentFolder={currentFolder}
      />
    </>
  );
}