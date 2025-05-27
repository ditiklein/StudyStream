
import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom'; // הוספת useLocation
import TranscriptionViewer from "./TranscriptionViewer";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserFiles, selectFoldersAndFiles } from '../FileAndFolderStore/FilesSlice';
import { AppDispatch } from '../FileAndFolderStore/FileStore';
import Sidebar from './SideBar';
import { Lesson } from '../../Modles/File'; // הוספת import של Lesson

const MainT = () => {
  const theme = useTheme();
  const location = useLocation(); // שימוש ב-useLocation
  const [selectedRecording, setSelectedRecording] = useState<Lesson | null>(null);
  
  const storedUser = sessionStorage.getItem('User');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const dispatch = useDispatch<AppDispatch>();
  const { allUserFiles } = useSelector(selectFoldersAndFiles);
  
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserFiles(user.id));
    }
  }, [dispatch, user?.id]);

  // useEffect חדש לטיפול בשיעור שנבחר מ-navigation state
  useEffect(() => {
    const state = location.state as { selectedRecording?: any } | null;
    if (state?.selectedRecording && allUserFiles.length > 0) {
      // חיפוש השיעור במערך allUserFiles לפי ID
      const foundRecording = allUserFiles.find(
        (file: Lesson) => file.id === state.selectedRecording.id
      );
      if (foundRecording) {
        setSelectedRecording(foundRecording);
        console.log("Selected recording from navigation:", foundRecording);
      }
    }
  }, [location.state, allUserFiles]);
  
  const handleRecordingSelect = (recording: Lesson) => {
    console.log("handleRecordingSelect", recording);
    setSelectedRecording(recording);
    console.log("handleRecordingSelect", recording);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      bgcolor: theme.palette.background.default,
      overflow: 'hidden'
    }}>
      {/* סרגל צד */}
      <Box 
        sx={{ 
          width: 280,
          bgcolor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          zIndex: 1,
          height: '100%',
          overflow: 'auto'
        }}
      >
        <Sidebar 
          recordings={allUserFiles}
          onSelectRecording={handleRecordingSelect}
          selectedRecording={selectedRecording}
        />
      </Box>
      
      {/* תוכן מרכזי */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1, overflow: 'auto' }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2, 
              minHeight: '70vh',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {selectedRecording ? (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  <strong>{selectedRecording.urlName?.split('.').slice(0, -1).join('.')}</strong>
                </Typography>
              </Box>
            ) : (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 1 }}>
                <Typography variant="subtitle1">
                  בחר הקלטה מהרשימה כדי להתחיל
                </Typography>
              </Box>
            )}
            
            <TranscriptionViewer 
              selectedRecording={selectedRecording}
            />
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default MainT;