import { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, useTheme } from '@mui/material';
import TranscriptionViewer from "./TranscriptionViewer";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserFiles, selectFoldersAndFiles } from '../FileAndFolderStore/FilesSlice';
import { AppDispatch } from '../FileAndFolderStore/FileStore';
import Sidebar from './SideBar';

const MainT = () => {
  const theme = useTheme();
  const [selectedRecording, setSelectedRecording] = useState<any | null>(null);
  
  const storedUser = sessionStorage.getItem('User');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const dispatch = useDispatch<AppDispatch>();
  const { allUserFiles } = useSelector(selectFoldersAndFiles);
  
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserFiles(user.id));
    }
  }, [dispatch, user?.id,selectedRecording]);
  
  const handleRecordingSelect = (recording: any) => {
  console.log("handleRecordingSelect",recording);
  setSelectedRecording(recording);
  console.log("handleRecordingSelect",recording);

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
        {/* הסרת הכותרת העליונה */}

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