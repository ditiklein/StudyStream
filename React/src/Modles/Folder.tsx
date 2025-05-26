export interface Folder {
  id: number;                    // מזהה ייחודי
  name?: string;                 // שם התיקיה
  parentFolderId?: number;       // תיקיית אב (null לתיקיית שורש)
  ownerId: number;              // בעל התיקיה
  createdAt: string;            // תאריך יצירה (ISO string)
  updatedAt: string;            // תאריך עדכון אחרון (ISO string)
  isDeleted: boolean;           // דגל למחיקה רכה
}

// טיפוס עבור יצירת תיקיה חדשה (מתאים ל-FolderPostModel)
export interface CreateFolderRequest {
  name: string;                 // שם התיקיה
  ownerId: number;             // בעל התיקיה
  parentFolderId?: number | null;     // תיקיית אב (אופציונלי) - מקבל גם null וגם undefined
}

export interface UpdateFolderRequest {
  id: number;
  name: string;
  ownerId: number;
  parentFolderId: number | null;  // הסרתי את undefined כי לא נדרש כאן
}
