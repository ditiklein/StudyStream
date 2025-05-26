// import axios, { AxiosProgressEvent } from "axios";
// import { AppDispatch } from "./FileAndFolderStore/FileStore";
// import { addFile } from "./FileAndFolderStore/FilesSlice";
// import api from "./FileAndFolderStore/Api";

// export const handleConfirmation = async (
//   files: File[],
//   shouldUpload: boolean,
//   parentId: number | null,
//   dispatch: AppDispatch,
//   setUploadProgress: (progress: number) => void,
//   setIsDialogOpen: (open: boolean) => void,
//   setSelectedFiles: (files: File[]) => void,
//   descriptions: string[] // מערך של תיאורים לכל קובץ
// ) => {
//   const user = JSON.parse(sessionStorage.getItem('User') || 'null');    
//   if (files.length === 0) {
//     setIsDialogOpen(false);
//     return;
//   }

//   if (shouldUpload) {
//     try {
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         const description = descriptions[i] || '';
//         setUploadProgress(0);

//         // יצירת אובייקט DB לפני ההעלאה
//         const dbFile = {
//           lessonName: file.name,
//           description: description,
//           fileType: file.type,
//           folderId: parentId,
//           ownerId: user.id
//         };

//         const response = await api.get<{ url: string }>(
//           "/upload/presigned-url",
//           { params: { fileName: file.name } }
//         );

//         const presignedUrl = response.data.url;

//         await axios.put(presignedUrl, file, {
//           headers: { "Content-Type": file.type },
//           onUploadProgress: (progressEvent: AxiosProgressEvent) => {
//             const percent = Math.round(
//               (progressEvent.loaded * 100) / (progressEvent.total || 1)
//             );
//             setUploadProgress(percent);
//           },
//         });
        
//         // שימוש באובייקט DB לשליחה לשרת
//         dispatch(addFile(dbFile));
//       }
//       alert("העלאה הושלמה בהצלחה!");
//       setUploadProgress(0);
//       setIsDialogOpen(false);
//       setSelectedFiles([]);
//     } catch (error) {
//       console.error("שגיאה בהעלאה:", error);
//       alert("שגיאה בהעלאת הקבצים");
//     }
//   }
// };




import axios, { AxiosProgressEvent } from "axios";
import { AppDispatch } from "./FileAndFolderStore/FileStore";
import { addFile } from "./FileAndFolderStore/FilesSlice";
import api from "./FileAndFolderStore/Api";
import { CreateLessonRequest } from "../Modles/File";

export const handleConfirmation = async (
  files: File[],
  shouldUpload: boolean,
  parentId: number | null,
  dispatch: AppDispatch,
  setUploadProgress: (progress: number) => void,
  setIsDialogOpen: (open: boolean) => void,
  setSelectedFiles: (files: File[]) => void,
  descriptions: string[] // מערך של תיאורים לכל קובץ
) => {
  const user = JSON.parse(sessionStorage.getItem('User') || 'null');    
  if (files.length === 0) {
    setIsDialogOpen(false);
    return;
  }

  if (shouldUpload) {
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const description = descriptions[i] || '';
        setUploadProgress(0);

        // יצירת אובייקט DB מותאם לטיפוס CreateLessonRequest
        const dbFile: CreateLessonRequest = {
          lessonName: file.name,
          description: description,
          fileType: file.type,
          folderId: parentId,
          ownerId: user.id
        };

        const response = await api.get<{ url: string }>(
          "/upload/presigned-url",
          { params: { fileName: file.name } }
        );

        const presignedUrl = response.data.url;

        await axios.put(presignedUrl, file, {
          headers: { "Content-Type": file.type },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percent);
          },
        });
        
        // שימוש באובייקט DB מוטיפס לשליחה לשרת
        dispatch(addFile(dbFile));
      }
      alert("העלאה הושלמה בהצלחה!");
      setUploadProgress(0);
      setIsDialogOpen(false);
      setSelectedFiles([]);
    } catch (error) {
      console.error("שגיאה בהעלאה:", error);
      alert("שגיאה בהעלאת הקבצים");
    }
  }
};
