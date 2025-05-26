import { Folder } from "./Folder";
import User from "./User";

type File={
    lessonName: string;
    description: string;
    fileType: string;
    folderId: number | null|undefined;
    ownerId: number;
  }
  

  export default File;



  // טיפוס מאוחד עבור שיעור/קובץ - מתאים גם ל-Entity וגם ל-DTO
export interface Lesson {
  id: number;                    // מזהה ייחודי
  lessonName?: string;           // שם השיעור/קובץ
  description?: string;          // תיאור השיעור
  fileType?: string;             // סוג הקובץ (pdf, jpg וכו')
  urlName?: string;              // מזהה הקובץ ב-S3
  folderId?: number;             // תיקיית היעד (null אם לא משויך לתיקיה)
  ownerId: number;              // בעל הקובץ
  createdAt: string;            // תאריך העלאה (ISO string)
  updatedAt: string;            // תאריך עדכון אחרון (ISO string)
  isDeleted: boolean;           // דגל למחיקה רכה
  
  // שדות נוספים שיכולים לחזור מה-DB (אופציונליים)
  folder?: Folder;              // קשר לתיקיה
  owner?: User;                 // קשר למשתמש הבעלים
}

// טיפוס עבור יצירת שיעור חדש (מתאים ל-LessonPostModel)
export interface CreateLessonRequest {
  lessonName: string;           // שם השיעור/קובץ
  description?: string;         // תיאור השיעור (אופציונלי)
  fileType: string;             // סוג הקובץ
  folderId: number|undefined|null;            // תיקיית היעד (אופציונלי)
  ownerId: number;             // בעל הקובץ
}



export interface UpdateLessonRequest {
  id: number;
  lessonName: string;
  ownerId: number;
  folderId: number | null;
  fileType: string;
  url: string;
  isDeleted: boolean;
}

