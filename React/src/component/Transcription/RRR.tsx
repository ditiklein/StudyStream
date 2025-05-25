import React, { useState, useRef } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  IconButton, 
  Tooltip, 
  Button,
  TextField,
  InputAdornment
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ContentEditable from 'react-contenteditable';

// הגדרת הטיפוסים
interface TranscriptInfo {
  id: number;
  transcriptUrl: string;
  lessonId: number;
  UserName?: string;
}



interface HighlightedTextProps {
  transcript: string;
  searchText: string;
}

interface TranscriptSectionProps {
  transcription: string;
  displayedTranscription: string;
  existingTranscript: TranscriptInfo | null;
  isTranscribing: boolean;
  isLoading: boolean;
  handleCopyToClipboard: () => void;
  handleDownload: () => void;
  handleOpenSaveDialog: () => void;
  handleStopTypingEffect: () => void;
  onTranscriptionUpdate?: (updatedTranscription: string) => void;
}

interface ContentEditableEvent {
  target: {
    value: string;
  };
}

// קומפוננטה להדגשת טקסט מחיפוש (עודכנה - ללא שדה חיפוש)
const HighlightedText: React.FC<HighlightedTextProps> = ({ transcript, searchText }) => {
  if (!transcript) return null;
  if (!searchText || searchText.trim() === '') return <>{transcript}</>;

  // חלוקת הטקסט לפי הביטוי המחופש עם שמירה על case insensitive
  const parts = transcript.split(new RegExp(`(${searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));

  return (
    <>
      {parts.map((part: string, index: number) => {
        // בדיקה האם החלק הנוכחי תואם לביטוי המחופש (case insensitive)
        const isMatch = part.toLowerCase() === searchText.toLowerCase();
        
        return isMatch ? (
          <mark key={index} style={{ backgroundColor: '#ffeb3b', color: 'black' }}>{part}</mark>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        );
      })}
    </>
  );
};

// קומפוננטה מורחבת שמשלבת את התמלול עם יכולת עריכה וחיפוש
const TranscriptSection: React.FC<TranscriptSectionProps> = ({ 
  transcription, 
  displayedTranscription, 
  existingTranscript, 
  isTranscribing, 
  isLoading,
  handleCopyToClipboard,
  handleDownload,
  handleOpenSaveDialog,
  handleStopTypingEffect,
  onTranscriptionUpdate,
}) => {
    
  const textAreaRef = useRef<HTMLDivElement>(null);
  const contentEditableRef = useRef<any>(null);
  
  // מצב עריכה - האם העורך פתוח כרגע
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // העתק של התמלול לעריכה
  const [editedTranscript, setEditedTranscript] = useState<string>('');
  
  // מצב חיפוש - הוספת חיפוש
  const [searchText, setSearchText] = useState<string>('');
  
  // פתיחת מצב עריכה
  const handleStartEditing = (): void => {
    setEditedTranscript(displayedTranscription || '');
    setIsEditing(true);
  };
  
  // שמירת השינויים מהעריכה
  const handleSaveEdits = (): void => {
    if (onTranscriptionUpdate) {
      onTranscriptionUpdate(editedTranscript);
    }
    setIsEditing(false);
  };
  
  // ביטול העריכה וחזרה למצב הקודם
  const handleCancelEditing = (): void => {
    setIsEditing(false);
  };
  
  // עדכון הטקסט המוצג בזמן עריכה
  const handleEditChange = (evt: ContentEditableEvent): void => {
    setEditedTranscript(evt.target.value);
  };

  // טיפול בשינוי בשדה החיפוש
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2 
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="medium">
          תוצאת התמלול
          {existingTranscript && (
            <Typography component="span" variant="caption" color="secondary.main" sx={{ ml: 1 }}>
              (נטען מהמערכת)
            </Typography>
          )}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* שדה חיפוש - הועבר לכאן */}
          {!isEditing && displayedTranscription && (
            <TextField
              placeholder="חיפוש בתמלול"
              size="small"
              value={searchText}
              onChange={handleSearchChange}
              variant="outlined"
              sx={{ 
                width: '180px',
                direction: 'rtl',
                '& .MuiOutlinedInput-root': {
                  height: '36px'
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          )}
          
          {/* כפתורי התצוגה המקוריים */}
          {displayedTranscription !== transcription && transcription && !isEditing && (
            <Tooltip title="הצג את כל התמלול">
              <Button
                size="small"
                onClick={handleStopTypingEffect}
                variant="outlined"
                sx={{ height: '36px' }}
              >
                הצג הכל
              </Button>
            </Tooltip>
          )}
          
          {/* כפתורי עריכה חדשים */}
          {!isEditing ? (
            // כפתורים במצב צפייה
            <>
              <Tooltip title="ערוך תמלול">
                <IconButton 
                  onClick={handleStartEditing}
                  disabled={!displayedTranscription}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="העתקה ללוח">
                <IconButton 
                  onClick={handleCopyToClipboard}
                  disabled={!transcription}
                  size="small"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="הורדת התמלול">
                <IconButton 
                  onClick={handleDownload}
                  disabled={!transcription}
                  size="small"
                >
                  <DownloadIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title={existingTranscript ? "התמלול כבר שמור במערכת" : "שמירת התמלול"}>
                <span>
                  <IconButton 
                    onClick={handleOpenSaveDialog}
                    disabled={!transcription || !!existingTranscript}
                    size="small"
                  >
                    <SaveIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </>
          ) : (
            // כפתורים במצב עריכה
            <>
              <Tooltip title="שמור שינויים">
                <IconButton onClick={handleSaveEdits} size="small">
                  <CheckIcon color="success" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="בטל עריכה">
                <IconButton onClick={handleCancelEditing} size="small">
                  <CloseIcon color="error" />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>
      
      <Paper
        ref={textAreaRef}
        sx={{
          flexGrow: 1,
          p: 2,
          borderRadius: 1,
          border: '1px solid',
          borderColor: isEditing ? 'primary.main' : 'divider',
          bgcolor: 'background.paper',
          overflow: 'auto',
          minHeight: '200px',
          maxHeight: '400px',
          position: 'relative',
          '&:hover': {
            borderColor: 'primary.light',
          },
          direction: 'rtl' // חשוב לטקסט בעברית
        }}
      >
        {!displayedTranscription && !isEditing ? (
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
        ) : isEditing ? (
          // מצב עריכה עם ContentEditable
          <ContentEditable
            innerRef={contentEditableRef}
            html={editedTranscript}
            onChange={handleEditChange}
            className="editable-transcript"
            style={{
              minHeight: '100%',
              outline: 'none',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.5'
            }}
          />
        ) : (
          // מצב צפייה עם הדגשת החיפוש
          <Typography 
            component="div" 
            variant="body1" 
            sx={{ 
              whiteSpace: 'pre-wrap',
              lineHeight: '1.5'
            }}
          >
            <HighlightedText transcript={displayedTranscription} searchText={searchText} />
          </Typography>
        )}
      </Paper>
      
      {/* סגנונות CSS נוספים */}
      <Box
        component="style"
        sx={{ display: 'none' }}
        dangerouslySetInnerHTML={{
          __html: `
            .editable-transcript:focus {
              outline: none !important;
            }
          `
        }}
      />
    </Box>
  );
};

export default TranscriptSection;