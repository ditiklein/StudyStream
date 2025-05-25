//using System;
//using System.ComponentModel.DataAnnotations;
//using System.ComponentModel.DataAnnotations.Schema;

//namespace Study.Core.Entities
//{
//    [Table("SharedLessons")]
//    public class SharedLesson
//    {
//        [Key]
//        public int Id { get; set; }

//        [Required]
//        public int LessonId { get; set; }

//        [ForeignKey(nameof(LessonId))]
//        public Lesson Lesson { get; set; }

//        [Required]
//        [EmailAddress]
//        public string SharedWithEmail { get; set; }  // למי נשלח

//        [Required]
//        public string Token { get; set; }  // מזהה ייחודי לקישור

//        public DateTime SharedAt { get; set; } = DateTime.UtcNow;
//    }
//}


using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Study.Core.Entities
{
    [Table("SharedLessons")]
    public class SharedLesson
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int LessonId { get; set; }

        [ForeignKey(nameof(LessonId))]
        public Lesson Lesson { get; set; }

        [Required]
        [EmailAddress]
        public string SharedWithEmail { get; set; }

        [Required]
        public string Token { get; set; }

        public DateTime SharedAt { get; set; } = DateTime.UtcNow;

        public bool IsPublic { get; set; }

        public bool IsApproved { get; set; }

        public string AccessRequestToken { get; set; }

        // שדות לאימות מייל
        public string EmailVerificationCode { get; set; }

        public DateTime? EmailVerificationExpiry { get; set; }

        // שדה חדש למעקב אחר ניסיונות אימות כושלים
        public int FailedVerificationAttempts { get; set; } = 0;
    }
}

