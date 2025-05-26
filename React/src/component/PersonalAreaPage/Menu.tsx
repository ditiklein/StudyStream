
import * as React from 'react';
import { useDispatch } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { deleteFolder } from '../FileAndFolderStore/FilesSlice';
import { AppDispatch } from '../FileAndFolderStore/FileStore';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove'; // אייקון של העברה
import TransferFileDialog from '../FolderListDialog';

const ITEM_HEIGHT = 48;

interface LongMenuProps {
  id: number;
  onEdit?: () => void;
  folder:any
  currentFolder:any
}

export default function LongMenu({ id, onEdit,folder,currentFolder}: LongMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch<AppDispatch>();
  const [openTransferDialog, setOpenTransferDialog] = React.useState(false); // מצב לפתיחת דיאלוג

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

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onEdit) {
      onEdit();
    }
    handleClose();
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
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
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon><DeleteIcon /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMove}> {/* עדכון כאן */}
          <ListItemIcon><DriveFileMoveIcon /></ListItemIcon>
          <ListItemText>Move</ListItemText>
        </MenuItem>
      </Menu>
      <TransferFileDialog open={openTransferDialog} onClose={() => setOpenTransferDialog(false)} folder={folder} file={null} currentFolder={currentFolder}/>

    </div>
  );
}
