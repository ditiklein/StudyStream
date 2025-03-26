import axios, { AxiosProgressEvent } from "axios";
import { AppDispatch } from "./FileAndFolderStore/FileStore";
import { addFile } from "./FileAndFolderStore/FilesSlice";

export const handleConfirmation = async (
  files: File[],
  shouldUpload: boolean,
  parentId: number | null,
  dispatch: AppDispatch,
  setUploadProgress: (progress: number) => void,
  setIsDialogOpen: (open: boolean) => void,
  setSelectedFiles: (files: File[]) => void
) => {

  if (files.length === 0) {
    setIsDialogOpen(false);
    return;
  }

  if (shouldUpload) {
    try {
      for (const file of files) {
        setUploadProgress(0);

        const response = await axios.get<{ url: string }>(
          "https://localhost:7147/api/upload/presigned-url",
          
          { params: { fileName: file.name } }
        );

        const presignedUrl = response.data.url;

    const response1=    await axios.put(presignedUrl, file, {
          headers: { "Content-Type": file.type },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            setUploadProgress(percent);
          },
        });
        console.log(response1,"hgfdfgh");
        

        const downloadResponse = await axios.get<string>(
          `https://localhost:7147/api/upload/download-url/${file.name}`
        );
        const downloadUrl = downloadResponse.data;

        dispatch(
          addFile({
            lessonName: file.name,
            ownerId: 3,
            fileType: file.type,
            url: downloadUrl,
            folderId: parentId,
          })
        );
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
// export const handleConfirmation = (
//     selectedFiles, 
//     confirmed, 
//     parentId, 
//     dispatch, 
//     setUploadProgress, 
//     setShowFileDialog, 
//     setFiles,
//     onSave = null,  // פרמטר חדש עבור callback של שמירת הקלטה
//     lessonName = ""  // שם השיעור עבור הקלטות
//   ) => {
//     if (confirmed && selectedFiles.length > 0) {
//       // אם זוהי הקלטה והועבר callback של onSave, מפעיל אותו
//       if (onSave && selectedFiles[0].type.includes('audio')) {
//         onSave(selectedFiles[0], lessonName);
//       }
      
//       // מתחיל את העלאת הקבצים
//       setUploadProgress(1);
      
//       const uploadFiles = async () => {
//         try {
//           // לולאה להעלאת כל הקבצים
//           for (let i = 0; i < selectedFiles.length; i++) {
//             const file = selectedFiles[i];
//             const formData = new FormData();
//             formData.append('file', file);
//             formData.append('parentId', parentId?.toString() || 'null');
//             formData.append('fileName', file.name);
            
//             // סימולציה של התקדמות העלאה
//             const simulateProgress = () => {
//               let progress = 1;
//               const interval = setInterval(() => {
//                 progress += Math.floor(Math.random() * 10);
//                 if (progress > 99) {
//                   clearInterval(interval);
//                   progress = 100;
//                 }
//                 setUploadProgress(progress);
//               }, 200);
//               return interval;
//             };
            
//             const progressInterval = simulateProgress();
            
//             // קריאה ל-API להעלאת הקובץ
//             try {
//               // כאן יש להחליף עם קריאת fetch אמיתית לשרת
//               // const response = await fetch('/api/files/upload', { 
//               //   method: 'POST', 
//               //   body: formData 
//               // });
              
//               // סימולציה של תגובת שרת
//               await new Promise(resolve => setTimeout(resolve, 2000));
//               clearInterval(progressInterval);
//               setUploadProgress(100);
              
//               // סימולציה של המתנה לעדכון ה-UI לפני המשך
//               setTimeout(() => {
//                 // אפשר להוסיף כאן dispatch לעדכון הסטור אם נדרש
//                 if (dispatch) {
//                   // dispatch(addFile({ file, parentId }));
//                 }
                
//                 // אם זה הקובץ האחרון, מסיים את התהליך
//                 if (i === selectedFiles.length - 1) {
//                   setUploadProgress(0);
//                   setShowFileDialog(false);
//                   setFiles([]);
//                 }
//               }, 500);
              
//             } catch (error) {
//               console.error('שגיאה בהעלאת קובץ:', error);
//               clearInterval(progressInterval);
//               setUploadProgress(0);
//             }
//           }
//         } catch (error) {
//           console.error('שגיאה כללית בתהליך העלאה:', error);
//           setUploadProgress(0);
//         }
//       };
      
//       uploadFiles();
//     } else if (!confirmed) {
//       // אם המשתמש ביטל, סוגר את הדיאלוג ומנקה את הקבצים
//       setShowFileDialog(false);
//       setFiles([]);
//     }
//   };
  