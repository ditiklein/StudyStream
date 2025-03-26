using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.Entities
{
    [Table("Folders")]

    public class Folder
    {
        [Key]
        public int Id { get; set; }  // מזהה ייחודי (PK)

        public string? Name { get; set; }  // שם התיקיה

        public int? ParentFolderId { get; set; }  // תיקיית אב (לניהול היררכי - null לתיקיית שורש)
        
        public Folder? ParentFolder { get; set; }  // קשר לתיקיית אב (אם יש)
         
        public int OwnerId { get; set; }  // בעל התיקיה
        
        [ForeignKey(nameof(OwnerId))]

        public User Owner { get; set; }  // קשר ל-User (כמובן, צריך Entity של User)

        public DateTime CreatedAt { get; set; }  // תאריך יצירה

        public DateTime UpdatedAt { get; set; }  // תאריך עדכון אחרון

        public bool IsDeleted { get; set; }  // דגל למחיקה רכה


    }
}
