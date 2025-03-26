import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, CircularProgress, Grid, TextField, IconButton } from '@mui/material';
import { fetchRootFolders, fetchSubFoldersAndFiles, selectFoldersAndFiles, updateFile, updateFolder } from '../FileAndFolderStore/FilesSlice';
import { AppDispatch } from '../FileAndFolderStore/FileStore';
import { EmptyState, FileContainer, FileImage, FolderImage, FolderImageContainer, ItemName, ItemWrapper } from './FolderAndFileStyle';
import LongMenu from './Menu';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import FileMenu from './MenuFile';
import Swal from 'sweetalert2';
import AudioModal from './AudioModel';

interface FolderAndFileListProps {
  currentFolderId: number | null;
  onFolderClick: (folderId: number, folderName: string) => void;
  folderImagePath?: string;
  fileImagePath?: string;
  currentFolder:any
}

const FolderAndFileList: React.FC<FolderAndFileListProps> = ({ 
  currentFolderId,
  onFolderClick,
  folderImagePath = '/f.png',
  fileImagePath = '/e.png',
  currentFolder
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { folders, files, loading, error } = useSelector(selectFoldersAndFiles);
  const storedUser = sessionStorage.getItem('User');
const user = storedUser ? JSON.parse(storedUser) : null;

  const [hoverFolderId, setHoverFolderId] = useState<number | null>(null);
  const [hoverFileId, setHoverFileId] = useState<number | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [editingFileId, setEditingFileId] = useState<number | null>(null);
  const [newFileName, setNewFileName] = useState<string>('');
  const [openAudioModal, setOpenAudioModal] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  console.log(folders); // בדוק מה יש כאן

  useEffect(() => {
    if (currentFolderId === null) {
      dispatch(fetchRootFolders(user?.id));
    } else {
      dispatch(fetchSubFoldersAndFiles({ parentFolderId: currentFolderId, ownerId: user?.id }));
    }
  }, [dispatch, currentFolderId, user?.id]);

  const handleFolderClick = (folderId: number, folderName: string) => {
    // אם התיקייה במצב עריכה, לא נפעיל את הפעולה
    if (editingFolderId === folderId) return;
    onFolderClick(folderId, folderName);
  };

  const handleFileDownload = (url:string, fileName: string) => {
    console.log(fileName);
    const a = document.createElement('a');
    a.href = url; // שים את ה-URL של הקובץ כאן
    a.download = fileName; // הגדרת שם הקובץ שיורד למחשב
    a.click(); // יוצא להפעלת ההורדה
  };


  // פונקציה להתחלת עריכת שם תיקייה
  const startEditingFolder = (folderId: number, currentName: string) => {
    setEditingFolderId(folderId);
    setNewFolderName(currentName);
  };

  // פונקציה לשמירת שם תיקייה חדש
  const saveNewFolderName = (id: number) => {
    if (editingFolderId !== null && newFolderName.trim()) {
      // בדיקה אם השם כבר קיים
      const isNameTaken = folders.some(folder => folder.name === newFolderName.trim());
      
      if (isNameTaken) {
        Swal.fire({
          icon: 'error',
          title: 'שגיאה',
          text: 'שם התיקייה כבר קיים!',
          confirmButtonText: 'אישור'
        });
        return; // לא מבצע את העדכון
      }
  
      dispatch(updateFolder({ id, name: newFolderName, ownerId: user.id, parentFolderId: currentFolderId }))
        .then(() => {
          if (currentFolderId === null) {
            dispatch(fetchRootFolders(user.id));
          } else {
            dispatch(fetchSubFoldersAndFiles({ parentFolderId: currentFolderId, ownerId: user.id }));
          }
        })
        .catch((error) => {
          console.error("שגיאה בעדכון שם התיקייה:", error);
        });
  
      setEditingFolderId(null);
      setNewFolderName('');
    }
  };
    
  // פונקציה לביטול עריכת שם תיקייה
  const cancelEditingFolder = () => {
    setEditingFolderId(null);
    setNewFolderName('');
  };

  // טיפול בלחיצת מקש בשדה העריכה של תיקייה
  const handleFolderKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') {
      saveNewFolderName(id);
    } else if (e.key === 'Escape') {
      cancelEditingFolder();
    }
  };

  // פונקציה להתחלת עריכת שם קובץ
  const handleFileEdit = (fileId: number) => {
    const fileToEdit = files.find(file => file.id === fileId);
    if (fileToEdit) {
      setEditingFileId(fileId);
      // הסר את סיומת הקובץ לפני הצגת השם
      const fileNameWithoutExtension = fileToEdit.lessonName.replace(/\.[^/.]+$/, '');
      setNewFileName(fileNameWithoutExtension);
    }
  };
  
  // פונקציה לשמירת שם קובץ חדש
