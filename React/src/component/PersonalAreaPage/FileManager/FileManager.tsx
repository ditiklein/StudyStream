
// import  { useState } from 'react';
// import { Box, Container, Typography, Breadcrumbs, Link, Paper, IconButton, Button, TextField, InputAdornment, Dialog } from '@mui/material';
// import { styled } from '@mui/material/styles';
// import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
// import UploadFileIcon from '@mui/icons-material/UploadFile';
// import MicIcon from '@mui/icons-material/Mic';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
// import SearchIcon from '@mui/icons-material/Search';
// import NewFolderDialog from './NewFolderDialog';
// import FeatureCards from './FeaturesCard';
// import { FileUploadSystem } from './system';
// import RecycleBinDialog from './Garbage';
// import { useDispatch } from 'react-redux';
// import { AppDispatch } from '../FileAndFolderStore/FileStore';
// import { searchFiles, searchFolders } from '../FileAndFolderStore/FilesSlice';
// import { VoiceRecorder } from '../VoiceRecorder';
// import FolderAndFileList from './FolderAndFileList/FolderAndList';

// const StyledHeader = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   padding: theme.spacing(2, 3),
//   borderBottom: `1px solid ${theme.palette.divider}`,
//   direction: 'rtl',
//   textAlign: 'right',
// }));

// const ActionButton = styled(Button)(({ theme }) => ({
//   background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
//   color: theme.palette.common.white,
//   fontWeight: 500,
//   '&:hover': {
//     opacity: 0.9,
//   },
//   marginLeft: theme.spacing(1),
//   whiteSpace: 'nowrap',
//   display: 'flex',
//   flexDirection: 'row',
//   alignItems: 'center',
//   gap: theme.spacing(1)
// }));

// const RecycleBinIconButton = styled(IconButton)(({ theme }) => ({
//   backgroundColor: '#e91e63',
//   color: 'white',
//   marginRight: theme.spacing(2),
//   '&:hover': {
//     backgroundColor: '#9c27b0',
//   },
// }));

// const SearchField = styled(TextField)(({ theme }) => ({
//   width: '250px',
//   marginRight: theme.spacing(1),
// }));

// const ActionsContainer = styled(Box)({
//   display: 'flex',
//   width: '100%',
//   justifyContent: 'space-between',
// });

// const LeftSection = styled(Box)(() => ({
//   display: 'flex',
//   alignItems: 'center',
// }));

// const RightSection = styled(Box)(() => ({
//   display: 'flex',
//   alignItems: 'center',
// }));

// const FileManager: React.FC = () => {
//   const [newFolderOpen, setNewFolderOpen] = useState(false);
//   const [_uploadFileOpen, setUploadFileOpen] = useState(false);
//   const [recordingModalOpen, setRecordingModalOpen] = useState(false);
//   const [recycleBinOpen, setRecycleBinOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearchActive, setIsSearchActive] = useState(false);
//   const [previousBreadcrumbs, setPreviousBreadcrumbs] = useState<{ id: number | null; name: string }[]>([]);
//   const dispatch = useDispatch<AppDispatch>();

