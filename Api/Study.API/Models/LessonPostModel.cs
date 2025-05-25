using System.ComponentModel.DataAnnotations;

namespace Study.API.Models
{
    public class LessonPostModel
    {
        public string LessonName { get; set; }  // שם הקובץ כפי שהועלה למערכת
        public string? Description { get; set; }  // שם הקובץ כפי שהועלה למערכת


        public string FileType { get; set; }  // סוג הקובץ (pdf, jpg וכו')

        public int? FolderId { get; set; }  // תיקיית היעד (null אם לא משויך לתיקיה)

        public int OwnerId { get; set; }  // בעל הקובץ


    }
}
