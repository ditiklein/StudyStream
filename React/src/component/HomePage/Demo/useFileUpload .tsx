import { useState, useCallback } from 'react';
import { DragEvent, ChangeEvent } from 'react';

interface UseFileUploadReturn {
  file: File | null;
  fileName: string;
  dragActive: boolean;
  handleDrag: (e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>) => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  resetFile: () => void;
  validateFile: () => boolean;
}

export const useFileUpload = (): UseFileUploadReturn => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  }, []);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  }, []);

  const resetFile = useCallback(() => {
    setFile(null);
    setFileName('');
    setDragActive(false);
  }, []);

  const validateFile = useCallback((): boolean => {
    return file !== null;
  }, [file]);

  return {
    file,
    fileName,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileChange,
    resetFile,
    validateFile
  };
};

