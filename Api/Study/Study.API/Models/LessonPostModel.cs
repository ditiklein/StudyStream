using System.ComponentModel.DataAnnotations;

namespace Study.API.Models
{
    public class LessonPostModel
    {
        public string LessonName { get; set; }  // שם הקובץ כפי שהועלה למערכת

        public string FileType { get; set; }  // סוג הקובץ (pdf, jpg וכו')

        public string Url { get; set; }  // מזהה הקובץ ב-S3 (לדוגמה: 'uploads/user1/file.jpg')

        public int? FolderId { get; set; }  // תיקיית היעד (null אם לא משויך לתיקיה)

        public int OwnerId { get; set; }  // בעל הקובץ


    }
}
