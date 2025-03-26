using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.Entities
{
    [Table("Lessons")]
    public class Lesson
    {
        [Key]
        
        public int Id { get; set; }  // מזהה ייחודי (PK)

        public string? LessonName { get; set; }  // שם הקובץ כפי שהועלה למערכת

        public string? FileType { get; set; }  // סוג הקובץ (pdf, jpg וכו')

        public string? Url { get; set; }  // מזהה הקובץ ב-S3 (לדוגמה: 'uploads/user1/file.jpg')

        public int?  FolderId { get; set; }  // תיקיית היעד (null אם לא משויך לתיקיה)
       
        [ForeignKey(nameof(FolderId))]

        public Folder? Folder { get; set; }  // קשר ל-Folder (כמובן, צריך Entity של Folder)

        public int OwnerId { get; set; }  // בעל הקובץ
        
        [ForeignKey(nameof(OwnerId))]

        public User Owner { get; set; }  // קשר ל-User (כמובן, צריך Entity של User)

        public DateTime CreatedAt { get; set; }  // תאריך העלאה

        public DateTime UpdatedAt { get; set; }  // תאריך עדכון אחרון

        public bool IsDeleted { get; set; }  // דגל למחיקה רכה
       
        public Transcript? Transcript { get; set; }
    }



}
