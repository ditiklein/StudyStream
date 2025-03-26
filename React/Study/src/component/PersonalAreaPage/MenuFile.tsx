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
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'; // אייקון של העברה
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { AppDispatch } from '../FileAndFolderStore/FileStore';
import { deleteFile } from '../FileAndFolderStore/FilesSlice';
import TransferFileDialog from '../FolderListDialog';

const ITEM_HEIGHT = 48;

interface FileMenuProps {
  id: number;
  onEdit?: () => void;
  onUpload?: () => void;
  onPlayAudio?: () => void;
  file:any;
  currentFolder:any
}

export default function FileMenu({ id, onEdit, onUpload, onPlayAudio,file ,currentFolder}: FileMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openTransferDialog, setOpenTransferDialog] = React.useState(false); // מצב לפתיחת דיאלוג
  const open = Boolean(anchorEl);
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(deleteFile(id));
    handleClose();
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onEdit) {
      onEdit();
    }
    handleClose();
  };

  const handleUpload = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onUpload) {
      onUpload();
    }
    handleClose();
  };

  const handlePlayAudio = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onPlayAudio) {
      onPlayAudio();
    }
    handleClose();
  };

  // פעולה שתפתח את הדיאלוג
  const handleMove = () => {
    handleClose(); // סוגר את הדיאלוג של ה־Menu
    setOpenTransferDialog(true); // פותח את הדיאלוג של העברת הקובץ
  };
  
  return (
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
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          },
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon><EditIcon /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleUpload}>
          <ListItemIcon><InputIcon /></ListItemIcon>
          <ListItemText>Upload</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon><DeleteIcon /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem onClick={handlePlayAudio}>
          <ListItemIcon><VolumeUpIcon /></ListItemIcon>
          <ListItemText>Play Audio</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMove}> {/* עדכון כאן */}
          <ListItemIcon><DriveFileMoveIcon /></ListItemIcon>
          <ListItemText>Move</ListItemText>
        </MenuItem>
      </Menu>

      {/* הוספת הדיאלוג */}
      <TransferFileDialog open={openTransferDialog} onClose={() => setOpenTransferDialog(false)} file={file} folder={null} currentFolder={currentFolder}/>
    </div>
  );
}
