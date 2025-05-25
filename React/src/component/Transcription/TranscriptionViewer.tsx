import { Button, Box, Typography, CircularProgress, Paper,Divider,IconButton,Tooltip,Alert,
 
} from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TranscriptSection from './RRR';
import api from '../FileAndFolderStore/Api';
import SaveTranscriptDialog from './SaveTranscriptDialog';

interface TranscriptionViewerProps {
  selectedRecording: any | null;
  currentUserId?: number; // אופציונלי - מזהה המשתמש הנוכחי
}

// ממשק לתמלול במסד הנתונים
interface TranscriptInfo {
  id: number;
  transcriptUrl: string;
  lessonId: number;
}


const TranscriptionViewer: React.FC<TranscriptionViewerProps> = ({ 
      selectedRecording,
}) => {

  const [transcription, setTranscription] = useState('');
  const [displayedTranscription, setDisplayedTranscription] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'info' | 'success' | 'error', text: string } | null>(null);
  const [_NameMw, _setNameMw] = useState('');
  const [wasUploadedToS3, setWasUploadedToS3] = useState(false);

  // מצב עבור מודל השמירה
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [transcriptName, setTranscriptName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // מצב לשמירת מידע על תמלול קיים
  const [existingTranscript, setExistingTranscript] = useState<TranscriptInfo | null>(null);
  
  const typingEffectRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // כשמשתנה ההקלטה שנבחרה מהסיידבר
    if (selectedRecording) {
      // איפוס מצבים
      setTranscription('');
      setDisplayedTranscription('');
      setSelectedFile(null);
      setStatusMessage(null);
      setExistingTranscript(null);
      setWasUploadedToS3(false);
      
      checkForExistingTranscript(selectedRecording.id);
    }
  }, [selectedRecording]);

  // בדיקה אם קיים תמלול במסד הנתונים
  const checkForExistingTranscript = async (lessonId: number) => {
    try {
      setIsLoading(true);
      setStatusMessage({ type: 'info', text: 'בודק אם קיים תמלול...' });
      
      // שליחת בקשה לAPI כדי לבדוק אם קיים תמלול עבור השיעור הזה
      const response = await fetch(`http://localhost:5220/api/Transcript/lesson/${lessonId}`);
      console.log("ok");
      
      if (response.ok) {
        const transcriptInfo = await response.json();
        setTranscriptName(transcriptInfo.transcriptUrl)

        console.log(transcriptInfo);

        if (transcriptInfo && transcriptInfo.transcriptUrl) {
          // נמצא תמלול קיים!
          console.log("transcriptInfo");

          setExistingTranscript(transcriptInfo);
          setStatusMessage({ type: 'success', text: 'נמצא תמלול קיים, מוריד...' });
          
          // הורדת התמלול מ-S3
          await fetchTranscriptFromS3(transcriptInfo.transcriptUrl);
        } else {
          // לא נמצא תמלול
          setStatusMessage({ type: 'info', text: 'לא נמצא תמלול קיים, יש לבצע תמלול' });
        }
      } else if (response.status === 404) {
        // לא נמצא תמלול
        setStatusMessage({ type: 'info', text: 'לא נמצא תמלול קיים, יש לבצע תמלול' });
      } else {
        // שגיאה אחרת
        console.error("Error checking for transcript:", await response.text());
        setStatusMessage({ type: 'error', text: 'שגיאה בבדיקת קיום תמלול' });
      }
    } catch (error) {
      console.error("Error checking for transcript:", error);
      setStatusMessage({ type: 'error', text: 'שגיאה בבדיקת קיום תמלול' });
    } finally {
      setIsLoading(false);
    }
  };

  // הורדת תמלול מ-S3
  const fetchTranscriptFromS3 = async (transcriptUrl: string) => {
    console.log("o",transcriptUrl);
    
    try {
      setIsLoading(true);
      // קבלת URL חתומה להורדה
      const presignedResponse = await fetch(`http://localhost:5220/api/upload/download-url/${transcriptUrl}`);
      
      if (!presignedResponse.ok) {
        throw new Error("Failed to get download URL");
      }
      
      // השרת מחזיר ישירות את ה-URL כמחרוזת, לא כ-JSON
      const downloadUrl = await presignedResponse.text();
      console.log("Download URL:", downloadUrl);
      
      // הורדת התמלול מהשרת
      const transcriptResponse = await fetch(downloadUrl);
      
      if (!transcriptResponse.ok) {
        throw new Error("Failed to download transcript");
      }
      
      // קריאת הטקסט של התמלול
      const transcriptText = await transcriptResponse.text();
      
      // עדכון מצב עם התמלול שהורד
      setTranscription(transcriptText);
      setWasUploadedToS3(true);
      setStatusMessage({ type: 'success', text: 'התמלול הקיים הורד בהצלחה' });
    } catch (error) {
      console.error("Error fetching transcript from S3:", error);
      setStatusMessage({ type: 'error', text: 'שגיאה בהורדת התמלול הקיים' });
    } finally {
      setIsLoading(false);
    }
  };
  
  // אפקט הקלדה
  useEffect(() => {
    // נקה טיימר קודם אם קיים
    if (typingEffectRef.current) {
      clearTimeout(typingEffectRef.current);
    }

    // אם יש תמלול, הפעל את אפקט ההקלדה
    if (transcription) {
      let currentIndex = 0;
      
      const typeNextChar = () => {
        if (currentIndex <= transcription.length) {
          setDisplayedTranscription(transcription.substring(0, currentIndex));
          currentIndex++;
          
          // מהירות ההקלדה - ניתן לשנות את המספר כדי להאיץ או להאט
          const typingSpeed = 15; // במילישניות
          
          typingEffectRef.current = setTimeout(typeNextChar, typingSpeed);
        }
      };
      
      typeNextChar();
    }
    
    // ניקוי בעת unmount
    return () => {
      if (typingEffectRef.current) {
        clearTimeout(typingEffectRef.current);
      }
    };
  }, [transcription]);

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     setSelectedFile(file);
  //     // איפוס התמלול כאשר נבחר קובץ חדש
  //     setTranscription('');
  //     setDisplayedTranscription('');
  //     setWasUploadedToS3(false);
  //     setStatusMessage({ type: 'info', text: `נבחר הקובץ: ${file.name}` });
      
  //     // קביעת שם ברירת מחדל לתמלול בהתבסס על שם הקובץ
  //     const defaultName = file.name.split('.')[0] + '_transcript';
  //     setNameMw(defaultName);
  //   }
  // };

  const handleTranscription = async () => {
    // אם בחרנו הקלטה מהסיידבר ויש כבר תמלול שהורדנו
    if (selectedRecording && existingTranscript && transcription) {
      setStatusMessage({ type: 'info', text: 'כבר הורדנו את התמלול הקיים' });
      return;
    }
    
    setIsTranscribing(true);
    setStatusMessage({ type: 'info', text: 'התמלול מתבצע...' });
    setTranscription(''); // נקה תמלול קודם
    setDisplayedTranscription('');
    setWasUploadedToS3(false);
    
    try {
      let fileToSend;
      // אם בחרנו הקלטה מהסיידבר
      if (selectedRecording) {
        console.log("מנסה להוריד קובץ:", selectedRecording.urlName);
        
        try {
          // קבל את ה-URL ישירות מהשרת
          const urlResponse = await api.get(`/upload/download-url/${selectedRecording.urlName}`);
          const downloadUrl = urlResponse.data;
          
          console.log("קיבלנו URL להורדה:", downloadUrl);
          
          // עכשיו השתמש ב-URL להורדת הקובץ עצמו
          const downloadResponse = await fetch(downloadUrl);
          
          if (!downloadResponse.ok) {
            throw new Error(`שגיאה בהורדת הקובץ: ${downloadResponse.status} ${downloadResponse.statusText}`);
          }
          
          let blob = await downloadResponse.blob();
          console.log("גודל ה-blob:", blob.size, "סוג:", blob.type);
          
          // וידוא שקיבלנו קובץ אודיו
          if (!blob.type.startsWith('audio/')) {
            console.warn("סוג הקובץ אינו אודיו:", blob.type);
            // אם הסוג לא מוגדר, ננסה לקבוע אותו לפי סיומת הקובץ
            const extension = selectedRecording.lessonName.split('.').pop().toLowerCase();
            let mimeType = 'audio/mpeg';  // ברירת מחדל
            
            if (extension === 'wav') mimeType = 'audio/wav';
            else if (extension === 'ogg') mimeType = 'audio/ogg';
            else if (extension === 'm4a') mimeType = 'audio/mp4';
            else if (extension === 'flac') mimeType = 'audio/flac';
            
            // יצירת blob חדש עם הסוג הנכון
            blob = new Blob([blob], { type: mimeType });
          }
  
          // נוודא שיש שם קובץ תקין עם סיומת
          let fileName = selectedRecording.lessonName;
          if (!fileName.includes('.')) {
            // אם אין סיומת, נוסיף לפי סוג הקובץ
            const fileType = blob.type.split('/')[1];
            fileName += `.${fileType === 'mpeg' ? 'mp3' : fileType}`;
          }
          
          // יצירת אובייקט File מה-Blob שהתקבל
          fileToSend = new File(
            [blob], 
            fileName, 
            { type: blob.type }
          );
          
          console.log("קובץ מוכן לשליחה:", fileToSend.name, fileToSend.type, fileToSend.size);
        } catch (err:any) {
          console.error("שגיאה בהורדת הקובץ מהשרת:", err);
          setIsTranscribing(false);
          setStatusMessage({ type: 'error', text: `שגיאה בהורדת הקובץ: ${err.message}` });
          return;
        }
      } else {
        setIsTranscribing(false);
        setStatusMessage({ type: 'error', text: 'בחר קובץ שמע לתמלול' });
        return;
      }
  
      if (!fileToSend || fileToSend.size < 1000) {  // קובץ אודיו אמיתי צריך להיות לפחות 1KB
        setIsTranscribing(false);
        setStatusMessage({ type: 'error', text: 'לא הצלחנו לקבל את קובץ השמע או שהקובץ קטן מדי' });
        return;
      }
      
      // שליחת הקובץ לתמלול
      const formData = new FormData();
      formData.append("file", fileToSend);
      
      console.log("שולח לתמלול:", fileToSend);
      console.log("סוג הקובץ:", fileToSend.type);
      console.log("גודל הקובץ:", fileToSend.size, "בייטים");
  
      const response = await fetch("http://localhost:5220/api/transcription/transcribe-full", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        // קבלת התמלול המלא
        setTranscription(result.text);
        setIsTranscribing(false);
        setStatusMessage({ type: 'success', text: 'התמלול הושלם בהצלחה' });
      } else {
        const errorText = await response.text();
        setIsTranscribing(false);
        setStatusMessage({ type: 'error', text: `שגיאה בבקשת התמלול: ${errorText || response.statusText}` });
        console.error("שגיאה בבקשת התמלול:", errorText);
      }
    } catch (error:any) {
      setIsTranscribing(false);
      setStatusMessage({ type: 'error', text: `שגיאה בתמלול: ${error.message}` });
      console.error("שגיאה בתמלול:", error);
    }
  };

  const handleDownload = () => {
    if (!transcription) {
      setStatusMessage({ type: 'error', text: 'אין תמלול להורדה' });
      return;
    }
    
    const element = document.createElement("a");
    const file = new Blob([transcription], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    
    // שם הקובץ יהיה שם ההקלטה אם קיים, אחרת שם כללי
    const fileName = selectedRecording 
      ? selectedRecording.lessonName.split('.')[0] + '_transcript.txt'
      : selectedFile 
        ? selectedFile.name.split('.')[0] + '_transcript.txt'
        : 'transcript.txt';
    
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    setStatusMessage({ type: 'success', text: 'התמלול הורד בהצלחה' });
  };

  const handleCopyToClipboard = () => {
    if (!transcription) {
      setStatusMessage({ type: 'error', text: 'אין תמלול להעתקה' });
      return;
    }
    
    navigator.clipboard.writeText(transcription)
      .then(() => {
        setStatusMessage({ type: 'success', text: 'התמלול הועתק ללוח' });
      })
      .catch(err => {
        console.error('שגיאה בהעתקה ללוח:', err);
        setStatusMessage({ type: 'error', text: 'שגיאה בהעתקה ללוח' });
      });
  };

  // עדכון התמלול (לאחר עריכה)
  const handleTranscriptionUpdate = async (updatedTranscription: string) => {
    console.log("transcriptName1111",transcriptName);

    // עדכון המצב המקומי
    setTranscription(updatedTranscription);
    setDisplayedTranscription(updatedTranscription);

    // אם התמלול טרם הועלה ל-S3 וקיים שם קובץ נוכחי (למקרה שמישהו מסמן את הפרמטר השני כ-false בטעות)
    if (existingTranscript) {
      try {
        // העלאת התמלול המעודכן ל-S3
        const uploadResult = await uploadTranscriptToS3(transcriptName, updatedTranscription);
        
        if (uploadResult) {
          setWasUploadedToS3(true);
          setStatusMessage({ type: 'success', text: 'התמלול עודכן ונשמר בהצלחה במערכת' });
        } else {
          setStatusMessage({ type: 'error', text: 'התמלול עודכן מקומית, אך שמירתו במערכת נכשלה' });
        }
      } catch (error) {
        console.error("Error uploading updated transcript to S3:", error);
        setStatusMessage({ type: 'error', text: 'התמלול עודכן מקומית, אך שמירתו במערכת נכשלה' });
      }
    } else {
      // אם התמלול כבר הועלה ל-S3 או שאין שם קובץ נוכחי
      setStatusMessage({ 
        type: 'success', 
        text: wasUploadedToS3 ? 'התמלול עודכן ונשמר בהצלחה' : 'התמלול עודכן בהצלחה' 
      });
    }
  };

  // הפסקת אפקט ההקלדה
  const handleStopTypingEffect = () => {
    if (typingEffectRef.current) {
      clearTimeout(typingEffectRef.current);
      setDisplayedTranscription(transcription);
    }
  };

  // פתיחת מודל השמירה
  const handleOpenSaveDialog = () => {
    if (!transcription) {
      setStatusMessage({ type: 'error', text: 'אין תמלול לשמירה' });
      return;
    }
    
    // אם כבר יש תמלול שהורדנו, אין צורך לשמור אותו שנית
    if (existingTranscript) {
      setStatusMessage({ type: 'info', text: 'התמלול כבר קיים במערכת' });
      return;
    }
    
    setSaveDialogOpen(true);
  };

  // העלאת התמלול ל-S3
  async function uploadTranscriptToS3(fileName: string, content: string): Promise<string | null> {
    try {
      // שלב 1: בקשת כתובת חתומה
      const presignedResponse = await fetch(`http://localhost:5220/api/upload/presigned-url?fileName=${fileName}`);
      console.log("hhhhh",fileName,content);
      
      if (!presignedResponse.ok) {
        throw new Error("Failed to get presigned URL");
      }
      
      const { url } = await presignedResponse.json();
  
      // שלב 2: העלאה ישירה ל־S3
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "text/plain",
        },
        body: content,
      });
  
      if (!response.ok) throw new Error("Upload failed");
  
      return fileName; // השם ישמש כדי לבקש כתובת הורדה
    } catch (err) {
      console.error("Error uploading transcript:", err);
      return null;
    }
  }

  // שמירת כתובת התמלול במסד הנתונים
  async function saveTranscriptUrlToDb(fileName: string, name: string) {
    try {
      if (!selectedRecording) {
        throw new Error("No recording selected");
      }
      
      const lessonId = selectedRecording.id;
  
      const transcript = {
        transcriptUrl: fileName,
        lessonId,
        UserName: name
      };
  
      const dbResponse = await fetch("http://localhost:5220/api/Transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transcript),
      });
      
      if (!dbResponse.ok) {
        throw new Error("Failed to save transcript to database");
      }
      
      // שמירת המידע על התמלול שנוצר
      const savedTranscript = await dbResponse.json();
      setExistingTranscript(savedTranscript);
      
      return true;
    } catch (err) {
      console.error("Error saving transcript URL to DB:", err);
      return false;
    }
  }
  
  // שמירת התמלול
  const handleSaveTranscript = async (name: string) => {
    if (!transcription) {
      setIsSaving(false);
      setStatusMessage({ type: 'error', text: 'אין תמלול לשמירה' });
      return;
    }
    
    try {
      setIsSaving(true);
      setSaveDialogOpen(false);
      
      // יצירת שם קובץ ייחודי עבור S3
      const fileExtension = ".txt";
      const uniqueFileName = `transcript_${Date.now()}${fileExtension}`;
      setTranscriptName(uniqueFileName);
      
      // שמירה ב-S3
      const uploadedFile = await uploadTranscriptToS3(uniqueFileName, transcription);
      if (!uploadedFile) {
        throw new Error("Failed to upload file to S3");
      }
      
      // שמירה במסד הנתונים
      const saved = await saveTranscriptUrlToDb(uploadedFile, name);
      
      if (!saved) {
        throw new Error("Failed to save transcript info to database");
      }
      
      setWasUploadedToS3(true);
      setStatusMessage({ type: 'success', text: 'התמלול נשמר בהצלחה' });
      setSaveDialogOpen(false);
    } catch (error) {
      console.error("Error in save process:", error);
      setStatusMessage({ type: 'error', text: 'שגיאה בשמירת התמלול' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      gap: 2,
    }}>
      <Box sx={{ 
        display: 'flex', 
        gap: 1 
      }}>
        {existingTranscript ? (
          <Button
            variant="contained"
            color="secondary"
            disabled={isLoading || !transcription}
            sx={{ minWidth: '120px' }}
          >
            כבר קיים תמלול
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={isTranscribing || isLoading ? 
              <CircularProgress size={20} color="inherit" /> : 
              <PlayArrowIcon />}
            onClick={handleTranscription}
            disabled={isTranscribing || isLoading || (!selectedFile && !selectedRecording)}
            sx={{ minWidth: '120px' }}
          >
            {isTranscribing ? 'מתמלל...' : isLoading ? 'טוען...' : 'התחל תמלול'}
          </Button>
        )}
        
        <Tooltip title="מידע: ודא שהקובץ הוא קובץ שמע בפורמט נתמך">
          <IconButton>
            <InfoIcon color="action" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {/* הודעת סטטוס */}
      {statusMessage && (
        <Alert 
          severity={statusMessage.type} 
          onClose={() => setStatusMessage(null)} 
          sx={{ mb: 1 }}
        >
          {statusMessage.text}
        </Alert>
      )}
      
      <Divider />
      
      {/* אזור התמלול העיקרי - השתמש בקומפוננטת TranscriptSection החדשה */}
      {displayedTranscription ? (
        <TranscriptSection
          transcription={transcription}
          displayedTranscription={displayedTranscription}
          existingTranscript={existingTranscript}
          isTranscribing={isTranscribing}
          isLoading={isLoading}
          handleCopyToClipboard={handleCopyToClipboard}
          handleDownload={handleDownload}
          handleOpenSaveDialog={handleOpenSaveDialog}
          handleStopTypingEffect={handleStopTypingEffect}
          onTranscriptionUpdate={handleTranscriptionUpdate}
        />
      ) : (
        <Box sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2 
        }}>
          <Typography variant="h6" fontWeight="medium">
            תוצאת התמלול
          </Typography>
          
          <Paper
            sx={{
              flexGrow: 1,
              p: 2,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              overflow: 'auto',
              minHeight: '200px',
              maxHeight: '400px',
              position: 'relative',
              '&:hover': {
                borderColor: 'primary.light',
              }
            }}
          >
            <Typography 
              variant="body2" 
              color="text.secondary" 
              sx={{ 
                position: 'absolute', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              {isTranscribing ? 'מתמלל...' : 
              isLoading ? 'טוען תמלול...' : 
              'התמלול יוצג כאן לאחר הפעלת התמלול או בחירת הקלטה עם תמלול קיים'}
            </Typography>
          </Paper>
        </Box>
      )}

      {/* מודל שמירת התמלול */}
      <SaveTranscriptDialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        onSave={handleSaveTranscript}
        isLoading={isSaving}
        defaultName="" // אפשר לתת כאן שם ברירת מחדל אם יש צורך
      />
    </Box>
  );
};

export default TranscriptionViewer;