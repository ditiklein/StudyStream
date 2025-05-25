export interface TranscriptInfo {
    id: number;
    transcriptUrl: string;
    lessonId: number;
  }
  
  export interface SaveTranscriptParams {
    content: string;
    lessonId?: number;
    userName: string;
  }
  
  export class TranscriptService {
    private static baseUrl = 'http://localhost:5220/api';
  
    /**
     * העלאת תמלול ל-S3
     */
    static async uploadTranscriptToS3(fileName: string, content: string): Promise<string | null> {
      try {
        // שלב 1: בקשת כתובת חתומה
        const presignedResponse = await fetch(`${this.baseUrl}/upload/presigned-url?fileName=${fileName}`);
        
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
  
        return fileName;
      } catch (err) {
        console.error("Error uploading transcript:", err);
        return null;
      }
    }
  
    /**
     * שמירת כתובת התמלול במסד הנתונים
     */
    static async saveTranscriptUrlToDb(fileName: string, lessonId: number, userName: string): Promise<boolean> {
      try {
        const transcript = {
          transcriptUrl: fileName,
          lessonId,
          UserName: userName
        };
  
        const dbResponse = await fetch(`${this.baseUrl}/Transcript`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transcript),
        });
        
        if (!dbResponse.ok) {
          throw new Error("Failed to save transcript to database");
        }
        
        return true;
      } catch (err) {
        console.error("Error saving transcript URL to DB:", err);
        return false;
      }
    }
  
    /**
     * שמירת תמלול מלאה (S3 + DB)
     */
    static async saveTranscript(params: SaveTranscriptParams): Promise<{
      success: boolean;
      fileName?: string;
      error?: string;
    }> {
      try {
        if (!params.content.trim()) {
          return { success: false, error: 'אין תמלול לשמירה' };
        }
  
        // יצירת שם קובץ ייחודי עבור S3
        const fileExtension = ".txt";
        const uniqueFileName = `transcript_${Date.now()}${fileExtension}`;
        
        // שמירה ב-S3
        const uploadedFile = await this.uploadTranscriptToS3(uniqueFileName, params.content);
        if (!uploadedFile) {
          return { success: false, error: 'שגיאה בהעלאת הקובץ ל-S3' };
        }
        
        // שמירה במסד הנתונים (רק אם יש lessonId)
        if (params.lessonId) {
          const saved = await this.saveTranscriptUrlToDb(uploadedFile, params.lessonId, params.userName);
          
          if (!saved) {
            return { success: false, error: 'שגיאה בשמירה במסד הנתונים' };
          }
        }
        
        return { success: true, fileName: uniqueFileName };
      } catch (error) {
        console.error("Error in save process:", error);
        return { success: false, error: 'שגיאה כללית בשמירת התמלול' };
      }
    }
  
    /**
     * יצירת קובץ תמלול להורדה מקומית
     */
    static createTranscriptFile(content: string, lessonName: string = '', recordingTime: number = 0): void {
      const transcriptContent = `תמלול שיעור: ${lessonName || 'ללא שם'}
  תאריך: ${new Date().toLocaleDateString('he-IL')}
  שעה: ${new Date().toLocaleTimeString('he-IL')}
  משך ההקלטה: ${this.formatTime(recordingTime)}
  
  ---
  
  ${content.trim()}`;
  
      const blob = new Blob([transcriptContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `תמלול-${lessonName || 'שיעור'}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  
    private static formatTime(seconds: number): string {
      const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
      const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
      return `${mins}:${secs}`;
    }
  }