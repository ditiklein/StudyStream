
import { 
  Box, 
   
  Button, 
  styled, 

} from '@mui/material';

// קומפוננטת אזור גרירת קבצים

interface UploadBoxProps {
  isDragActive: boolean;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

export const UploadBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragActive',
})<UploadBoxProps>(({ theme, isDragActive }) => ({
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  textAlign: 'center',
  margin: theme.spacing(0, 3, 3, 3),
  backgroundColor: isDragActive ? `${theme.palette.primary.light}10` : 'transparent',
  transition: 'all 0.2s ease',
}));

export const UploadButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.common.white,
  fontWeight: 500,
  marginTop: theme.spacing(2),
  '&:hover': {
    opacity: 0.9,
  },
}));
