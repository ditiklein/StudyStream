type TranscriptDTO = {
    id: number;
    lessonId: number;
    userName: string;
    transcriptUrl?: string | null;
    createdAt: string;
  };
  
  export default TranscriptDTO;
  