const saveNewFileName = (file: any) => {
  if (editingFileId !== null && newFileName.trim()) {
    const fileExtension = file.lessonName.includes('.') 
      ? file.lessonName.substring(file.lessonName.lastIndexOf('.'))
      : '';
    const finalFileName = newFileName.includes('.') 
      ? newFileName 
      : newFileName + fileExtension;

    dispatch(updateFile({
      id: file.id, 
      lessonName: finalFileName,
      folderId: currentFolderId, 
      ownerId: user.id,
      fileType: file.fileType, 
      url: file.url
    }))
    .then(() => {
      if (currentFolderId === null) {
        dispatch(fetchRootFolders(user.id));
      } else {
        dispatch(fetchSubFoldersAndFiles({ parentFolderId: currentFolderId, ownerId: user.id }));
      }
    })
    .catch((error) => {
      console.error("שגיאה בעדכון שם הקובץ:", error);
    });

    setEditingFileId(null);
    setNewFileName('');
  }
};
  
  // פונקציה לביטול עריכת שם קובץ
  const cancelEditingFile = () => {
    setEditingFileId(null);
    setNewFileName('');
  };

  // טיפול בלחיצת מקש בשדה העריכה של קובץ
  const handleFileKeyDown = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Enter') {
      saveNewFileName(id);
    } else if (e.key === 'Escape') {
      cancelEditingFile();
    }
  };

  const handlePlayAudio = (fileUrl: string) => {
    setAudioUrl(fileUrl); // הגדרת כתובת השמע
    setOpenAudioModal(true); // פתיחת המודל
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: 'error.main' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  if (folders.length === 0 && files.length === 0) {
    return (
      <EmptyState>
        <Typography variant="body1" sx={{ mb: 1 }}>
          התיקייה ריקה
        </Typography>
        <Typography variant="body2">
          צור תיקייה חדשה או העלה קבצים כדי להתחיל
        </Typography>
      </EmptyState>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {folders.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>תיקיות</Typography>
          <Grid container spacing={2}>
            {folders.map((folder) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={folder.id}>
                <Box
                  sx={{ 
                    position: 'relative', 
                    '&:hover .menu-icon': { display: 'block' }
                  }}
                  onMouseEnter={() => setHoverFolderId(folder.id)}
                  onMouseLeave={() => setHoverFolderId(null)}
                >
                  <Box
                    className="menu-icon"
                    sx={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      zIndex: 10,
                      display: 'none'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    
                    <LongMenu 
                      id={folder.id} 
                      onEdit={() => startEditingFolder(folder.id, folder.name)} 
                      folder={folder} 
                      currentFolder={currentFolder}
                    />
                    
                  </Box>
                  <ItemWrapper onClick={() => handleFolderClick(folder.id, folder.name)}>
                    <FolderImageContainer>
                      <FolderImage 
                        src={folderImagePath} 
                        alt="תיקייה" 
                      />
                    </FolderImageContainer>
                    {editingFolderId === folder.id ? (
                      <Box sx={{ 
                        position: 'relative',
                        width: '100%', 
                        mt: 1
                      }}>
                        {/* כפתורי שמירה וביטול מעל השדה בצד שמאל */}
                        <Box sx={{ 
                          position: 'absolute',
                          top: -20,
                          left: 0,
                          display: 'flex',
                          zIndex: 1
                        }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              saveNewFolderName(folder.id);
                            }}
                            color="primary"
                            sx={{ padding: '2px' }}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEditingFolder();
                            }}
                            color="error"
                            sx={{ padding: '2px' }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <TextField
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          onKeyDown={(e) => handleFolderKeyDown(e, folder.id)}
                          variant="outlined"
                          size="small"
                          autoFocus
                          fullWidth
                          onClick={(e) => e.stopPropagation()}
                          sx={{ 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '4px',
                              height: '32px'  // שדה עריכה דק יותר
                            }
                          }}
                        />
                      </Box>
                    ) : (
                      <ItemName variant="body2">{folder.name}</ItemName>
                    )}
                  </ItemWrapper>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {files.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>קבצים</Typography>
          <Grid container spacing={2}>
            {files.map((file) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={file.id}>
                <Box
                  sx={{ 
                    position: 'relative', 
                    '&:hover .menu-icon': { display: 'block' }
                  }}
                  onMouseEnter={() => setHoverFileId(file.id)}
                  onMouseLeave={() => setHoverFileId(null)}
                >
                  <Box
                    className="menu-icon"
                    sx={{
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      zIndex: 10,
                      display: 'none'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FileMenu 
                      id={file.id}
                      onEdit={() => handleFileEdit(file.id)}
                      onUpload={() => handleFileDownload(file.id, file.lessonName)}
                      onPlayAudio={() => handlePlayAudio(file.url)} 
                      file={file} // קריאה להפעלת שמע
                      currentFolder={currentFolder}
                    />
                  </Box>
                  <ItemWrapper>
                    <FileContainer>
                      {/* מציג את תמונת הקובץ בגודל זהה לתמונת התיקייה */}
                      <FileImage 
                        src={fileImagePath} 
                        alt={file.lessonName} 
                      />
                    </FileContainer>
                    {editingFileId === file.id ? (
                      <Box sx={{ 
                        position: 'relative',
                        width: '100%', 
                        mt: 1
                      }}>
                        {/* כפתורי שמירה וביטול מעל השדה בצד שמאל */}
                        <Box sx={{ 
                          position: 'absolute',
                          top: -20,
                          left: 0,
                          display: 'flex',
                          zIndex: 1
                        }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              saveNewFileName(file.id);
                            }}
                            color="primary"
                            sx={{ padding: '2px' }}
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEditingFile();
                            }}
                            color="error"
                            sx={{ padding: '2px' }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <TextField
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          onKeyDown={(e) => handleFileKeyDown(e, file)}
                          variant="outlined"
                          size="small"
                          autoFocus
                          fullWidth
                          onClick={(e) => e.stopPropagation()}
                          sx={{ 
                            direction: 'rtl', 
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '4px',
                              height: '32px'  // שדה עריכה דק יותר
                            }
                          }}
                        />
                      </Box>
                    ) : (
        <ItemName variant="body2">
         {file.lessonName.replace(/\.[^/.]+$/, '')}
        </ItemName>
                    )}
                  </ItemWrapper>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
          <AudioModal 
      open={openAudioModal} 
      onClose={() => setOpenAudioModal(false)} 
      audioUrl={audioUrl} 
    />

    </Box>
  );
};

export default FolderAndFileList
