import {
  Avatar,
  Menu,
  MenuItem,
  styled,
  Typography,
  Divider,
  Box,
  ListItemIcon,

} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import { UserEditDialog } from './UserEditDialog';

type NameAvatarProps = {
  name?: string;
};

const GradientAvatar = styled(Avatar)(() => ({
  background: 'linear-gradient(to right, #1976D2, #1565C0, #e91e63)',
  color: 'white',
  backgroundSize: '200% 100%',
  animation: 'gradientShift 3s ease infinite',
  cursor: 'pointer',
  '@keyframes gradientShift': {
    '0%': { backgroundPosition: '0% 50%' },
    '50%': { backgroundPosition: '100% 50%' },
    '100%': { backgroundPosition: '0% 50%' }
  }
}));

const getInitials = (name?: string): string => {
  if (!name) return '';
  const names = name.split(' ');
  return names.map((n) => n[0]).join('').toUpperCase();
};

export const NameAvatar: React.FC<NameAvatarProps> = ({ name }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();

  const storedUser = sessionStorage.getItem("User");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = (path: string) => {
    handleClose();
    navigate(path);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("User");
    handleClose();
    navigate('/login');
  };

  const handleOpenEdit = () => {
    handleClose();
    setEditOpen(true);
  };

  return (
    <>
      <GradientAvatar onClick={handleClick}>
        {getInitials(name)}
      </GradientAvatar>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose} dir="rtl">
        <Box sx={{ px: 2, pt: 1 }}>
          <Typography variant="body1" fontWeight="bold">
            {user?.firstName || 'שם משתמש'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email || 'email@example.com'}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <MenuItem onClick={() => handleNavigate('/personal')}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          אזור אישי
        </MenuItem>

        <MenuItem onClick={handleOpenEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          עריכת משתמש
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          התנתקות
        </MenuItem>
      </Menu>

      <UserEditDialog open={editOpen} onClose={() => setEditOpen(false)} user={user} />
    </>
  );
};
