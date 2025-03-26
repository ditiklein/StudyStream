import  { useEffect, useState } from 'react';
import{ Box } from '@mui/material';
import Sidebar from "./SideBar";
import TranscriptionViewer from "./TranscriptionViewer";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserFiles, selectFoldersAndFiles } from '../FileAndFolderStore/FilesSlice';
import { AppDispatch } from '../FileAndFolderStore/FileStore';



const MainT = () => {
    const [selectedLesson, setSelectedLesson] = useState({
        lessonName: '',
        file: null
      });
      
        const storedUser = sessionStorage.getItem('User');
const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLessonSelect = (lesson:any) => {
    setSelectedLesson(lesson);
  };
  const dispatch = useDispatch<AppDispatch>();
  const { allUserFiles } = useSelector(selectFoldersAndFiles);
  console.log(allUserFiles);
  
  useEffect(() => {
    dispatch(fetchUserFiles(user.id));  // שליפה של הקבצים
  }, [dispatch, user.id]);
  
  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh' 
    }}>
      <Box 
        sx={{ 
          width: '250px', 
          bgcolor: 'white', 
          borderRight: '1px solid rgba(0,0,0,0.12)',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)' 
        }}
      >
        <Sidebar 
          recordings={allUserFiles}
          onSelectLesson={handleLessonSelect}
        />
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          overflow: 'auto'
        }}
      >
        <TranscriptionViewer selectedLesson={selectedLesson} />
      </Box>
    </Box>
  );
};

export default MainT;
