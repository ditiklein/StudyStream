using Study.Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.DTOs
{
    public class LessonDTO
    {
        public int Id { get; set; }  // מזהה ייחודי (PK)

        public string? LessonName { get; set; }  // שם הקובץ כפי שהועלה למערכת
        public string? Description { get; set; }  // שם הקובץ כפי שהועלה למערכת


        public string? FileType { get; set; }  // סוג הקובץ (pdf, jpg וכו')

        public string? UrlName { get; set; }  // מזהה הקובץ ב-S3 (לדוגמה: 'uploads/user1/file.jpg')

        public int? FolderId { get; set; }  // תיקיית היעד (null אם לא משויך לתיקיה)

        public int OwnerId { get; set; }  // בעל הקובץ

        public DateTime CreatedAt { get; set; }  // תאריך העלאה

        public DateTime UpdatedAt { get; set; }  // תאריך עדכון אחרון

        public bool IsDeleted { get; set; }  // דגל למחיקה רכה


    }
}
