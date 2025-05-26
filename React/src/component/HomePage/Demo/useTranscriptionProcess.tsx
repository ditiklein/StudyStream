import { useState, useCallback } from 'react';
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

interface UseTranscriptionProcessReturn {
  isLoading: boolean;
  processingStage: ProcessingStage;
  transcriptionResult: TranscriptionResult | null;
  error: string | null;
  processFile: (file: File) => Promise<void>;
  resetProcess: () => void;
  clearError: () => void;
}

export const useTranscriptionProcess = (): UseTranscriptionProcessReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<ProcessingStage>(ProcessingStage.IDLE);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const dispatch = useDispatch();

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

  const extractKeyPointsAndSummary = async (transcriptionText: string): Promise<void> => {
    setProcessingStage(ProcessingStage.EXTRACTING_KEY_POINTS);
    await dispatch(extractKeyPoints(transcriptionText) as any);
    
    setProcessingStage(ProcessingStage.SUMMARIZING);
    await dispatch(summarizeLesson(transcriptionText) as any);
  };

  const processFile = useCallback(async (file: File): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const transcriptionText = await transcribeFile(file);
      
      setTranscriptionResult({ text: transcriptionText });
      
      if (transcriptionText) {
        await extractKeyPointsAndSummary(transcriptionText);
      }
    } catch (err) {
      console.error("שגיאה בתהליך:", err);
      setError(err instanceof Error ? err.message : "אירעה שגיאה בתהליך");
    } finally {
      setIsLoading(false);
      setProcessingStage(ProcessingStage.IDLE);
    }
  }, [dispatch]);

  const resetProcess = useCallback(() => {
    setIsLoading(false);
    setProcessingStage(ProcessingStage.IDLE);
    setTranscriptionResult(null);
    setError(null);
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
    clearError
  };
};
