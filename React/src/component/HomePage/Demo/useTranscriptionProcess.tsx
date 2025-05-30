
import { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { extractKeyPoints, summarizeLesson } from '../../FileAndFolderStore/KeyPointsSlice';

const apiUrl = import.meta.env.VITE_API_URL;

export enum ProcessingStage {
  IDLE = '',
  TRANSCRIBING = 'מתמלל את הקובץ...',
  EXTRACTING_KEY_POINTS = 'מחלץ נקודות חשובות...',
  SUMMARIZING = 'מכין סיכום...'
}

interface TranscriptionResult {
  text: string;
}

interface DemoData {
  transcriptionResult: TranscriptionResult;
  keyPoints: string | null;
  summary: string | null;
}

interface UseTranscriptionProcessReturn {
  isLoading: boolean;
  processingStage: ProcessingStage;
  transcriptionResult: TranscriptionResult | null;
  error: string | null;
  processFile: (file: File) => Promise<void>;
  resetProcess: () => void;
  clearError: () => void;
  hasUsedDemo: boolean;
  demoKeyPoints: string | null;
  demoSummary: string | null;
}

const DEMO_STORAGE_KEY = 'demoTranscriptionUsed';
const DEMO_DATA_KEY = 'demoData';

export const useTranscriptionProcess = (): UseTranscriptionProcessReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>(ProcessingStage.IDLE);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasUsedDemo, setHasUsedDemo] = useState<boolean>(false);
  const [demoKeyPoints, setDemoKeyPoints] = useState<string | null>(null);
  const [demoSummary, setDemoSummary] = useState<string | null>(null);
  
  const dispatch = useDispatch();

  // טוען נתונים מ-sessionStorage בעת האתחול
  useEffect(() => {
    const demoUsed = sessionStorage.getItem(DEMO_STORAGE_KEY);
    const savedData = sessionStorage.getItem(DEMO_DATA_KEY);
    
    if (demoUsed === 'true') {
      setHasUsedDemo(true);
      
      if (savedData) {
        try {
          const parsedData: DemoData = JSON.parse(savedData);
          setTranscriptionResult(parsedData.transcriptionResult);
          setDemoKeyPoints(parsedData.keyPoints);
          setDemoSummary(parsedData.summary);
        } catch (err) {
          console.error('שגיאה בטעינת נתונים שמורים:', err);
          // אם יש שגיאה, נמחק את הנתונים הפגומים
          sessionStorage.removeItem(DEMO_DATA_KEY);
          sessionStorage.removeItem(DEMO_STORAGE_KEY);
        }
      }
    }
  }, []);

  const transcribeFile = async (file: File): Promise<string> => {
    setProcessingStage(ProcessingStage.TRANSCRIBING);
    
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${apiUrl}/transcription/transcribe-full`, {
      method: "POST",
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`שגיאת שרת בתמלול: ${response.status}`);
    }
    
    const transcriptionData = await response.json();
    return transcriptionData.text || "אין תמלול זמין";
  };

  const extractKeyPointsAndSummary = async (transcriptionText: string): Promise<{keyPoints: string | null, summary: string | null}> => {
    setProcessingStage(ProcessingStage.EXTRACTING_KEY_POINTS);
    const keyPointsResult = await dispatch(extractKeyPoints(transcriptionText) as any);
    
    setProcessingStage(ProcessingStage.SUMMARIZING);
    const summaryResult = await dispatch(summarizeLesson(transcriptionText) as any);
    
    const keyPoints = keyPointsResult.payload || null;
    const summary = summaryResult.payload || null;
    
    setDemoKeyPoints(keyPoints);
    setDemoSummary(summary);
    
    return { keyPoints, summary };
  };

  const processFile = useCallback(async (file: File): Promise<void> => {
    // בדיקה אם המשתמש כבר השתמש בדמו
    if (hasUsedDemo) {
      setError('כבר השתמשת בדמו. להמשך השימוש יש להירשם למערכת.');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const transcriptionText = await transcribeFile(file);
      
      const result = { text: transcriptionText };
      setTranscriptionResult(result);
      
      let keyPoints: string | null = null;
      let summary: string | null = null;
      
      if (transcriptionText) {
        const { keyPoints: kp, summary: s } = await extractKeyPointsAndSummary(transcriptionText);
        keyPoints = kp;
        summary = s;
      }
      
      // שמירה של כל הנתונים יחד ב-sessionStorage
      const demoData: DemoData = {
        transcriptionResult: result,
        keyPoints,
        summary
      };
      
      sessionStorage.setItem(DEMO_STORAGE_KEY, 'true');
      sessionStorage.setItem(DEMO_DATA_KEY, JSON.stringify(demoData));
      setHasUsedDemo(true);
      
    } catch (err) {
      console.error("שגיאה בתהליך:", err);
      setError(err instanceof Error ? err.message : "אירעה שגיאה בתהליך");
    } finally {
      setIsLoading(false);
      setProcessingStage(ProcessingStage.IDLE);
    }
  }, [dispatch, hasUsedDemo]);

  const resetProcess = useCallback(() => {
    setIsLoading(false);
    setProcessingStage(ProcessingStage.IDLE);
    setTranscriptionResult(null);
    setError(null);
    // לא מאפסים את hasUsedDemo ולא מוחקים מ-sessionStorage
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    processingStage,
    transcriptionResult,
    error,
    processFile,
    resetProcess,
    clearError,
    hasUsedDemo,
    demoKeyPoints,
    demoSummary
  };
};