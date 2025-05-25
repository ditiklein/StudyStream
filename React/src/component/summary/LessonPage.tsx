
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Paper,
  Container
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EventNoteIcon from "@mui/icons-material/EventNote";
import SummarizeIcon from "@mui/icons-material/Summarize";
import FeaturedPlayListIcon from "@mui/icons-material/FeaturedPlayList";
import ShowKeyPoints from "./ShowKeyPoints";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../FileAndFolderStore/FileStore";
import { fetchUserFiles, selectFoldersAndFiles } from "../FileAndFolderStore/FilesSlice";
import {
  fetchTranscriptByLessonId,
  fetchTranscriptTextFromS3,
  selectTranscript
} from "../FileAndFolderStore/TranscriptSlice";
import {
  extractKeyPoints,
  summarizeLesson,
  selectKeyPoints,
  clearKeyPointsState
} from "../FileAndFolderStore/KeyPointsSlice";
import NoTranscriptDialog from "./NoTranscriptionDialog";
import ShowSummary from "./summaryPage";

const LessonsPage = () => {
  const storedUser = sessionStorage.getItem("User");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const dispatch = useDispatch<AppDispatch>();
  const { allUserFiles, loading: filesLoading } = useSelector(selectFoldersAndFiles);
  const { } = useSelector(selectKeyPoints);
  const {} = useSelector(selectTranscript);

  const [showNoTranscriptDialog, setShowNoTranscriptDialog] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState<{ [id: number]: boolean }>({});
  const [lessonsWithTranscript, setLessonsWithTranscript] = useState<{ [id: number]: boolean }>({});

  const [transcriptText, setTranscriptText] = useState<string | null>(null);
  const [keyPointsText, setKeyPointsText] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [activeDialog, setActiveDialog] = useState<'summary' | 'keyPoints' | null>(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserFiles(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    // Cleanup state when component unmounts
    return () => {
      dispatch(clearKeyPointsState());
    };
  }, [dispatch]);

  const handleSummaryClick = async (lesson: any) => {
    try {
      setLoadingLessons(prev => ({ ...prev, [lesson.id]: true }));
      
      const resultAction = await dispatch(fetchTranscriptByLessonId(lesson.id));
      const data = (resultAction as any).payload;
      const transcriptUrl = data?.transcriptUrl;
  
      if (!transcriptUrl) {
        setShowNoTranscriptDialog(true);
        setLoadingLessons(prev => ({ ...prev, [lesson.id]: false }));
        return;
      }
  
      const fetchTextAction = await dispatch(fetchTranscriptTextFromS3(transcriptUrl));
      const text = fetchTextAction.payload as string;
      
      // Generate summary
      const summaryAction = await dispatch(summarizeLesson(text));
      const summary = summaryAction.payload as string;
  
      setTranscriptText(summary);
      setSelectedLesson(lesson);
      setActiveDialog('summary');
      
      // Mark this lesson as having a transcript
      setLessonsWithTranscript(prev => ({ ...prev, [lesson.id]: true }));
    } catch (err) {
      setShowNoTranscriptDialog(true);
    } finally {
      setLoadingLessons(prev => ({ ...prev, [lesson.id]: false }));
    }
  };

  const handleKeyPointsClick = async (lesson: any) => {
    try {
      setLoadingLessons(prev => ({ ...prev, [lesson.id]: true }));
      
      // Check if we already know this lesson has a transcript
      if (!lessonsWithTranscript[lesson.id]) {
        const resultAction = await dispatch(fetchTranscriptByLessonId(lesson.id));
        const data = (resultAction as any).payload;
        const transcriptUrl = data?.transcriptUrl;
    
        if (!transcriptUrl) {
          setShowNoTranscriptDialog(true);
          setLoadingLessons(prev => ({ ...prev, [lesson.id]: false }));
          return;
        }
    
        const fetchTextAction = await dispatch(fetchTranscriptTextFromS3(transcriptUrl));
        const text = fetchTextAction.payload as string;
        
        // Extract key points
        const keyPointsAction = await dispatch(extractKeyPoints(text));
        const keyPoints = keyPointsAction.payload as string;
    
        setKeyPointsText(keyPoints);
        setSelectedLesson(lesson);
        setActiveDialog('keyPoints');
        
        // Mark this lesson as having a transcript
        setLessonsWithTranscript(prev => ({ ...prev, [lesson.id]: true }));
      } else {
        // We already know there's a transcript, fetch it directly
        const resultAction = await dispatch(fetchTranscriptByLessonId(lesson.id));
        const data = (resultAction as any).payload;
        const transcriptUrl = data?.transcriptUrl;
        
        const fetchTextAction = await dispatch(fetchTranscriptTextFromS3(transcriptUrl));
        const text = fetchTextAction.payload as string;
        
        // Extract key points
        const keyPointsAction = await dispatch(extractKeyPoints(text));
        const keyPoints = keyPointsAction.payload as string;
    
        setKeyPointsText(keyPoints);
        setSelectedLesson(lesson);
        setActiveDialog('keyPoints');
      }
    } catch (err) {
      setShowNoTranscriptDialog(true);
    } finally {
      setLoadingLessons(prev => ({ ...prev, [lesson.id]: false }));
    }
  };

  const handleCloseDialogs = () => {
    setSelectedLesson(null);
    setTranscriptText(null);
    setKeyPointsText(null);
    setActiveDialog(null);
  };

  const handleDownload = (content: string | null, filename: string) => {
    if (!content) return;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  return (
    <Container maxWidth="xl">
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
            borderRadius: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SchoolIcon sx={{ fontSize: 40, color: '#4361ee' }} />
            <Typography variant="h3" fontWeight="bold">השיעורים שלי</Typography>
          </Box>
          <Typography variant="body1" sx={{ mb: 2, maxWidth: '70%' }}>
            כל השיעורים שלך במקום אחד. לחץ על "סיכום" או "נקודות חשובות" כדי לראות תוכן מעובד של השיעור.
          </Typography>
          <Box sx={{ height: 4, background: "linear-gradient(to right, #f72585, #4361ee)", mt: 2, borderRadius: 5 }} />
        </Paper>

        {filesLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {allUserFiles.length === 0 ? (
              <Box sx={{ width: '100%', textAlign: 'center', p: 4 }}>
                <Typography variant="h6">לא נמצאו שיעורים</Typography>
                <Typography variant="body2" color="text.secondary">
                  אין שיעורים זמינים כרגע
                </Typography>
              </Box>
            ) : (
              allUserFiles.map((lesson) => (
                <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                  <Card 
                    sx={{ 
                      borderRadius: 3, 
                      boxShadow: 3, 
                      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6
                      },
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, backgroundColor: '#4361ee15', p: 1.5, borderRadius: 2, borderLeft: '4px solid #4361ee' }}>
                        <EventNoteIcon sx={{ mr: 1, color: '#4361ee' }} />
                        <Typography variant="h6" fontWeight="bold" sx={{ color: '#1a237e' }}>{lesson.lessonName.split('.').slice(0, -1).join('.')}</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {lesson.description || "אין תיאור זמין לשיעור זה"}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Chip 
                          size="small" 
                          label={`שיעור ${lesson.id}`} 
                          sx={{ mr: 1, bgcolor: '#e9ecef' }} 
                        />
                        {lesson.tags?.map((tag: string, index: number) => (
                          <Chip 
                            key={index} 
                            size="small" 
                            label={tag} 
                            sx={{ mr: 1, bgcolor: '#4361ee20' }} 
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "flex-end", p: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={loadingLessons[lesson.id]}
                        onClick={() => handleKeyPointsClick(lesson)}
                        startIcon={<FeaturedPlayListIcon />}
                        sx={{ 
                          borderRadius: 2,
                          boxShadow: 1
                        }}
                      >
                        {loadingLessons[lesson.id] && activeDialog === 'keyPoints' ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : "נקודות חשובות"}
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        disabled={loadingLessons[lesson.id]}
                        onClick={() => handleSummaryClick(lesson)}
                        startIcon={<SummarizeIcon />}
                        sx={{ 
                          borderRadius: 2,
                          boxShadow: 1,
                          ml: 1
                        }}
                      >
                        {loadingLessons[lesson.id] && activeDialog === 'summary' ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : "סיכום"}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Box>

      {selectedLesson && transcriptText && activeDialog === 'summary' && (
        <ShowSummary
          summaryText={transcriptText}
          lessonName={selectedLesson.lessonName}
          onClose={handleCloseDialogs}
          onDownload={() => handleDownload(transcriptText, `סיכום-${selectedLesson.lessonName}.txt`)}
        />
      )}

      {selectedLesson && keyPointsText && activeDialog === 'keyPoints' && (
        <ShowKeyPoints
          keyPointsText={keyPointsText}
          lessonName={selectedLesson.lessonName}
          onClose={handleCloseDialogs}
          onDownload={() => handleDownload(keyPointsText, `נקודות-חשובות-${selectedLesson.lessonName}.txt`)}
        />
      )}

      <NoTranscriptDialog
        open={showNoTranscriptDialog}
        onClose={() => setShowNoTranscriptDialog(false)}
      />
    </Container>
  );
};

export default LessonsPage;