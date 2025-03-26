import  { useState } from 'react';
import { Box, Container, Typography, Breadcrumbs, Link, Paper, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import MicIcon from '@mui/icons-material/Mic';
import FolderAndFileList from './FileAndFolderList';
import NewFolderDialog from './NewFolderDialog';
import FeatureCards from './FeaturesCard';
// import {  VoiceRecorder } from '../VoiceRecorder';
import { FileUploadSystem } from './system';

// Styled components
const StyledHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  direction: 'rtl', // הוסף זאת
  textAlign: 'right', // הוסף זאת
}));

const ActionButton = styled(Button)(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: theme.palette.common.white,
  fontWeight: 500,
  '&:hover': {
    opacity: 0.9,
  },
  marginLeft: theme.spacing(1),
}));

const FileManager: React.FC = () => {
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [_uploadFileOpen, setUploadFileOpen] = useState(false);
  const [_recordingModalOpen, setRecordingModalOpen] = useState(false); // מצב עבור מודל ההקלטה
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: number | null; name: string }[]>([
    { id: null, name: 'הקבצים שלי' },
  ]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNewFolder = () => {
    setNewFolderOpen(true);
  };

  const handleUploadFile = () => {
    setUploadFileOpen(true);
  };

  const handleRecordLesson = () => {
    // פתיחת מודל ההקלטה
    setRecordingModalOpen(true);
  };

  const handleBreadcrumbClick = (index: number) => {
    setBreadcrumbs(prev => prev.slice(0, index + 1));
  };

  const handleFolderNavigate = (folderId: number, folderName: string) => {
    setBreadcrumbs(prev => [...prev, { id: folderId, name: folderName }]);
  };

  const handleFolderCreated = () => {
    setRefreshKey(prev => prev + 1);
    setNewFolderOpen(false);
  };


  const currentFolderId = breadcrumbs[breadcrumbs.length - 1].id;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight="bold">
        אזור אישי
      </Typography>

      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3, direction: 'rtl' }}
      >
        <Link underline="hover" color="inherit" href="/">
          בית
        </Link>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return isLast ? (
            <Typography key={index} color="primary" fontWeight="medium">
              {crumb.name}
            </Typography>
          ) : (
            <Link
              key={index}
              component="button"
              underline="hover"
              color="inherit"
              onClick={() => handleBreadcrumbClick(index)}
            >
              {crumb.name}
            </Link>
          );
        })}
      </Breadcrumbs>

      <Paper 
        elevation={2} 
        sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          mb: 4
        }}
      >
        <StyledHeader>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            הקבצים והתיקיות שלי
          </Typography>
          <Box sx={{ 
  display: 'flex', 
  flexDirection: 'row-reverse', // הופך את הסדר מימין לשמאל
  gap: 1 
}}>

            {/* כפתור הקלטת שיעור */}
            <ActionButton
              variant="contained"
              startIcon={<MicIcon />}
              onClick={handleRecordLesson}
              sx={{ 
                background: 'linear-gradient(90deg, #e91e63 0%, #9c27b0 100%)',
              }}
            >
              הקלטת שיעור
            </ActionButton>
            <ActionButton
              variant="contained"
              startIcon={<CreateNewFolderIcon />}
              onClick={handleNewFolder}
            >
              תיקייה חדשה
            </ActionButton>
            <ActionButton
              variant="contained"
              startIcon={<UploadFileIcon />}
              onClick={handleUploadFile}
            >
              העלאת קובץ
            </ActionButton>
          </Box>
        </StyledHeader>

        <FolderAndFileList 
          key={refreshKey} 
          currentFolderId={currentFolderId} 
          onFolderClick={handleFolderNavigate} 
          currentFolder={currentFolderId}

        />
        <FileUploadSystem parentId={currentFolderId} />
      </Paper>

      <FeatureCards />

      <NewFolderDialog 
        open={newFolderOpen} 
        onClose={() => setNewFolderOpen(false)}
        onSuccess={handleFolderCreated}
        parentFolderId={currentFolderId}
      />
      {/* <Dialog
  open={recordingModalOpen}
  onClose={() => setRecordingModalOpen(false)}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 2,
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    }
  }}
>
  <DialogContent sx={{ p: 3 }}>
    <VoiceRecorder parentId={currentFolderId} />
  </DialogContent>
</Dialog>
 */}
      {/* הוספת מודל ההקלטה */}
    </Container>

  );
};

export default FileManager;
