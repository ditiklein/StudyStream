using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.DTOs
{
    public class FolderDTO
    {
        public int Id { get; set; }  // מזהה ייחודי (PK)

        public string? Name { get; set; }  // שם התיקיה

        public int? ParentFolderId { get; set; }  // תיקיית אב (לניהול היררכי - null לתיקיית שורש)

        public int OwnerId { get; set; }  // בעל התיקיה

        public DateTime CreatedAt { get; set; }  // תאריך יצירה

        public DateTime UpdatedAt { get; set; }  // תאריך עדכון אחרון

        public bool IsDeleted { get; set; }  // דגל למחיקה רכה

    }
}