//   const storedUser = sessionStorage.getItem('User');
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   const [breadcrumbs, setBreadcrumbs] = useState<{ id: number | null; name: string }[]>([
//     { id: null, name: 'הקבצים שלי' },
//   ]);
//   const [refreshKey, setRefreshKey] = useState(0);

//   const handleNewFolder = () => {
//     setNewFolderOpen(true);
//   };

//   const handleUploadFile = () => {
//   const el = document.getElementById("upload-box");
//   if (el) {
//     el.scrollIntoView({ behavior: "smooth", block: "center" });
//   }
//       setUploadFileOpen(true);

// };

//   const handleRecordLesson = () => {
//     setRecordingModalOpen(true);
//   };

//   const handleRecordingModalClose = () => {
//     setRecordingModalOpen(false);
//     setRefreshKey(prev => prev + 1);
//   };

//   const handleRecycleBin = () => {
//     setRecycleBinOpen(true);
//   };

//   const handleRecycleBinClose = () => {
//     setRecycleBinOpen(false);
//   };

//   const handleBreadcrumbClick = (index: number) => {
//     setBreadcrumbs(prev => prev.slice(0, index + 1));
//     // אם חוזרים לתיקייה שאינה חיפוש, נפעיל מחדש את התצוגה הרגילה
//     if (isSearchActive) {
//       setIsSearchActive(false);
//       setSearchQuery('');
//     }
//   };

//   const handleFolderNavigate = (folderId: number, folderName: string) => {
//     setBreadcrumbs(prev => [...prev, { id: folderId, name: folderName }]);
//     // אם נכנסים לתיקייה בזמן חיפוש, נבטל את החיפוש
//     if (isSearchActive) {
//       setIsSearchActive(false);
//       setSearchQuery('');
//     }
//   };

//   const handleFolderCreated = () => {
//     setRefreshKey(prev => prev + 1);
//     setNewFolderOpen(false);
//   };

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const query = event.target.value;
//     setSearchQuery(query);

//     if (query.trim() === '') {
//       if (isSearchActive) {
//         setIsSearchActive(false);
//         setBreadcrumbs(previousBreadcrumbs);
//       }
//       return;
//     }

//     if (!isSearchActive) {
//       setPreviousBreadcrumbs([...breadcrumbs]);
//       setIsSearchActive(true);
      
//       const currentFolder = breadcrumbs[breadcrumbs.length - 1].name;
      
//       setBreadcrumbs([
//         { id: null, name: 'הקבצים שלי' },
//         { id: null, name: `תוצאות החיפוש ב${currentFolder}` }
//       ]);
//     }
    
//     const folderId = breadcrumbs[breadcrumbs.length - 1].id;
    
//     dispatch(searchFolders({
//       userId: user?.id,
//       currentFolderId: folderId, 
//       query: query,
//     }));
    
//     // חיפוש קבצים
//     dispatch(searchFiles({
//       userId: user?.id,
//       currentFolderId: folderId,
//       query: query,
//     }));
//   };
  
//   const currentFolderId = isSearchActive 
//     ? previousBreadcrumbs[previousBreadcrumbs.length - 1].id 
//     : breadcrumbs[breadcrumbs.length - 1].id;

//   return (
//     <Container maxWidth="lg" sx={{ py: 4 }}>
//       <Typography variant="h4" component="h1" align="center" gutterBottom fontWeight="bold">
//         אזור אישי
//       </Typography>

//       <Breadcrumbs 
//         aria-label="breadcrumb"
//         sx={{ mb: 3, direction: 'ltr' }}
//       >
//         <Link underline="hover" color="inherit" href="/">
//           בית
//         </Link>
//         {breadcrumbs.map((crumb, index) => {
//           const isLast = index === breadcrumbs.length - 1;
//           return isLast ? (
//             <Typography key={index} color="primary" fontWeight="medium">
//               {crumb.name}
//             </Typography>
//           ) : (
//             <Link
//               key={index}
//               component="button"
//               underline="hover"
//               color="inherit"
//               onClick={() => handleBreadcrumbClick(index)}
//             >
//               {crumb.name}
//             </Link>
//           );
//         })}
//       </Breadcrumbs>

//       <Paper 
//         elevation={2} 
//         sx={{ 
//           borderRadius: 2, 
//           overflow: 'hidden',
//           mb: 4
//         }}
//       >
//         <StyledHeader>
//           <ActionsContainer>
//             <RightSection>
//               <RecycleBinIconButton onClick={handleRecycleBin}>
//                 <DeleteOutlineIcon />
//               </RecycleBinIconButton>
              
//               <SearchField
//                 placeholder="חיפוש..."
//                 variant="outlined"
//                 size="small"
//                 value={searchQuery}
//                 onChange={handleSearchChange}
//                 InputProps={{
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <SearchIcon />
//                     </InputAdornment>
//                   ),
//                 }}
//               />
//             </RightSection>
            
//             <LeftSection>
//               <ActionButton
//                 variant="contained"
//                 onClick={handleUploadFile}
//               >
//                 <UploadFileIcon />
//                 העלאת קובץ
//               </ActionButton>
              
//               <ActionButton
//                 variant="contained"
//                 onClick={handleNewFolder}
//               >
//                 <CreateNewFolderIcon />
//                 תיקייה חדשה
//               </ActionButton>
              
//               <ActionButton
//                 variant="contained"
//                 onClick={handleRecordLesson}
//               >
//                 <MicIcon />
//                 הקלטת שיעור
//               </ActionButton>
//             </LeftSection>
//           </ActionsContainer>
//         </StyledHeader>

//         <FolderAndFileList 
//           key={refreshKey} 
//           currentFolderId={currentFolderId} 
//           onFolderClick={handleFolderNavigate} 
//           currentFolder={currentFolderId}
//           isSearchMode={isSearchActive}
//           searchQuery={searchQuery}
//         />
// <Box id="upload-box">
//   <FileUploadSystem parentId={currentFolderId} />
// </Box>
//       </Paper>

//       <FeatureCards />

//       <NewFolderDialog 
//         open={newFolderOpen} 
//         onClose={() => setNewFolderOpen(false)}
//         onSuccess={handleFolderCreated}
//         parentFolderId={currentFolderId}
//       />

//       <RecycleBinDialog 
//         open={recycleBinOpen} 
//         onClose={handleRecycleBinClose} 
//         currentFolderId={currentFolderId}
//       />

//       <Dialog
//         open={recordingModalOpen}
//         onClose={handleRecordingModalClose}
//         maxWidth="md"
//         fullWidth
//       >
//         <VoiceRecorder parentId={currentFolderId} />
//       </Dialog>
//     </Container>
//   );
// };

// export default FileManager;


import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Breadcrumbs, 
  Link, 
  Paper, 
  InputAdornment, 
  Dialog 
} from '@mui/material';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MicIcon from '@mui/icons-material/Mic';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import { useFileManager } from './hook';
import { ActionButton, ActionsContainer, commonStyles, LeftSection, RecycleBinIconButton, RightSection, SearchField, StyledHeader } from './Style';
import FolderAndFileList from '../FolderAndFileList/FolderAndList';
import { FileUploadSystem } from '../system';
import FeatureCards from '../FeaturesCard';
import NewFolderDialog from '../NewFolderDialog';
import RecycleBinDialog from '../Garbage';
import { VoiceRecorder } from '../voice-recorder/VoiceRecorder';

// Components


const FileManager: React.FC = () => {
  const {
    // State
    newFolderOpen,
    recordingModalOpen,
    recycleBinOpen,
    searchQuery,
    isSearchActive,
    breadcrumbs,
    refreshKey,
    currentFolderId,
    
    // Handlers
    handleNewFolder,
    closeNewFolder,
    handleUploadFile,
    handleRecordLesson,
    handleRecordingModalClose,
    handleRecycleBin,
    handleRecycleBinClose,
    handleBreadcrumbClick,
    handleFolderNavigate,
    handleFolderCreated,
    handleSearchChange,
  } = useFileManager();

  return (
    <Container maxWidth="lg" sx={commonStyles.container}>
      <Typography 
        variant="h4" 
        component="h1" 
        align="center" 
        gutterBottom 
        sx={commonStyles.title}
      >
        אזור אישי
      </Typography>

      <Breadcrumbs 
        aria-label="breadcrumb"
        sx={commonStyles.breadcrumbs}
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

      <Paper elevation={2} sx={commonStyles.paper}>
        <StyledHeader>
          <ActionsContainer>
            <RightSection>
              <RecycleBinIconButton onClick={handleRecycleBin}>
                <DeleteOutlineIcon />
              </RecycleBinIconButton>
              
              <SearchField
                placeholder="חיפוש..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </RightSection>
            
            <LeftSection>
              <ActionButton variant="contained" onClick={handleUploadFile}>
                <UploadFileIcon />
                העלאת קובץ
              </ActionButton>
              
              <ActionButton variant="contained" onClick={handleNewFolder}>
                <CreateNewFolderIcon />
                תיקייה חדשה
              </ActionButton>
              
              <ActionButton variant="contained" onClick={handleRecordLesson}>
                <MicIcon />
                הקלטת שיעור
              </ActionButton>
            </LeftSection>
          </ActionsContainer>
        </StyledHeader>

        <FolderAndFileList 
          key={refreshKey} 
          currentFolderId={currentFolderId} 
          onFolderClick={handleFolderNavigate} 
          currentFolder={currentFolderId}
          isSearchMode={isSearchActive}
          searchQuery={searchQuery}
        />
        
        <Box id="upload-box">
          <FileUploadSystem parentId={currentFolderId} />
        </Box>
      </Paper>

      <FeatureCards />

      {/* Dialogs */}
      <NewFolderDialog 
        open={newFolderOpen} 
        onClose={closeNewFolder}
        onSuccess={handleFolderCreated}
        parentFolderId={currentFolderId}
      />

      <RecycleBinDialog 
        open={recycleBinOpen} 
        onClose={handleRecycleBinClose} 
        currentFolderId={currentFolderId}
      />

      <Dialog
        open={recordingModalOpen}
        onClose={handleRecordingModalClose}
          maxWidth="md"
  fullWidth

      >
        <VoiceRecorder parentId={currentFolderId} />
      </Dialog>
    </Container>
  );
};

export default FileManager;