export interface AudioFile {
    id: number;
    lessonName: string;
    file?: File | null;
    // שדות נוספים שעשויים להיות רלוונטיים
    createdAt?: string;
    duration?: number;
    size?: number;
    userId?: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    // שדות נוספים שעשויים להיות רלוונטיים
  }
  
  export interface TranscriptionResult {
    id?: string;
    text: string;
    fileId: number;
    createdAt: string;
    updatedAt?: string;
    status: 'pending' | 'completed' | 'failed';
  }