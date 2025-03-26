import { styled } from '@mui/material';
import { Box, Typography } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

// עיצוב הקונטיינר החיצוני שמכיל את התיקייה/קובץ והכיתוב
export const ItemWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  padding: theme.spacing(1),
  '&:hover': {
    outline: '2px solid #0078D7',
    borderRadius: '4px',
  },
}));

// קונטיינר תמונת התיקייה
export const FolderImageContainer = styled(Box)(({ theme }) => ({
  height: '120px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(0.5),
}));

// תגית התמונה עם סגנון
export const FolderImage = styled('img')({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
});

// עיצוב מותאם לקבצים - תצוגת תמונה
export const FileContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '80px',
  marginBottom: theme.spacing(0.5),
  borderRadius: '4px',
  overflow: 'hidden',
}));

// תמונת הקובץ
export const FileImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

// שכבת המעבר השחורה עם אייקון ההורדה
export const FileOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // שקיפות שחורה
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 1,
  },
});

// אייקון ההורדה עם עיצוב
export const DownloadIconStyled = styled(DownloadIcon)(({ theme }) => ({
  fontSize: 40,
  color: 'white',
}));

// עיצוב לשם הפריט (תיקייה/קובץ)
export const ItemName = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  fontSize: '0.9rem',
  width: '100%',
  marginTop: 0,
}));

// מצב ריק
export const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
}));

export default {
  ItemWrapper,
  FolderImageContainer,
  FolderImage,
  FileContainer,
  FileImage,
  FileOverlay,
  DownloadIconStyled,
  ItemName,
  EmptyState
};
