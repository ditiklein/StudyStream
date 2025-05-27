import { styled } from '@mui/material/styles';
import { Box, Button, IconButton, TextField } from '@mui/material';

// Header styles
export const StyledHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  direction: 'rtl',
  textAlign: 'right',
}));

// Button styles
export const ActionButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.common.white,
  fontWeight: 500,
  '&:hover': {
    opacity: 0.9,
  },
  marginLeft: theme.spacing(1),
  whiteSpace: 'nowrap',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const RecycleBinIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#e91e63',
  color: 'white',
  marginRight: theme.spacing(2),
  '&:hover': {
    backgroundColor: '#9c27b0',
  },
}));

// Layout containers
export const ActionsContainer = styled(Box)({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
});

export const LeftSection = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

export const RightSection = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

// Search field
export const SearchField = styled(TextField)(({ theme }) => ({
  width: '250px',
  marginRight: theme.spacing(1),
}));

// Common styles as objects for reuse
export const commonStyles = {
  container: {
    py: 4,
  },
  
  paper: {
    borderRadius: 2,
    overflow: 'hidden',
    mb: 4,
  },
  
  breadcrumbs: {
    mb: 3,
    direction: 'ltr' as const,
  },
  
  title: {
    fontWeight: 'bold',
  },
  
  dialog: {
    maxWidth: 'md' as const,
    fullWidth: true,
  },
} as const;