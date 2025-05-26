
// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Box, Typography, CircularProgress, Grid, TextField, IconButton } from '@mui/material';
// import { fetchRootFolders, fetchSubFoldersAndFiles, searchFiles, searchFolders, selectFoldersAndFiles, updateFile, updateFolder } from '../FileAndFolderStore/FilesSlice';
// import { AppDispatch } from '../FileAndFolderStore/FileStore';
// import { EmptyState, FileContainer, FileImage, FolderImage, FolderImageContainer, ItemName, ItemWrapper } from './FolderAndFileStyle';
// import LongMenu from './Menu';
// import CheckIcon from '@mui/icons-material/Check';
// import CloseIcon from '@mui/icons-material/Close';
// import FileMenu from './MenuFile';
// import Swal from 'sweetalert2';
// import AudioModal from './AudioModel';
// import api from '../FileAndFolderStore/Api';
// import AudioEditModal from './AudioEditorModal';

// interface FolderAndFileListProps {
//   currentFolderId: number | null;
//   onFolderClick: (folderId: number, folderName: string) => void;
//   folderImagePath?: string;
//   fileImagePath?: string;
//   currentFolder: any;
//   isSearchMode?: boolean;
//   searchQuery?: string;
// }

// const FolderAndFileList: React.FC<FolderAndFileListProps> = ({
//   currentFolderId,
//   onFolderClick,
//   folderImagePath = '/f.png',
//   fileImagePath = '/e.png',
//   currentFolder,
//   isSearchMode = false,
//   searchQuery = ''
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const {
//     folders,
//     files,
//     searchFoldersResults,
//     searchFilesResults,
//     loading,
//     error
//   } = useSelector(selectFoldersAndFiles);

//   // מציג תיקיות וקבצים בהתאם למצב החיפוש
//   const displayFolders = isSearchMode ? searchFoldersResults : folders;
//   const displayFiles = isSearchMode ? searchFilesResults : files;

//   const storedUser = sessionStorage.getItem('User');
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   const [_hoverFolderId, setHoverFolderId] = useState<number | null>(null);
//   const [_hoverFileId, setHoverFileId] = useState<number | null>(null);
//   const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
//   const [newFolderName, setNewFolderName] = useState<string>('');
//   const [editingFileId, setEditingFileId] = useState<number | null>(null);
//   const [newFileName, setNewFileName] = useState<string>('');
//   const [openAudioModal, setOpenAudioModal] = useState<boolean>(false);
//   const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
//   // State חדש לעריכת שמע
//   const [openAudioEditModal, setOpenAudioEditModal] = useState<boolean>(false);
//   const [audioEditUrl, setAudioEditUrl] = useState<string | null>(null);
//   const [audioEditFileName, setAudioEditFileName] = useState<string>('');

//   useEffect(() => {
//     if (isSearchMode && searchQuery.trim() !== '') {
//       console.log("חיפוש עם הפרמטרים:", { 
//         userId: user?.id, 
//         currentFolderId, 
//         query: searchQuery 
//       });
      
//       // חיפוש תיקיות
//       dispatch(searchFolders({
//         userId: user?.id,
//         currentFolderId,
//         query: searchQuery,
//       }));
      
//       // חיפוש קבצים
//       dispatch(searchFiles({
//         userId: user?.id,
//         currentFolderId,
//         query: searchQuery,
//       }));
//     } else if (!isSearchMode) {
//       // טעינה רגילה של תיקיות וקבצים
//       if (currentFolderId === null) {
//         dispatch(fetchRootFolders(user?.id));
//       } else {
//         dispatch(fetchSubFoldersAndFiles({ parentFolderId: currentFolderId, ownerId: user?.id }));
//       }
//     }
//   }, [dispatch, currentFolderId, user?.id, isSearchMode, searchQuery]);

//   const handleFolderClick = (folderId: number, folderName: string) => {
//     // אם התיקייה במצב עריכה, לא נפעיל את הפעולה
//     if (editingFolderId === folderId) return;
//     onFolderClick(folderId, folderName);
//   };

//   const handleFileDownload = async (fileName: string) => {
//     try {
//       const a = document.createElement('a');
//       const downloadResponse = await api.get<string>(`/upload/download-url/${fileName}`);
//       a.href = downloadResponse.data;
//       a.download = fileName;
//       a.click();
//     } catch (error) {
//       console.error("שגיאה בהורדת קובץ:", error);
//       Swal.fire({
//         icon: 'error',
//         title: 'שגיאה בהורדת הקובץ',
//         text: 'אירעה שגיאה בעת ניסיון להוריד את הקובץ. נסה שנית.',
//         confirmButtonText: 'אישור'
//       });
//     }
//   };

//   // פונקציה להתחלת עריכת שם תיקייה
//   const startEditingFolder = (folderId: number, currentName: string) => {
//     setEditingFolderId(folderId);
//     setNewFolderName(currentName);
//   };

//   // פונקציה לשמירת שם תיקייה חדש
//   const saveNewFolderName = (id: number) => {
//     if (editingFolderId !== null && newFolderName.trim()) {
//       // בדיקה אם השם כבר קיים
//       const isNameTaken = folders.some(folder => 
//         folder.id !== id && folder.name === newFolderName.trim()
//       );
      
//       if (isNameTaken) {
//         Swal.fire({
//           icon: 'error',
//           title: 'שגיאה',
//           text: 'שם התיקייה כבר קיים!',
//           confirmButtonText: 'אישור'
//         });
//         return;
//       }
  
//       dispatch(updateFolder({ 
//         id, 
//         name: newFolderName.trim(), 
//         ownerId: user.id, 
//         parentFolderId: currentFolderId 
//       }))
//         .then(() => {
//           // רענון הרשימה לאחר עדכון השם
//           if (currentFolderId === null) {
//             dispatch(fetchRootFolders(user.id));
//           } else {
//             dispatch(fetchSubFoldersAndFiles({ parentFolderId: currentFolderId, ownerId: user.id }));
//           }
          
//           setEditingFolderId(null);
//           setNewFolderName('');
//         })
//         .catch((error) => {
//           console.error("שגיאה בעדכון שם התיקייה:", error);
//           Swal.fire({
//             icon: 'error',
//             title: 'שגיאה',
//             text: 'אירעה שגיאה בעת עדכון שם התיקייה',
//             confirmButtonText: 'אישור'
//           });
//         });
//     }
//   };
    
//   // פונקציה לביטול עריכת שם תיקייה
//   const cancelEditingFolder = () => {
//     setEditingFolderId(null);
//     setNewFolderName('');
//   };

//   // טיפול בלחיצת מקש בשדה העריכה של תיקייה
//   const handleFolderKeyDown = (e: React.KeyboardEvent, id: number) => {
//     if (e.key === 'Enter') {
//       saveNewFolderName(id);
//     } else if (e.key === 'Escape') {
//       cancelEditingFolder();
//     }
//   };

//   // פונקציה להתחלת עריכת שם קובץ
//   const handleFileEdit = (fileId: number) => {
//     const fileToEdit = files.find(file => file.id === fileId);
//     if (fileToEdit) {
//       setEditingFileId(fileId);
//       // הסר את סיומת הקובץ לפני הצגת השם
//       const fileNameWithoutExtension = fileToEdit.lessonName.replace(/\.[^/.]+$/, '');
//       setNewFileName(fileNameWithoutExtension);
//     }
//   };
  
//   // פונקציה לשמירת שם קובץ חדש
//   const saveNewFileName = (_file: any) => {
//     if (editingFileId !== null && newFileName.trim()) {
//       // קבלת הקובץ הנוכחי
//       const currentFile = files.find(f => f.id === editingFileId);
      
//       if (!currentFile) {
//         console.error("לא נמצא הקובץ לעריכה");
//         return;
//       }
      
//       // שמירת הסיומת המקורית של הקובץ
//       const fileExtension = currentFile.urlName.includes('.') 
//         ? currentFile.urlName.substring(currentFile.urlName.lastIndexOf('.'))
//         : '';
        
//       // הוספת הסיומת לשם החדש אם צריך
//       const finalFileName = newFileName.includes('.') 
//         ? newFileName 
//         : newFileName + fileExtension;

//       dispatch(updateFile({
//         id: currentFile.id, 
//         lessonName: finalFileName,
//         folderId: currentFolderId, 
//         ownerId: user.id,
//         fileType: currentFile.fileType, 
//         url: currentFile.url,
//         isDeleted: currentFile.isDeleted
//       }))
//       .then(() => {
//         // רענון הרשימה לאחר עדכון השם
//         if (currentFolderId === null) {
//           dispatch(fetchRootFolders(user.id));
//         } else {
//           dispatch(fetchSubFoldersAndFiles({ parentFolderId: currentFolderId, ownerId: user.id }));
//         }
        
//         setEditingFileId(null);
//         setNewFileName('');
//       })
//       .catch((error) => {
//         console.error("שגיאה בעדכון שם הקובץ:", error);
//         Swal.fire({
//           icon: 'error',
//           title: 'שגיאה',
//           text: 'אירעה שגיאה בעת עדכון שם הקובץ',
//           confirmButtonText: 'אישור'
//         });
//       });
//     }
//   };
  
//   // פונקציה לביטול עריכת שם קובץ
//   const cancelEditingFile = () => {
//     setEditingFileId(null);
//     setNewFileName('');
//   };

//   // טיפול בלחיצת מקש בשדה העריכה של קובץ
//   const handleFileKeyDown = (e: React.KeyboardEvent, file: any) => {
//     if (e.key === 'Enter') {
//       saveNewFileName(file);
//     } else if (e.key === 'Escape') {
//       cancelEditingFile();
//     }
//   };

//   // פונקציה להפעלת קובץ שמע
//   const handlePlayAudio = async (name: string) => {
//     try {
//       console.log("הפעלת שמע:", name);
      
//       const downloadResponse = await api.get<string>(`/upload/download-url/${name}`);
//       console.log("תשובה מהשרת:", downloadResponse);

//       if (downloadResponse && downloadResponse.data) {
//         setAudioUrl(downloadResponse.data);
//         setOpenAudioModal(true);
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'שגיאה',
//           text: 'לא ניתן להפעיל את קובץ השמע',
//           confirmButtonText: 'אישור'
//         });
//       }
//     } catch (error) {
//       console.error("שגיאה בהפעלת קובץ שמע:", error);
//       Swal.fire({
//         icon: 'error',
//         title: 'שגיאה',
//         text: 'אירעה שגיאה בעת ניסיון להפעיל את קובץ השמע',
//         confirmButtonText: 'אישור'
//       });
//     }
//   };

//   // פונקציה חדשה לפתיחת מודל עריכת שמע
//   const handleEditAudio = async (fileName: string) => {
//     try {
//       console.log("פתיחת עריכת שמע:", fileName);
      
//       const downloadResponse = await api.get<string>(`/upload/download-url/${fileName}`);
//       console.log("תשובה מהשרת לעריכת שמע:", downloadResponse);

//       if (downloadResponse && downloadResponse.data) {
//         setAudioEditUrl(downloadResponse.data);
//         setAudioEditFileName(fileName);
//         setOpenAudioEditModal(true);
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'שגיאה',
//           text: 'לא ניתן לפתוח את קובץ השמע לעריכה',
//           confirmButtonText: 'אישור'
//         });
//       }
//     } catch (error) {
//       console.error("שגיאה בפתיחת עריכת קובץ שמע:", error);
//       Swal.fire({
//         icon: 'error',
//         title: 'שגיאה',
//         text: 'אירעה שגיאה בעת ניסיון לפתוח את קובץ השמע לעריכה',
//         confirmButtonText: 'אישור'
//       });
//     }
//   };
  
//   // הצגת טעינה
//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // הצגת שגיאה
//   if (error) {
//     return (
//       <Box sx={{ p: 3, color: 'error.main' }}>
//         <Typography>{error}</Typography>
//       </Box>
//     );
//   }

//   // הודעה כאשר אין תיקיות וקבצים להצגה
//   if (displayFolders.length === 0 && displayFiles.length === 0) {
//     return (
//       <EmptyState>
//         {isSearchMode ? (
//           <Typography variant="body1" sx={{ mb: 1 }}>
//             לא נמצאו תוצאות עבור "{searchQuery}"
//           </Typography>
//         ) : (
//           <>
//             <Typography variant="body1" sx={{ mb: 1 }}>
//               התיקייה ריקה
//             </Typography>
//             <Typography variant="body2">
//               צור תיקייה חדשה או העלה קבצים כדי להתחיל
//             </Typography>
//           </>
//         )}
//       </EmptyState>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       {displayFolders.length > 0 && (
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h6" sx={{ mb: 2 }}>תיקיות</Typography>
//           <Grid container spacing={2}>
//             {displayFolders.map((folder) => (
//               <Grid item xs={6} sm={4} md={3} lg={2} key={folder.id}>
//                 <Box
//                   sx={{ 
//                     position: 'relative', 
//                     '&:hover .menu-icon': { display: 'block' }
//                   }}
//                   onMouseEnter={() => setHoverFolderId(folder.id)}
//                   onMouseLeave={() => setHoverFolderId(null)}
//                 >
//                   <Box
//                     className="menu-icon"
//                     sx={{
//                       position: 'absolute',
//                       top: '5px',
//                       right: '5px',
//                       zIndex: 10,
//                       display: 'none'
//                     }}
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <LongMenu 
//                       id={folder.id} 
//                       onEdit={() => startEditingFolder(folder.id, folder.name)} 
//                       folder={folder} 
//                       currentFolder={currentFolder}
//                     />
//                   </Box>
//                   <ItemWrapper onClick={() => handleFolderClick(folder.id, folder.name)}>
//                     <FolderImageContainer>
//                       <FolderImage 
//                         src={folderImagePath} 
//                         alt="תיקייה" 
//                       />
//                     </FolderImageContainer>
//                     {editingFolderId === folder.id ? (
//                       <Box sx={{ 
//                         position: 'relative',
//                         width: '100%', 
//                         mt: 1
//                       }}>
//                         <Box sx={{ 
//                           position: 'absolute',
//                           top: -20,
//                           left: 0,
//                           display: 'flex',
//                           zIndex: 1
//                         }}>
//                           <IconButton
//                             size="small"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               saveNewFolderName(folder.id);
//                             }}
//                             color="primary"
//                             sx={{ padding: '2px' }}
//                           >
//                             <CheckIcon fontSize="small" />
//                           </IconButton>
//                           <IconButton
//                             size="small"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               cancelEditingFolder();
//                             }}
//                             color="error"
//                             sx={{ padding: '2px' }}
//                           >
//                             <CloseIcon fontSize="small" />
//                           </IconButton>
//                         </Box>
//                         <TextField
//                           value={newFolderName}
//                           onChange={(e) => setNewFolderName(e.target.value)}
//                           onKeyDown={(e) => handleFolderKeyDown(e, folder.id)}
//                           variant="outlined"
//                           size="small"
//                           autoFocus
//                           fullWidth
//                           onClick={(e) => e.stopPropagation()}
//                           sx={{ 
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: '4px',
//                               height: '32px'
//                             }
//                           }}
//                         />
//                       </Box>
//                     ) : (
//                       <ItemName variant="body2">{folder.name}</ItemName>
//                     )}
//                   </ItemWrapper>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}

//       {displayFiles.length > 0 && (
//         <Box>
//           <Typography variant="h6" sx={{ mb: 2 }}>קבצים</Typography>
//           <Grid container spacing={2}>
//             {displayFiles.map((file) => (
//               <Grid item xs={6} sm={4} md={3} lg={2} key={file.id}>
//                 <Box
//                   sx={{ 
//                     position: 'relative', 
//                     '&:hover .menu-icon': { display: 'block' }
//                   }}
//                   onMouseEnter={() => setHoverFileId(file.id)}
//                   onMouseLeave={() => setHoverFileId(null)}
//                 >
//                   <Box
//                     className="menu-icon"
//                     sx={{
//                       position: 'absolute',
//                       top: '5px',
//                       right: '5px',
//                       zIndex: 10,
//                       display: 'none'
//                     }}
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <FileMenu 
//                       id={file.id}
//                       onEdit={() => handleFileEdit(file.id)}
//                       onUpload={() => handleFileDownload(file.lessonName)}
//                       onPlayAudio={() => handlePlayAudio(file.lessonName)}
//                       onEditAudio={() => handleEditAudio(file.lessonName)}
//                       file={file}
//                       currentFolder={currentFolder}
//                     />
//                   </Box>
//                   <ItemWrapper>
//                     <FileContainer>
//                       <FileImage 
//                         src={fileImagePath} 
//                         alt={file.lessonName} 
//                       />
//                     </FileContainer>
//                     {editingFileId === file.id ? (
//                       <Box sx={{ 
//                         position: 'relative',
//                         width: '100%', 
//                         mt: 1
//                       }}>
//                         <Box sx={{ 
//                           position: 'absolute',
//                           top: -20,
//                           left: 0,
//                           display: 'flex',
//                           zIndex: 1
//                         }}>
//                           <IconButton
//                             size="small"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               saveNewFileName(file.id);
//                             }}
//                             color="primary"
//                             sx={{ padding: '2px' }}
//                           >
//                             <CheckIcon fontSize="small" />
//                           </IconButton>
//                           <IconButton
//                             size="small"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               cancelEditingFile();
//                             }}
//                             color="error"
//                             sx={{ padding: '2px' }}
//                           >
//                             <CloseIcon fontSize="small" />
//                           </IconButton>
//                         </Box>
//                         <TextField
//                           value={newFileName}
//                           onChange={(e) => setNewFileName(e.target.value)}
//                           onKeyDown={(e) => handleFileKeyDown(e, file)}
//                           variant="outlined"
//                           size="small"
//                           autoFocus
//                           fullWidth
//                           onClick={(e) => e.stopPropagation()}
//                           sx={{ 
//                             direction: 'rtl', 
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: '4px',
//                               height: '32px'
//                             }
//                           }}
//                         />
//                       </Box>
//                     ) : (
//                       <ItemName variant="body2">
//                         {file.urlName.replace(/\.[^/.]+$/, '')}
//                       </ItemName>
//                     )}
//                   </ItemWrapper>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}
      
//       <AudioModal 
//         open={openAudioModal} 
//         onClose={() => setOpenAudioModal(false)} 
//         audioUrl={audioUrl} 
//       />
      
//       <AudioEditModal 
//         open={openAudioEditModal} 
//         onClose={() => setOpenAudioEditModal(false)} 
//         audioUrl={audioEditUrl}
//         fileName={audioEditFileName}
//       />
//     </Box>
//   );
// };

// export default FolderAndFileList;











// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Box, Typography, CircularProgress, Grid, TextField, IconButton } from '@mui/material';
// import { fetchRootFolders, fetchSubFoldersAndFiles, searchFiles, searchFolders, selectFoldersAndFiles, updateFile, updateFolder } from '../FileAndFolderStore/FilesSlice';
// import { AppDispatch } from '../FileAndFolderStore/FileStore';
// import { EmptyState, FileContainer, FileImage, FolderImage, FolderImageContainer, ItemName, ItemWrapper } from './FolderAndFileStyle';
// import LongMenu from './Menu';
// import CheckIcon from '@mui/icons-material/Check';
// import CloseIcon from '@mui/icons-material/Close';
// import FileMenu from './MenuFile';
// import Swal from 'sweetalert2';
// import AudioModal from './AudioModel';
// import api from '../FileAndFolderStore/Api';
// import AudioEditModal from './AudioEditorModal';
// import { Lesson } from '../../Modles/File';

// interface FolderAndFileListProps {
//   currentFolderId: number | null;
//   onFolderClick: (folderId: number, folderName: string) => void;
//   folderImagePath?: string;
//   fileImagePath?: string;
//   currentFolder: number | null; // עדכון לטיפוס Folder
//   isSearchMode?: boolean;
//   searchQuery?: string;
// }

// const FolderAndFileList: React.FC<FolderAndFileListProps> = ({
//   currentFolderId,
//   onFolderClick,
//   folderImagePath = '/f.png',
//   fileImagePath = '/e.png',
//   currentFolder,
//   isSearchMode = false,
//   searchQuery = ''
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const {
//     folders,
//     files,
//     searchFoldersResults,
//     searchFilesResults,
//     loading,
//     error
//   } = useSelector(selectFoldersAndFiles);

//   // מציג תיקיות וקבצים בהתאם למצב החיפוש
//   const displayFolders = isSearchMode ? searchFoldersResults : folders;
//   const displayFiles = isSearchMode ? searchFilesResults : files;

//   const storedUser = sessionStorage.getItem('User');
//   const user = storedUser ? JSON.parse(storedUser) : null;

//   const [_hoverFolderId, setHoverFolderId] = useState<number | null>(null);
//   const [_hoverFileId, setHoverFileId] = useState<number | null>(null);
//   const [editingFolderId, setEditingFolderId] = useState<number | null>(null);
//   const [newFolderName, setNewFolderName] = useState<string>('');
//   const [editingFileId, setEditingFileId] = useState<number | null>(null);
//   const [newFileName, setNewFileName] = useState<string>('');
//   const [openAudioModal, setOpenAudioModal] = useState<boolean>(false);
//   const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
//   // State חדש לעריכת שמע
//   const [openAudioEditModal, setOpenAudioEditModal] = useState<boolean>(false);
//   const [audioEditUrl, setAudioEditUrl] = useState<string | null>(null);
//   const [audioEditFileName, setAudioEditFileName] = useState<string>('');

//   useEffect(() => {
//     if (isSearchMode && searchQuery.trim() !== '') {
//       console.log("חיפוש עם הפרמטרים:", { 
//         userId: user?.id, 
//         currentFolderId, 
//         query: searchQuery 
//       });
      
//       // חיפוש תיקיות
//       dispatch(searchFolders({
//         userId: user?.id,
//         currentFolderId,
//         query: searchQuery,
//       }));
      
//       // חיפוש קבצים
//       dispatch(searchFiles({
//         userId: user?.id,
//         currentFolderId,
//         query: searchQuery,
//       }));
//     } else if (!isSearchMode) {
//       // טעינה רגילה של תיקיות וקבצים
//       if (currentFolderId === null) {
//         dispatch(fetchRootFolders(user?.id));
//       } else {
//         dispatch(fetchSubFoldersAndFiles({ parentFolderId: currentFolderId, ownerId: user?.id }));
//       }
//     }
//   }, [dispatch, currentFolderId, user?.id, isSearchMode, searchQuery]);

//   const handleFolderClick = (folderId: number, folderName: string) => {
//     // אם התיקייה במצב עריכה, לא נפעיל את הפעולה
//     if (editingFolderId === folderId) return;
//     onFolderClick(folderId, folderName);
//   };

//   const handleFileDownload = async (fileName: string) => {
//     try {
//       const a = document.createElement('a');
//       const downloadResponse = await api.get<string>(`/upload/download-url/${fileName}`);
//       a.href = downloadResponse.data;
//       a.download = fileName;
//       a.click();
//     } catch (error) {
//       console.error("שגיאה בהורדת קובץ:", error);
//       Swal.fire({
//         icon: 'error',
//         title: 'שגיאה בהורדת הקובץ',
//         text: 'אירעה שגיאה בעת ניסיון להוריד את הקובץ. נסה שנית.',
//         confirmButtonText: 'אישור'
//       });
//     }
//   };

//   // פונקציה להתחלת עריכת שם תיקייה
//   const startEditingFolder = (folderId: number, currentName: string) => {
//     setEditingFolderId(folderId);
//     setNewFolderName(currentName);
//   };

//   // פונקציה לשמירת שם תיקייה חדש
//   const saveNewFolderName = (id: number) => {
//     if (editingFolderId !== null && newFolderName.trim()) {
//       // בדיקה אם השם כבר קיים
//       const isNameTaken = folders.some(folder => 
//         folder.id !== id && folder.name === newFolderName.trim()
//       );
      
//       if (isNameTaken) {
//         Swal.fire({
//           icon: 'error',
//           title: 'שגיאה',
//           text: 'שם התיקייה כבר קיים!',
//           confirmButtonText: 'אישור'
//         });
//         return;
//       }
  
//       dispatch(updateFolder({ 
//         id, 
//         name: newFolderName.trim(), 
//         ownerId: user.id, 
//         parentFolderId: currentFolderId 
//       }))
//         .then(() => {
//           // רענון הרשימה לאחר עדכון השם
//           if (currentFolderId === null) {
//             dispatch(fetchRootFolders(user.id));
//           } else {
//             dispatch(fetchSubFoldersAndFiles({ parentFolderId: currentFolderId, ownerId: user.id }));
//           }
          
//           setEditingFolderId(null);
//           setNewFolderName('');
//         })
//         .catch((error) => {
//           console.error("שגיאה בעדכון שם התיקייה:", error);
//           Swal.fire({
//             icon: 'error',
//             title: 'שגיאה',
//             text: 'אירעה שגיאה בעת עדכון שם התיקייה',
//             confirmButtonText: 'אישור'
//           });
//         });
//     }
//   };
    
//   // פונקציה לביטול עריכת שם תיקייה
//   const cancelEditingFolder = () => {
//     setEditingFolderId(null);
//     setNewFolderName('');
//   };

//   // טיפול בלחיצת מקש בשדה העריכה של תיקייה
//   const handleFolderKeyDown = (e: React.KeyboardEvent, id: number) => {
//     if (e.key === 'Enter') {
//       saveNewFolderName(id);
//     } else if (e.key === 'Escape') {
//       cancelEditingFolder();
//     }
//   };

//   // פונקציה להתחלת עריכת שם קובץ
//   const handleFileEdit = (fileId: number) => {
//     const fileToEdit = files.find(file => file.id === fileId);
//     if (fileToEdit && fileToEdit.lessonName) {
//       setEditingFileId(fileId);
//       // הסר את סיומת הקובץ לפני הצגת השם
//       const fileNameWithoutExtension = fileToEdit.lessonName.replace(/\.[^/.]+$/, '');
//       setNewFileName(fileNameWithoutExtension);
//     }
//   };
  
//   // פונקציה לשמירת שם קובץ חדש
//   const saveNewFileName = (_fileId: number) => {
//     if (editingFileId !== null && newFileName.trim()) {
//       // קבלת הקובץ הנוכחי
//       const currentFile = files.find(f => f.id === editingFileId);
      
//       if (!currentFile) {
//         console.error("לא נמצא הקובץ לעריכה");
//         return;
//       }
      
//       // שמירת הסיומת המקורית של הקובץ
//       const fileExtension = currentFile.urlName && currentFile.urlName.includes('.') 
//         ? currentFile.urlName.substring(currentFile.urlName.lastIndexOf('.'))
//         : '';
        
//       // הוספת הסיומת לשם החדש אם צריך
//       const finalFileName = newFileName.includes('.') 
//         ? newFileName 
//         : newFileName + fileExtension;

//       dispatch(updateFile({
//         id: currentFile.id, 
//         lessonName: finalFileName,
//         folderId: currentFolderId, 
//         ownerId: user.id,
//         fileType: currentFile.fileType || '', 
//         url: currentFile.urlName || '',
//         isDeleted: currentFile.isDeleted
//       }))
//       .then(() => {
//         // רענון הרשימה לאחר עדכון השם
//         if (currentFolderId === null) {
//           dispatch(fetchRootFolders(user.id));
//         } else {
//           dispatch(fetchSubFoldersAndFiles({ parentFolderId: currentFolderId, ownerId: user.id }));
//         }
        
//         setEditingFileId(null);
//         setNewFileName('');
//       })
//       .catch((error) => {
//         console.error("שגיאה בעדכון שם הקובץ:", error);
//         Swal.fire({
//           icon: 'error',
//           title: 'שגיאה',
//           text: 'אירעה שגיאה בעת עדכון שם הקובץ',
//           confirmButtonText: 'אישור'
//         });
//       });
//     }
//   };
  
//   // פונקציה לביטול עריכת שם קובץ
//   const cancelEditingFile = () => {
//     setEditingFileId(null);
//     setNewFileName('');
//   };

//   // טיפול בלחיצת מקש בשדה העריכה של קובץ
//   const handleFileKeyDown = (e: React.KeyboardEvent, file: Lesson) => {
//     if (e.key === 'Enter') {
//       saveNewFileName(file.id);
//     } else if (e.key === 'Escape') {
//       cancelEditingFile();
//     }
//   };

//   // פונקציה להפעלת קובץ שמע
//   const handlePlayAudio = async (name: string) => {
//     try {
//       console.log("הפעלת שמע:", name);
      
//       const downloadResponse = await api.get<string>(`/upload/download-url/${name}`);
//       console.log("תשובה מהשרת:", downloadResponse);

//       if (downloadResponse && downloadResponse.data) {
//         setAudioUrl(downloadResponse.data);
//         setOpenAudioModal(true);
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'שגיאה',
//           text: 'לא ניתן להפעיל את קובץ השמע',
//           confirmButtonText: 'אישור'
//         });
//       }
//     } catch (error) {
//       console.error("שגיאה בהפעלת קובץ שמע:", error);
//       Swal.fire({
//         icon: 'error',
//         title: 'שגיאה',
//         text: 'אירעה שגיאה בעת ניסיון להפעיל את קובץ השמע',
//         confirmButtonText: 'אישור'
//       });
//     }
//   };

//   // פונקציה חדשה לפתיחת מודל עריכת שמע
//   const handleEditAudio = async (fileName: string) => {
//     try {
//       console.log("פתיחת עריכת שמע:", fileName);
      
//       const downloadResponse = await api.get<string>(`/upload/download-url/${fileName}`);
//       console.log("תשובה מהשרת לעריכת שמע:", downloadResponse);

//       if (downloadResponse && downloadResponse.data) {
//         setAudioEditUrl(downloadResponse.data);
//         setAudioEditFileName(fileName);
//         setOpenAudioEditModal(true);
//       } else {
//         Swal.fire({
//           icon: 'error',
//           title: 'שגיאה',
//           text: 'לא ניתן לפתוח את קובץ השמע לעריכה',
//           confirmButtonText: 'אישור'
//         });
//       }
//     } catch (error) {
//       console.error("שגיאה בפתיחת עריכת קובץ שמע:", error);
//       Swal.fire({
//         icon: 'error',
//         title: 'שגיאה',
//         text: 'אירעה שגיאה בעת ניסיון לפתוח את קובץ השמע לעריכה',
//         confirmButtonText: 'אישור'
//       });
//     }
//   };
  
//   // הצגת טעינה
//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // הצגת שגיאה
//   if (error) {
//     return (
//       <Box sx={{ p: 3, color: 'error.main' }}>
//         <Typography>{error}</Typography>
//       </Box>
//     );
//   }

//   // הודעה כאשר אין תיקיות וקבצים להצגה
//   if (displayFolders.length === 0 && displayFiles.length === 0) {
//     return (
//       <EmptyState>
//         {isSearchMode ? (
//           <Typography variant="body1" sx={{ mb: 1 }}>
//             לא נמצאו תוצאות עבור "{searchQuery}"
//           </Typography>
//         ) : (
//           <>
//             <Typography variant="body1" sx={{ mb: 1 }}>
//               התיקייה ריקה
//             </Typography>
//             <Typography variant="body2">
//               צור תיקייה חדשה או העלה קבצים כדי להתחיל
//             </Typography>
//           </>
//         )}
//       </EmptyState>
//     );
//   }

//   return (
//     <Box sx={{ p: 3 }}>
//       {displayFolders.length > 0 && (
//         <Box sx={{ mb: 4 }}>
//           <Typography variant="h6" sx={{ mb: 2 }}>תיקיות</Typography>
//           <Grid container spacing={2}>
//             {displayFolders.map((folder) => (
//               <Grid item xs={6} sm={4} md={3} lg={2} key={folder.id}>
//                 <Box
//                   sx={{ 
//                     position: 'relative', 
//                     '&:hover .menu-icon': { display: 'block' }
//                   }}
//                   onMouseEnter={() => setHoverFolderId(folder.id)}
//                   onMouseLeave={() => setHoverFolderId(null)}
//                 >
//                   <Box
//                     className="menu-icon"
//                     sx={{
//                       position: 'absolute',
//                       top: '5px',
//                       right: '5px',
//                       zIndex: 10,
//                       display: 'none'
//                     }}
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <LongMenu 
//                       id={folder.id} 
//                       onEdit={() => startEditingFolder(folder.id, folder.name || '')} 
//                       folder={folder} 
//                       currentFolder={currentFolder}
//                     />
//                   </Box>
//                   <ItemWrapper onClick={() => handleFolderClick(folder.id, folder.name || '')}>
//                     <FolderImageContainer>
//                       <FolderImage 
//                         src={folderImagePath} 
//                         alt="תיקייה" 
//                       />
//                     </FolderImageContainer>
//                     {editingFolderId === folder.id ? (
//                       <Box sx={{ 
//                         position: 'relative',
//                         width: '100%', 
//                         mt: 1
//                       }}>
//                         <Box sx={{ 
//                           position: 'absolute',
//                           top: -20,
//                           left: 0,
//                           display: 'flex',
//                           zIndex: 1
//                         }}>
//                           <IconButton
//                             size="small"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               saveNewFolderName(folder.id);
//                             }}
//                             color="primary"
//                             sx={{ padding: '2px' }}
//                           >
//                             <CheckIcon fontSize="small" />
//                           </IconButton>
//                           <IconButton
//                             size="small"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               cancelEditingFolder();
//                             }}
//                             color="error"
//                             sx={{ padding: '2px' }}
//                           >
//                             <CloseIcon fontSize="small" />
//                           </IconButton>
//                         </Box>
//                         <TextField
//                           value={newFolderName}
//                           onChange={(e) => setNewFolderName(e.target.value)}
//                           onKeyDown={(e) => handleFolderKeyDown(e, folder.id)}
//                           variant="outlined"
//                           size="small"
//                           autoFocus
//                           fullWidth
//                           onClick={(e) => e.stopPropagation()}
//                           sx={{ 
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: '4px',
//                               height: '32px'
//                             }
//                           }}
//                         />
//                       </Box>
//                     ) : (
//                       <ItemName variant="body2">{folder.name}</ItemName>
//                     )}
//                   </ItemWrapper>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}

//       {displayFiles.length > 0 && (
//         <Box>
//           <Typography variant="h6" sx={{ mb: 2 }}>קבצים</Typography>
//           <Grid container spacing={2}>
//             {displayFiles.map((file) => (
//               <Grid item xs={6} sm={4} md={3} lg={2} key={file.id}>
//                 <Box
//                   sx={{ 
//                     position: 'relative', 
//                     '&:hover .menu-icon': { display: 'block' }
//                   }}
//                   onMouseEnter={() => setHoverFileId(file.id)}
//                   onMouseLeave={() => setHoverFileId(null)}
//                 >
//                   <Box
//                     className="menu-icon"
//                     sx={{
//                       position: 'absolute',
//                       top: '5px',
//                       right: '5px',
//                       zIndex: 10,
//                       display: 'none'
//                     }}
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <FileMenu 
//                       id={file.id}
//                       onEdit={() => handleFileEdit(file.id)}
//                       onUpload={() => handleFileDownload(file.lessonName || '')}
//                       onPlayAudio={() => handlePlayAudio(file.lessonName || '')}
//                       onEditAudio={() => handleEditAudio(file.lessonName || '')}
//                       file={file}
//                       currentFolder={currentFolder}
//                     />
//                   </Box>
//                   <ItemWrapper>
//                     <FileContainer>
//                       <FileImage 
//                         src={fileImagePath} 
//                         alt={file.lessonName || 'קובץ'} 
//                       />
//                     </FileContainer>
//                     {editingFileId === file.id ? (
//                       <Box sx={{ 
//                         position: 'relative',
//                         width: '100%', 
//                         mt: 1
//                       }}>
//                         <Box sx={{ 
//                           position: 'absolute',
//                           top: -20,
//                           left: 0,
//                           display: 'flex',
//                           zIndex: 1
//                         }}>
//                           <IconButton
//                             size="small"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               saveNewFileName(file.id);
//                             }}
//                             color="primary"
//                             sx={{ padding: '2px' }}
//                           >
//                             <CheckIcon fontSize="small" />
//                           </IconButton>
//                           <IconButton
//                             size="small"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               cancelEditingFile();
//                             }}
//                             color="error"
//                             sx={{ padding: '2px' }}
//                           >
//                             <CloseIcon fontSize="small" />
//                           </IconButton>
//                         </Box>
//                         <TextField
//                           value={newFileName}
//                           onChange={(e) => setNewFileName(e.target.value)}
//                           onKeyDown={(e) => handleFileKeyDown(e, file)}
//                           variant="outlined"
//                           size="small"
//                           autoFocus
//                           fullWidth
//                           onClick={(e) => e.stopPropagation()}
//                           sx={{ 
//                             direction: 'rtl', 
//                             '& .MuiOutlinedInput-root': {
//                               borderRadius: '4px',
//                               height: '32px'
//                             }
//                           }}
//                         />
//                       </Box>
//                     ) : (
//                       <ItemName variant="body2">
//                         {file.urlName ? file.urlName.replace(/\.[^/.]+$/, '') : file.lessonName}
//                       </ItemName>
//                     )}
//                   </ItemWrapper>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       )}
      
//       <AudioModal 
//         open={openAudioModal} 
//         onClose={() => setOpenAudioModal(false)} 
//         audioUrl={audioUrl} 
//       />
      
//       <AudioEditModal 
//         open={openAudioEditModal} 
//         onClose={() => setOpenAudioEditModal(false)} 
//         audioUrl={audioEditUrl}
//         fileName={audioEditFileName}
//       />
//     </Box>
//   );
// };

// export default FolderAndFileList;