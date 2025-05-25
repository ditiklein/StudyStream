//////using Amazon.S3.Model;
//////using Amazon.S3;
//////using Microsoft.AspNetCore.Mvc;
//////using Study.Core.Entities;
//////using Study.API.Models;
//////using Study.Data;
//////using Microsoft.EntityFrameworkCore;
//////using System.Net.Mail;
//////using System.Net;
//////using System.Text;

//////[ApiController]
//////[Route("api/shared")]
//////public class SharedLessonController : ControllerBase
//////{
//////    private readonly DataContext _datacontext;
//////    private readonly IAmazonS3 _s3Client;
//////    private readonly IWebHostEnvironment _env;

//////    public SharedLessonController(DataContext context, IAmazonS3 s3Client, IWebHostEnvironment env)
//////    {
//////        _datacontext = context;
//////        _s3Client = s3Client;
//////        _env = env;
//////    }

//////    [HttpPost]
//////    public async Task<IActionResult> ShareLesson([FromBody] ShareLessonPostModle request)
//////    {
//////        var lesson = await _datacontext.LessonList.FindAsync(request.LessonId);
//////        if (lesson == null)
//////            return NotFound("שיעור לא נמצא");

//////        string token = Guid.NewGuid().ToString();

//////        var sharedLesson = new SharedLesson
//////        {
//////            LessonId = request.LessonId,
//////            SharedWithEmail = request.Email,
//////            Token = token,
//////            SharedAt = DateTime.UtcNow
//////        };

//////        _datacontext.SharedLessons.Add(sharedLesson);
//////        await _datacontext.SaveChangesAsync();

//////        // צור קישור לצפייה
//////        string shareLink = $"http://localhost:5174/shared-lesson?token={token}";

//////        // שלח מייל
//////        await SendShareEmail(request.Email, lesson.LessonName, shareLink);

//////        return Ok(new
//////        {
//////            message = "שיתוף נשמר ונשלח בהצלחה",
//////            shareLink
//////        });
//////    }

//////    private async Task SendShareEmail(string toEmail, string lessonName, string shareLink)
//////    {
//////        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "SharedLessonEmail.html");
//////        string htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);

//////        string body = htmlTemplate
//////            .Replace("{{lessonName}}", lessonName)
//////            .Replace("{{shareLink}}", shareLink)
//////            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));
//////        var smtpClient = new SmtpClient("smtp.gmail.com")
//////        {
//////            Port = 587,
//////            Credentials = new NetworkCredential("racheli3936@gmail.com", "pfyo eufd hqzp ohyn"),
//////            EnableSsl = true
//////        };

//////        var mailMessage = new MailMessage
//////        {
//////            From = new MailAddress("racheli3936@gmail.com"),
//////            Subject = $"🎧 שיתוף שיעור: {lessonName}",
//////            Body = body,
//////            IsBodyHtml = true
//////        };
//////        mailMessage.To.Add(toEmail);

//////        await smtpClient.SendMailAsync(mailMessage);
//////    }

//////    [HttpGet("{token}")]
//////    public async Task<IActionResult> AccessSharedLesson(string token)
//////    {
//////        var shared = await _datacontext.SharedLessons
//////            .Include(s => s.Lesson)
//////            .FirstOrDefaultAsync(s => s.Token == token);

//////        if (shared == null)
//////            return NotFound("שיתוף לא נמצא");

//////        var lesson = shared.Lesson;

//////        var url = _s3Client.GetPreSignedURL(new GetPreSignedUrlRequest
//////        {
//////            BucketName = "studystream",
//////            Key = lesson.UrlName,
//////            Verb = HttpVerb.GET,
//////            Expires = DateTime.UtcNow.AddMinutes(60)
//////        });

//////        return Ok(new { LessonName = lesson.LessonName, Url = url });
//////    }

//////    public class EmailRequest
//////    {
//////        public string To { get; set; }
//////        public string Subject { get; set; }
//////        public string Body { get; set; }
//////    }
//////}




////using Amazon.S3.Model;
////using Amazon.S3;
////using Microsoft.AspNetCore.Mvc;
////using Study.Core.Entities;
////using Study.API.Models;
////using Study.Data;
////using Microsoft.EntityFrameworkCore;
////using System.Net.Mail;
////using System.Net;
////using System.Text;

////[ApiController]
////[Route("api/shared")]
////public class SharedLessonController : ControllerBase
////{
////    private readonly DataContext _datacontext;
////    private readonly IAmazonS3 _s3Client;
////    private readonly IWebHostEnvironment _env;

////    public SharedLessonController(DataContext context, IAmazonS3 s3Client, IWebHostEnvironment env)
////    {
////        _datacontext = context;
////        _s3Client = s3Client;
////        _env = env;
////    }

////    [HttpPost]
////    public async Task<IActionResult> ShareLesson([FromBody] ShareLessonPostModle request)
////    {
////        var lesson = await _datacontext.LessonList.FindAsync(request.LessonId);
////        if (lesson == null)
////            return NotFound("שיעור לא נמצא");

////        // Check if lesson is already shared with this email
////        var existingShare = await _datacontext.SharedLessons
////            .FirstOrDefaultAsync(s => s.LessonId == request.LessonId && s.SharedWithEmail == request.Email);

////        if (existingShare != null)
////        {
////            // Update existing share with new visibility settings
////            existingShare.IsPublic = request.IsPublic;
////            await _datacontext.SaveChangesAsync();

////            // Create share link
////            string shareLink = $"http://localhost:5174/shared-lesson?token={existingShare.Token}";

////            // Send email about updated share
////            await SendShareEmail(request.Email, lesson.LessonName, shareLink, request.IsPublic);

////            return Ok(new
////            {
////                message = "שיתוף עודכן ונשלח בהצלחה",
////                shareLink
////            });
////        }

////        // Create new shared lesson
////        string token = Guid.NewGuid().ToString();
////        var sharedLesson = new SharedLesson
////        {
////            LessonId = request.LessonId,
////            SharedWithEmail = request.Email,
////            Token = token,
////            SharedAt = DateTime.UtcNow,
////            IsPublic = request.IsPublic,
////            IsApproved = true, // Initially approved for original recipient
////            AccessRequestToken = null // No access request initially
////        };

////        _datacontext.SharedLessons.Add(sharedLesson);
////        await _datacontext.SaveChangesAsync();

////        // Create share link
////        string newShareLink = $"http://localhost:5174/shared-lesson?token={token}";

////        // Send email
////        await SendShareEmail(request.Email, lesson.LessonName, newShareLink, request.IsPublic);

////        return Ok(new
////        {
////            message = "שיתוף נשמר ונשלח בהצלחה",
////            shareLink = newShareLink
////        });
////    }

////    private async Task SendShareEmail(string toEmail, string lessonName, string shareLink, bool isPublic = false)
////    {
////        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "SharedLessonEmail.html");
////        string htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);

////        string shareTypeText = isPublic ?
////            "שיתוף ציבורי - כל מי שיש לו את הקישור יוכל לצפות בשיעור" :
////            "שיתוף מוגבל - רק אתה תוכל לצפות בשיעור באמצעות מייל זה";

////        string body = htmlTemplate
////            .Replace("{{lessonName}}", lessonName)
////            .Replace("{{shareLink}}", shareLink)
////            .Replace("{{shareType}}", shareTypeText)
////            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));

////        var smtpClient = new SmtpClient("smtp.gmail.com")
////        {
////            Port = 587,
////            Credentials = new NetworkCredential("racheli3936@gmail.com", "pfyo eufd hqzp ohyn"),
////            EnableSsl = true
////        };

////        var mailMessage = new MailMessage
////        {
////            From = new MailAddress("racheli3936@gmail.com"),
////            Subject = $"🎧 שיתוף שיעור: {lessonName}",
////            Body = body,
////            IsBodyHtml = true
////        };

////        mailMessage.To.Add(toEmail);
////        await smtpClient.SendMailAsync(mailMessage);
////    }

////    private async Task SendAccessRequestEmail(string ownerEmail, string requestEmail, string lessonName, string approvalLink)
////    {
////        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "AccessRequestEmail.html");
////        string htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);

////        string body = htmlTemplate
////            .Replace("{{lessonName}}", lessonName)
////            .Replace("{{requestEmail}}", requestEmail)
////            .Replace("{{approvalLink}}", approvalLink)
////            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));

////        var smtpClient = new SmtpClient("smtp.gmail.com")
////        {
////            Port = 587,
////            Credentials = new NetworkCredential("racheli3936@gmail.com", "pfyo eufd hqzp ohyn"),
////            EnableSsl = true
////        };

////        var mailMessage = new MailMessage
////        {
////            From = new MailAddress("racheli3936@gmail.com"),
////            Subject = $"🔐 בקשת גישה לשיעור: {lessonName}",
////            Body = body,
////            IsBodyHtml = true
////        };

////        mailMessage.To.Add(ownerEmail);
////        await smtpClient.SendMailAsync(mailMessage);
////    }

////    private async Task SendAccessApprovedEmail(string requestEmail, string lessonName, string accessLink)
////    {
////        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "AccessApprovedEmail.html");
////        string htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);

////        string body = htmlTemplate
////            .Replace("{{lessonName}}", lessonName)
////            .Replace("{{accessLink}}", accessLink)
////            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));

////        var smtpClient = new SmtpClient("smtp.gmail.com")
////        {
////            Port = 587,
////            Credentials = new NetworkCredential("racheli3936@gmail.com", "pfyo eufd hqzp ohyn"),
////            EnableSsl = true
////        };

////        var mailMessage = new MailMessage
////        {
////            From = new MailAddress("racheli3936@gmail.com"),
////            Subject = $"✅ גישה אושרה לשיעור: {lessonName}",
////            Body = body,
////            IsBodyHtml = true
////        };

////        mailMessage.To.Add(requestEmail);
////        await smtpClient.SendMailAsync(mailMessage);
////    }

////    [HttpGet("{token}")]
////    public async Task<IActionResult> AccessSharedLesson(string token, [FromQuery] string email = null)
////    {
////        var shared = await _datacontext.SharedLessons
////            .Include(s => s.Lesson)
////            .FirstOrDefaultAsync(s => s.Token == token);

////        if (shared == null)
////            return NotFound("שיתוף לא נמצא");

////        var lesson = shared.Lesson;

////        // בדיקה אם השיתוף ציבורי או אם המייל המבקש זהה למייל ששותף
////        if (shared.IsPublic || (email != null && email == shared.SharedWithEmail))
////        {
////            // במקרה שהשיתוף ציבורי או המייל תואם - אפשר גישה
////            var url = _s3Client.GetPreSignedURL(new GetPreSignedUrlRequest
////            {
////                BucketName = "studystream",
////                Key = lesson.UrlName,
////                Verb = HttpVerb.GET,
////                Expires = DateTime.UtcNow.AddMinutes(60)
////            });

////            return Ok(new { LessonName = lesson.LessonName, Url = url });
////        }
////        else if (email != null)
////        {
////            // מייל שונה מבקש גישה לשיתוף לא ציבורי
////            // יצירת בקשת גישה חדשה
////            string requestToken = Guid.NewGuid().ToString();

////            // עדכון טוקן הבקשה בשיתוף הקיים
////            shared.AccessRequestToken = requestToken;
////            shared.IsApproved = false;
////            await _datacontext.SaveChangesAsync();

////            // שליחת מייל לבעלים של השיעור לאישור הגישה
////            var owner = await _datacontext.UserList.FindAsync(lesson.OwnerId);
////            if (owner != null && !string.IsNullOrEmpty(owner.Email))
////            {
////                string approvalLink = $"http://localhost:5174/approve-access?token={requestToken}";
////                await SendAccessRequestEmail(owner.Email, email, lesson.LessonName, approvalLink);

////                return Ok(new
////                {
////                    message = "נשלחה בקשת גישה לבעלים של השיעור. תקבל מייל כשהבקשה תאושר.",
////                    status = "pending"
////                });
////            }

////            return BadRequest("לא ניתן לשלוח בקשת גישה");
////        }

////        return BadRequest("אין לך הרשאה לצפות בשיעור זה");
////    }

////    [HttpGet("request/{token}")]
////    public async Task<IActionResult> GetRequestInfo(string token)
////    {
////        var shared = await _datacontext.SharedLessons
////            .Include(s => s.Lesson)
////            .FirstOrDefaultAsync(s => s.AccessRequestToken == token);

////        if (shared == null)
////            return NotFound("בקשת גישה לא נמצאה");

////        return Ok(new
////        {
////            email = shared.SharedWithEmail,
////            lessonName = shared.Lesson.LessonName
////        });
////    }

////    [HttpPost("request-access")]
////    public async Task<IActionResult> RequestAccess([FromBody] AccessRequestModel request)
////    {
////        if (string.IsNullOrEmpty(request.Token) || string.IsNullOrEmpty(request.Email))
////            return BadRequest("חסרים פרטים בבקשה");

////        var shared = await _datacontext.SharedLessons
////            .Include(s => s.Lesson)
////            .ThenInclude(l => l.Owner)
////            .FirstOrDefaultAsync(s => s.Token == request.Token);

////        if (shared == null)
////            return NotFound("שיתוף לא נמצא");

////        // אם השיתוף ציבורי - אין צורך באישור
////        if (shared.IsPublic)
////            return Ok(new
////            {
////                message = "השיעור משותף באופן ציבורי, אין צורך באישור",
////                status = "approved"
////            });

////        // אם המייל זהה למייל ששותף - אין צורך באישור
////        if (request.Email == shared.SharedWithEmail)
////            return Ok(new
////            {
////                message = "יש לך כבר גישה לשיעור זה",
////                status = "approved"
////            });

////        // יצירת בקשת גישה חדשה
////        string requestToken = Guid.NewGuid().ToString();

////        // עדכון טוקן הבקשה בשיתוף הקיים
////        shared.AccessRequestToken = requestToken;
////        shared.IsApproved = false;
////        await _datacontext.SaveChangesAsync();

////        // שליחת מייל לבעלים של השיעור לאישור הגישה
////        var owner = shared.Lesson.Owner;
////        if (owner != null && !string.IsNullOrEmpty(owner.Email))
////        {
////            string approvalLink = $"http://localhost:5174/approve-access?token={requestToken}";
////            await SendAccessRequestEmail(owner.Email, request.Email, shared.Lesson.LessonName, approvalLink);

////            return Ok(new
////            {
////                message = "נשלחה בקשת גישה לבעלים של השיעור. תקבל מייל כשהבקשה תאושר.",
////                status = "pending"
////            });
////        }

////        return BadRequest("לא ניתן לשלוח בקשת גישה");
////    }

////    [HttpPost("approve-access")]
////    public async Task<IActionResult> ApproveAccess([FromBody] ApproveAccessModel request)
////    {
////        if (string.IsNullOrEmpty(request.RequestToken))
////            return BadRequest("חסר מזהה בקשה");

////        var shared = await _datacontext.SharedLessons
////            .Include(s => s.Lesson)
////            .FirstOrDefaultAsync(s => s.AccessRequestToken == request.RequestToken);

////        if (shared == null)
////            return NotFound("בקשת גישה לא נמצאה");

////        // עדכון סטטוס האישור
////        shared.IsApproved = request.Approved;
////        await _datacontext.SaveChangesAsync();

////        if (request.Approved)
////        {
////            // שליחת מייל למבקש הגישה עם קישור לשיעור
////            string accessLink = $"http://localhost:5174/shared-lesson?token={shared.Token}&email={shared.SharedWithEmail}";
////            await SendAccessApprovedEmail(shared.SharedWithEmail, shared.Lesson.LessonName, accessLink);

////            return Ok(new
////            {
////                message = "הגישה אושרה ונשלחה הודעה למבקש",
////                status = "approved"
////            });
////        }

////        return Ok(new
////        {
////            message = "בקשת הגישה נדחתה",
////            status = "rejected"
////        });
////    }

////    [HttpDelete("{lessonId}")]
////    public async Task<IActionResult> RemoveSharing(int lessonId)
////    {
////        var shares = await _datacontext.SharedLessons
////            .Where(s => s.LessonId == lessonId)
////            .ToListAsync();

////        if (shares.Count == 0)
////            return NotFound("לא נמצאו שיתופים לשיעור זה");

////        _datacontext.SharedLessons.RemoveRange(shares);
////        await _datacontext.SaveChangesAsync();

////        return Ok(new { message = "כל השיתופים לשיעור זה הוסרו בהצלחה" });
////    }

////    public class EmailRequest
////    {
////        public string To { get; set; }
////        public string Subject { get; set; }
////        public string Body { get; set; }
////    }
////}




//using Amazon.S3.Model;
//using Amazon.S3;
//using Microsoft.AspNetCore.Mvc;
//using Study.Core.Entities;
//using Study.API.Models;
//using Study.Data;
//using Microsoft.EntityFrameworkCore;
//using System.Net.Mail;
//using System.Net;
//using System.Text;

//[ApiController]
//[Route("api/shared")]
//public class SharedLessonController : ControllerBase
//{
//    private readonly DataContext _datacontext;
//    private readonly IAmazonS3 _s3Client;
//    private readonly IWebHostEnvironment _env;

//    public SharedLessonController(DataContext context, IAmazonS3 s3Client, IWebHostEnvironment env)
//    {
//        _datacontext = context;
//        _s3Client = s3Client;
//        _env = env;
//    }

//    [HttpPost]
//    public async Task<IActionResult> ShareLesson([FromBody] ShareLessonPostModle request)
//    {
//        var lesson = await _datacontext.LessonList.FindAsync(request.LessonId);
//        if (lesson == null)
//            return NotFound(new { message = "שיעור לא נמצא" });

//        // Check if lesson is already shared with this email
//        var existingShare = await _datacontext.SharedLessons
//            .FirstOrDefaultAsync(s => s.LessonId == request.LessonId && s.SharedWithEmail == request.Email);

//        if (existingShare != null)
//        {
//            // Update existing share with new visibility settings
//            existingShare.IsPublic = request.IsPublic;
//            await _datacontext.SaveChangesAsync();

//            // Create share link with email parameter
//            string shareLink = $"http://localhost:5174/shared-lesson?token={existingShare.Token}&email={Uri.EscapeDataString(request.Email)}";

//            // Send email about updated share
//            await SendShareEmail(request.Email, lesson.LessonName, shareLink, request.IsPublic);

//            return Ok(new
//            {
//                message = "שיתוף עודכן ונשלח בהצלחה",
//                shareLink
//            });
//        }

//        // Create new shared lesson
//        string token = Guid.NewGuid().ToString();
//        var sharedLesson = new SharedLesson
//        {
//            LessonId = request.LessonId,
//            SharedWithEmail = request.Email,
//            Token = token,
//            SharedAt = DateTime.UtcNow,
//            IsPublic = request.IsPublic,
//            IsApproved = true, // Initially approved for original recipient
//            AccessRequestToken = null // No access request initially
//        };

//        _datacontext.SharedLessons.Add(sharedLesson);
//        await _datacontext.SaveChangesAsync();

//        // Create share link with email parameter
//        string newShareLink = $"http://localhost:5174/shared-lesson?token={token}&email={Uri.EscapeDataString(request.Email)}";

//        // Send email
//        await SendShareEmail(request.Email, lesson.LessonName, newShareLink, request.IsPublic);

//        return Ok(new
//        {
//            message = "שיתוף נשמר ונשלח בהצלחה",
//            shareLink = newShareLink
//        });
//    }

//    private async Task SendShareEmail(string toEmail, string lessonName, string shareLink, bool isPublic = false)
//    {
//        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "SharedLessonEmail.html");
//        string htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);

//        string shareTypeText = isPublic ?
//            "שיתוף ציבורי - כל מי שיש לו את הקישור יוכל לצפות בשיעור" :
//            "שיתוף מוגבל - רק אתה תוכל לצפות בשיעור באמצעות מייל זה";

//        // וודא שהקישור מכיל את המייל
//        if (!shareLink.Contains("email="))
//        {
//            shareLink = shareLink + (shareLink.Contains("?") ? "&" : "?") + $"email={Uri.EscapeDataString(toEmail)}";
//        }

//        string body = htmlTemplate
//            .Replace("{{lessonName}}", lessonName)
//            .Replace("{{shareLink}}", shareLink)
//            .Replace("{{shareType}}", shareTypeText)
//            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));

//        var smtpClient = new SmtpClient("smtp.gmail.com")
//        {
//            Port = 587,
//            Credentials = new NetworkCredential("racheli3936@gmail.com", "pfyo eufd hqzp ohyn"),
//            EnableSsl = true
//        };

//        var mailMessage = new MailMessage
//        {
//            From = new MailAddress("racheli3936@gmail.com"),
//            Subject = $"🎧 שיתוף שיעור: {lessonName}",
//            Body = body,
//            IsBodyHtml = true
//        };

//        mailMessage.To.Add(toEmail);
//        await smtpClient.SendMailAsync(mailMessage);
//    }

//    private async Task SendAccessRequestEmail(string ownerEmail, string requestEmail, string lessonName, string approvalLink)
//    {
//        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "AccessRequestEmail.html");
//        string htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);

//        string body = htmlTemplate
//            .Replace("{{lessonName}}", lessonName)
//            .Replace("{{requestEmail}}", requestEmail)
//            .Replace("{{approvalLink}}", approvalLink)
//            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));

//        var smtpClient = new SmtpClient("smtp.gmail.com")
//        {
//            Port = 587,
//            Credentials = new NetworkCredential("racheli3936@gmail.com", "pfyo eufd hqzp ohyn"),
//            EnableSsl = true
//        };

//        var mailMessage = new MailMessage
//        {
//            From = new MailAddress("racheli3936@gmail.com"),
//            Subject = $"🔐 בקשת גישה לשיעור: {lessonName}",
//            Body = body,
//            IsBodyHtml = true
//        };

//        mailMessage.To.Add(ownerEmail);
//        await smtpClient.SendMailAsync(mailMessage);
//    }

//    private async Task SendAccessApprovedEmail(string requestEmail, string lessonName, string accessLink)
//    {
//        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "AccessApprovedEmail.html");
//        string htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);

//        // וודא שהקישור מכיל את המייל
//        if (!accessLink.Contains("email="))
//        {
//            accessLink = accessLink + (accessLink.Contains("?") ? "&" : "?") + $"email={Uri.EscapeDataString(requestEmail)}";
//        }

//        string body = htmlTemplate
//            .Replace("{{lessonName}}", lessonName)
//            .Replace("{{accessLink}}", accessLink)
//            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));

//        var smtpClient = new SmtpClient("smtp.gmail.com")
//        {
//            Port = 587,
//            Credentials = new NetworkCredential("racheli3936@gmail.com", "pfyo eufd hqzp ohyn"),
//            EnableSsl = true
//        };

//        var mailMessage = new MailMessage
//        {
//            From = new MailAddress("racheli3936@gmail.com"),
//            Subject = $"✅ גישה אושרה לשיעור: {lessonName}",
//            Body = body,
//            IsBodyHtml = true
//        };

//        mailMessage.To.Add(requestEmail);
//        await smtpClient.SendMailAsync(mailMessage);
//    }

//    [HttpGet("{token}")]
//    public async Task<IActionResult> AccessSharedLesson(string token, [FromQuery] string email = null)
//    {
//        var shared = await _datacontext.SharedLessons
//            .Include(s => s.Lesson)
//            .FirstOrDefaultAsync(s => s.Token == token);

//        if (shared == null)
//            return NotFound(new { message = "שיתוף לא נמצא" });

//        var lesson = shared.Lesson;

//        // בדיקה אם השיתוף ציבורי או אם המייל המבקש זהה למייל ששותף
//        if (shared.IsPublic || (email != null && email == shared.SharedWithEmail))
//        {
//            // במקרה שהשיתוף ציבורי או המייל תואם - אפשר גישה
//            var url = _s3Client.GetPreSignedURL(new GetPreSignedUrlRequest
//            {
//                BucketName = "studystream",
//                Key = lesson.UrlName,
//                Verb = HttpVerb.GET,
//                Expires = DateTime.UtcNow.AddMinutes(60)
//            });

//            return Ok(new { LessonName = lesson.LessonName, Url = url });
//        }
//        else if (email != null)
//        {
//            // מייל שונה מבקש גישה לשיתוף לא ציבורי
//            // יצירת בקשת גישה חדשה
//            string requestToken = Guid.NewGuid().ToString();

//            // עדכון טוקן הבקשה בשיתוף הקיים
//            shared.AccessRequestToken = requestToken;
//            shared.IsApproved = false;
//            await _datacontext.SaveChangesAsync();

//            // שליחת מייל לבעלים של השיעור לאישור הגישה
//            var owner = await _datacontext.UserList.FindAsync(lesson.OwnerId);
//            if (owner != null && !string.IsNullOrEmpty(owner.Email))
//            {
//                string approvalLink = $"http://localhost:5174/approve-access?token={requestToken}";
//                await SendAccessRequestEmail(owner.Email, email, lesson.LessonName, approvalLink);

//                return Ok(new
//                {
//                    message = "נשלחה בקשת גישה לבעלים של השיעור. תקבל מייל כשהבקשה תאושר.",
//                    status = "pending"
//                });
//            }

//            return BadRequest(new { message = "לא ניתן לשלוח בקשת גישה" });
//        }

//        // במקרה שאין מייל בכלל, נחזיר הודעה בפורמט JSON
//        return BadRequest(new { message = "אין לך הרשאה לצפות בשיעור זה. יש להזין כתובת מייל." });
//    }

//    [HttpGet("request/{token}")]
//    public async Task<IActionResult> GetRequestInfo(string token)
//    {
//        var shared = await _datacontext.SharedLessons
//            .Include(s => s.Lesson)
//            .FirstOrDefaultAsync(s => s.AccessRequestToken == token);

//        if (shared == null)
//            return NotFound(new { message = "בקשת גישה לא נמצאה" });

//        return Ok(new
//        {
//            email = shared.SharedWithEmail,
//            lessonName = shared.Lesson.LessonName
//        });
//    }

//    [HttpPost("request-access")]
//    public async Task<IActionResult> RequestAccess([FromBody] AccessRequestModel request)
//    {
//        if (string.IsNullOrEmpty(request.Token) || string.IsNullOrEmpty(request.Email))
//            return BadRequest(new { message = "חסרים פרטים בבקשה" });

//        var shared = await _datacontext.SharedLessons
//            .Include(s => s.Lesson)
//            .ThenInclude(l => l.Owner)
//            .FirstOrDefaultAsync(s => s.Token == request.Token);

//        if (shared == null)
//            return NotFound(new { message = "שיתוף לא נמצא" });

//        // אם השיתוף ציבורי - אין צורך באישור
//        if (shared.IsPublic)
//            return Ok(new
//            {
//                message = "השיעור משותף באופן ציבורי, אין צורך באישור",
//                status = "approved"
//            });

//        // אם המייל זהה למייל ששותף - אין צורך באישור
//        if (request.Email == shared.SharedWithEmail)
//            return Ok(new
//            {
//                message = "יש לך כבר גישה לשיעור זה",
//                status = "approved"
//            });

//        // יצירת בקשת גישה חדשה
//        string requestToken = Guid.NewGuid().ToString();

//        // עדכון טוקן הבקשה בשיתוף הקיים
//        shared.AccessRequestToken = requestToken;
//        shared.IsApproved = false;
//        await _datacontext.SaveChangesAsync();

//        // שליחת מייל לבעלים של השיעור לאישור הגישה
//        var owner = shared.Lesson.Owner;
//        if (owner != null && !string.IsNullOrEmpty(owner.Email))
//        {
//            string approvalLink = $"http://localhost:5174/approve-access?token={requestToken}";
//            await SendAccessRequestEmail(owner.Email, request.Email, shared.Lesson.LessonName, approvalLink);

//            return Ok(new
//            {
//                message = "נשלחה בקשת גישה לבעלים של השיעור. תקבל מייל כשהבקשה תאושר.",
//                status = "pending"
//            });
//        }

//        return BadRequest(new { message = "לא ניתן לשלוח בקשת גישה" });
//    }

//    [HttpPost("approve-access")]
//    public async Task<IActionResult> ApproveAccess([FromBody] ApproveAccessModel request)
//    {
//        if (string.IsNullOrEmpty(request.RequestToken))
//            return BadRequest(new { message = "חסר מזהה בקשה" });

//        var shared = await _datacontext.SharedLessons
//            .Include(s => s.Lesson)
//            .FirstOrDefaultAsync(s => s.AccessRequestToken == request.RequestToken);

//        if (shared == null)
//            return NotFound(new { message = "בקשת גישה לא נמצאה" });

//        // עדכון סטטוס האישור
//        shared.IsApproved = request.Approved;
//        await _datacontext.SaveChangesAsync();

//        if (request.Approved)
//        {
//            // שליחת מייל למבקש הגישה עם קישור לשיעור
//            string accessLink = $"http://localhost:5174/shared-lesson?token={shared.Token}&email={Uri.EscapeDataString(shared.SharedWithEmail)}";
//            await SendAccessApprovedEmail(shared.SharedWithEmail, shared.Lesson.LessonName, accessLink);

//            return Ok(new
//            {
//                message = "הגישה אושרה ונשלחה הודעה למבקש",
//                status = "approved"
//            });
//        }

//        return Ok(new
//        {
//            message = "בקשת הגישה נדחתה",
//            status = "rejected"
//        });
//    }

//    [HttpDelete("{lessonId}")]
//    public async Task<IActionResult> RemoveSharing(int lessonId)
//    {
//        var shares = await _datacontext.SharedLessons
//            .Where(s => s.LessonId == lessonId)
//            .ToListAsync();

//        if (shares.Count == 0)
//            return NotFound(new { message = "לא נמצאו שיתופים לשיעור זה" });

//        _datacontext.SharedLessons.RemoveRange(shares);
//        await _datacontext.SaveChangesAsync();

//        return Ok(new { message = "כל השיתופים לשיעור זה הוסרו בהצלחה" });
//    }
//}





//using Amazon.S3.Model;
//using Amazon.S3;
//using Microsoft.AspNetCore.Mvc;
//using Study.Core.Entities;
//using Study.API.Models;
//using Study.Data;
//using Microsoft.EntityFrameworkCore;
//using System.Net.Mail;
//using System.Net;
//using System.Text;
//using System.Security.Cryptography;

//[ApiController]
//[Route("api/shared")]
//public class SharedLessonController : ControllerBase
//{
//    private readonly DataContext _datacontext;
//    private readonly IAmazonS3 _s3Client;
//    private readonly IWebHostEnvironment _env;
//    // קוד OTP פעיל למשך 10 דקות
//    private static readonly TimeSpan OTP_VALIDITY = TimeSpan.FromMinutes(10);

//    public SharedLessonController(DataContext context, IAmazonS3 s3Client, IWebHostEnvironment env)
//    {
//        _datacontext = context;
//        _s3Client = s3Client;
//        _env = env;
//    }

//    [HttpPost]
//    public async Task<IActionResult> ShareLesson([FromBody] ShareLessonPostModle request)
//    {
//        var lesson = await _datacontext.LessonList.FindAsync(request.LessonId);
//        if (lesson == null)
//            return NotFound(new { message = "שיעור לא נמצא" });

//        // Check if lesson is already shared with this email
//        var existingShare = await _datacontext.SharedLessons
//            .FirstOrDefaultAsync(s => s.LessonId == request.LessonId && s.SharedWithEmail == request.Email);

//        if (existingShare != null)
//        {
//            // Update existing share with new visibility settings
//            existingShare.IsPublic = request.IsPublic;
//            await _datacontext.SaveChangesAsync();

//            // Create share link - remove email parameter to force the new flow
//            string shareLink = $"http://localhost:5174/shared-lesson?token={existingShare.Token}";

//            // Send email about updated share
//            await SendShareEmail(request.Email, lesson.LessonName, shareLink, request.IsPublic);

//            return Ok(new
//            {
//                message = "שיתוף עודכן ונשלח בהצלחה",
//                shareLink
//            });
//        }

//        // Create new shared lesson
//        string token = Guid.NewGuid().ToString();
//        var sharedLesson = new SharedLesson
//        {
//            LessonId = request.LessonId,
//            SharedWithEmail = request.Email,
//            Token = token,
//            SharedAt = DateTime.UtcNow,
//            IsPublic = request.IsPublic,
//            IsApproved = true, // Initially approved for original recipient
//            AccessRequestToken = null, // No access request initially
//            EmailVerificationCode = null, // Will be set when verification is requested
//            EmailVerificationExpiry = null // Will be set when verification is requested
//        };

//        _datacontext.SharedLessons.Add(sharedLesson);
//        await _datacontext.SaveChangesAsync();

//        // Create share link - don't include email to force the new flow
//        string newShareLink = $"http://localhost:5174/shared-lesson?token={token}";

//        // Send email
//        await SendShareEmail(request.Email, lesson.LessonName, newShareLink, request.IsPublic);

//        return Ok(new
//        {
//            message = "שיתוף נשמר ונשלח בהצלחה",
//            shareLink = newShareLink
//        });
//    }

//    // יצירה ושליחה של קוד אימות חד פעמי
//    [HttpPost("send-verification")]
//    public async Task<IActionResult> SendVerificationCode([FromBody] VerificationRequest request)
//    {
//        if (string.IsNullOrEmpty(request.Token) || string.IsNullOrEmpty(request.Email))
//            return BadRequest(new { message = "חסרים פרטים בבקשה" });

//        var shared = await _datacontext.SharedLessons
//            .Include(s => s.Lesson)
//            .FirstOrDefaultAsync(s => s.Token == request.Token);

//        if (shared == null)
//            return NotFound(new { message = "שיתוף לא נמצא" });

//        // אם השיתוף ציבורי - אין צורך באימות מייל
//        if (shared.IsPublic)
//        {
//            return Ok(new
//            {
//                message = "השיעור משותף באופן ציבורי, אין צורך באימות",
//                isPublic = true
//            });
//        }

//        // אם המייל שונה מהמייל ששותף - הולכים לתהליך הרגיל של בקשת גישה
//        if (request.Email != shared.SharedWithEmail)
//        {
//            return Ok(new
//            {
//                message = "המייל שונה מהמייל ששותף איתו השיעור, נדרשת בקשת גישה",
//                needsAccessRequest = true
//            });
//        }

//        // יצירת קוד אימות חד-פעמי
//        string verificationCode = GenerateVerificationCode();

//        // שמירת הקוד בבסיס הנתונים
//        shared.EmailVerificationCode = verificationCode;
//        shared.EmailVerificationExpiry = DateTime.UtcNow.Add(OTP_VALIDITY);
//        await _datacontext.SaveChangesAsync();

//        // שליחת הקוד במייל
//        await SendVerificationEmail(shared.SharedWithEmail, verificationCode, shared.Lesson.LessonName);

//        return Ok(new
//        {
//            message = "קוד אימות נשלח למייל",
//            needsAccessRequest = false,
//            isPublic = false
//        });
//    }

//    // אימות הקוד שהוזן ע"י המשתמש
//    [HttpPost("verify-code")]
//    public async Task<IActionResult> VerifyCode([FromBody] VerificationCodeRequest request)
//    {
//        if (string.IsNullOrEmpty(request.Token) || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Code))
//            return BadRequest(new { message = "חסרים פרטים בבקשה" });

//        var shared = await _datacontext.SharedLessons
//            .Include(s => s.Lesson)
//            .FirstOrDefaultAsync(s => s.Token == request.Token);

//        if (shared == null)
//            return NotFound(new { message = "שיתוף לא נמצא" });

//        // בדיקה אם הקוד תקף
//        if (shared.SharedWithEmail != request.Email ||
//            shared.EmailVerificationCode != request.Code ||
//            shared.EmailVerificationExpiry == null ||
//            shared.EmailVerificationExpiry < DateTime.UtcNow)
//        {
//            return BadRequest(new { message = "קוד אימות שגוי או שפג תוקפו" });
//        }

//        // קוד אימות תקין, מאפשרים גישה לשיעור
//        var url = _s3Client.GetPreSignedURL(new GetPreSignedUrlRequest
//        {
//            BucketName = "studystream",
//            Key = shared.Lesson.UrlName,
//            Verb = HttpVerb.GET,
//            Expires = DateTime.UtcNow.AddMinutes(60)
//        });

//        // מאפסים את הקוד לאחר שימוש מוצלח
//        shared.EmailVerificationCode = null;
//        shared.EmailVerificationExpiry = null;
//        await _datacontext.SaveChangesAsync();

//        return Ok(new
//        {
//            LessonName = shared.Lesson.LessonName,
//            Url = url,
//            message = "אימות הצליח, מתחבר לשיעור"
//        });
//    }

//    private string GenerateVerificationCode()
//    {
//        // יצירת קוד אימות בן 6 ספרות
//        using (var rng = RandomNumberGenerator.Create())
//        {
//            byte[] data = new byte[4];
//            rng.GetBytes(data);
//            int value = Math.Abs(BitConverter.ToInt32(data, 0) % 1000000);
//            return value.ToString("D6"); // מחזיר מספר בן 6 ספרות עם אפסים מובילים אם צריך
//        }
//    }

//    private async Task SendVerificationEmail(string toEmail, string code, string lessonName)
//    {
//        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "VerificationCodeEmail.html");
//        string htmlTemplate;

//        // במקרה שהתבנית לא קיימת, ניצור הודעה פשוטה
//        if (System.IO.File.Exists(templatePath))
//        {
//            htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);
//        }
//        else
//        {
//            htmlTemplate = @"
//            <html dir='rtl'>
//            <body>
//                <h2>קוד אימות לצפייה בשיעור: {{lessonName}}</h2>
//                <p>הקוד שלך לאימות המייל הוא:</p>
//                <h1 style='font-size: 32px; text-align: center; background-color: #f0f0f0; padding: 10px; margin: 20px 0;'>{{code}}</h1>
//                <p>קוד זה בתוקף ל-10 דקות בלבד.</p>
//                <p>אם לא ביקשת קוד זה, ניתן להתעלם מהודעה זו.</p>
//            </body>
//            </html>";
//        }

//        string body = htmlTemplate
//            .Replace("{{lessonName}}", lessonName)
//            .Replace("{{code}}", code)
//            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));

//        var smtpClient = new SmtpClient("smtp.gmail.com")
//        {
//            Port = 587,
//            Credentials = new NetworkCredential("racheli3936@gmail.com", "pfyo eufd hqzp ohyn"),
//            EnableSsl = true
//        };

//        var mailMessage = new MailMessage
//        {
//            From = new MailAddress("racheli3936@gmail.com"),
//            Subject = $"🔑 קוד אימות לצפייה בשיעור: {lessonName}",
//            Body = body,
//            IsBodyHtml = true
//        };

//        mailMessage.To.Add(toEmail);
//        await smtpClient.SendMailAsync(mailMessage);
//    }

//    private async Task SendShareEmail(string toEmail, string lessonName, string shareLink, bool isPublic = false)
//    {
//        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "SharedLessonEmail.html");
//        string htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);

//        string shareTypeText = isPublic ?
//            "שיתוף ציבורי - כל מי שיש לו את הקישור יוכל לצפות בשיעור" :
//            "שיתוף מוגבל - רק אתה תוכל לצפות בשיעור באמצעות אימות מייל";

//        string body = htmlTemplate
//            .Replace("{{lessonName}}", lessonName)
//            .Replace("{{shareLink}}", shareLink)
//            .Replace("{{shareType}}", shareTypeText)
//            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));

//        var smtpClient = new SmtpClient("smtp.gmail.com")
//        {
//            Port = 587,
//            Credentials = new NetworkCredential("racheli3936@gmail.com", "pfyo eufd hqzp ohyn"),
//            EnableSsl = true
//        };

//        var mailMessage = new MailMessage
//        {
//            From = new MailAddress("racheli3936@gmail.com"),
//            Subject = $"🎧 שיתוף שיעור: {lessonName}",
//            Body = body,
//            IsBodyHtml = true
//        };

//        mailMessage.To.Add(toEmail);
//        await smtpClient.SendMailAsync(mailMessage);
//    }

//    private async Task SendAccessRequestEmail(string ownerEmail, string requestEmail, string lessonName, string approvalLink)
//    {
//        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "AccessRequestEmail.html");
//        string htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);

//        string body = htmlTemplate
//            .Replace("{{lessonName}}", lessonName)
//            .Replace("{{requestEmail}}", requestEmail)
//            .Replace("{{approvalLink}}", approvalLink)
//            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));

//        var smtpClient = new SmtpClient("smtp.gmail.com")
//        {
//            Port = 587,
//            Credentials = new NetworkCredential("racheli3936@gmail.com", "pfyo eufd hqzp ohyn"),
//            EnableSsl = true
//        };

//        var mailMessage = new MailMessage
//        {
//            From = new MailAddress("racheli3936@gmail.com"),
//            Subject = $"🔐 בקשת גישה לשיעור: {lessonName}",
//            Body = body,
//            IsBodyHtml = true
//        };

//        mailMessage.To.Add(ownerEmail);
//        await smtpClient.SendMailAsync(mailMessage);
//    }

//    private async Task SendAccessApprovedEmail(string requestEmail, string lessonName, string accessLink)
//    {
//        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "AccessApprovedEmail.html");
//        string htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);

//        string body = htmlTemplate
//            .Replace("{{lessonName}}", lessonName)
//            .Replace("{{accessLink}}", accessLink)
//            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));

//        var smtpClient = new SmtpClient("smtp.gmail.com")
//        {
//            Port = 587,
//            Credentials = new NetworkCredential("racheli3936@gmail.com", "pfyo eufd hqzp ohyn"),
//            EnableSsl = true
//        };

//        var mailMessage = new MailMessage
//        {
//            From = new MailAddress("racheli3936@gmail.com"),
//            Subject = $"✅ גישה אושרה לשיעור: {lessonName}",
//            Body = body,
//            IsBodyHtml = true
//        };

//        mailMessage.To.Add(requestEmail);
//        await smtpClient.SendMailAsync(mailMessage);
//    }

//    [HttpGet("{token}")]
//    public async Task<IActionResult> AccessSharedLesson(string token)
//    {
//        var shared = await _datacontext.SharedLessons
//            .Include(s => s.Lesson)
//            .FirstOrDefaultAsync(s => s.Token == token);

//        if (shared == null)
//            return NotFound(new { message = "שיתוף לא נמצא" });

//        // בדיקה האם השיעור פתוח לכל (ללא צורך באימות)
//        if (shared.IsPublic)
//        {
//            var lesson = shared.Lesson;
//            var url = _s3Client.GetPreSignedURL(new GetPreSignedUrlRequest
//            {
//                BucketName = "studystream",
//                Key = lesson.UrlName,
//                Verb = HttpVerb.GET,
//                Expires = DateTime.UtcNow.AddMinutes(60)
//            });

//            return Ok(new { LessonName = lesson.LessonName, Url = url });
//        }

//        // אחרת, צריך לעבור תהליך אימות
//        return Ok(new
//        {
//            needsVerification = true,
//            targetEmail = shared.SharedWithEmail, // שולחים רק 2 אותיות ראשונות ואחרונות של המייל לזיהוי בלבד
//            message = "יש להזין את כתובת המייל לקבלת קוד אימות"
//        });
//    }

//    [HttpGet("request/{token}")]
//    public async Task<IActionResult> GetRequestInfo(string token)
//    {
//        var shared = await _datacontext.SharedLessons
//            .Include(s => s.Lesson)
//            .FirstOrDefaultAsync(s => s.AccessRequestToken == token);

//        if (shared == null)
//            return NotFound(new { message = "בקשת גישה לא נמצאה" });

//        return Ok(new
//        {
//            email = shared.SharedWithEmail,
//            lessonName = shared.Lesson.LessonName
//        });
//    }

//    [HttpPost("request-access")]
//    public async Task<IActionResult> RequestAccess([FromBody] AccessRequestModel request)
//    {
//        if (string.IsNullOrEmpty(request.Token) || string.IsNullOrEmpty(request.Email))
//            return BadRequest(new { message = "חסרים פרטים בבקשה" });

//        var shared = await _datacontext.SharedLessons
//            .Include(s => s.Lesson)
//            .ThenInclude(l => l.Owner)
//            .FirstOrDefaultAsync(s => s.Token == request.Token);

//        if (shared == null)
//            return NotFound(new { message = "שיתוף לא נמצא" });

//        // אם השיתוף ציבורי - אין צורך באישור
//        if (shared.IsPublic)
//            return Ok(new
//            {
//                message = "השיעור משותף באופן ציבורי, אין צורך באישור",
//                status = "approved"
//            });

//        // אם המייל זהה למייל ששותף - עוברים לתהליך אימות OTP
//        if (request.Email == shared.SharedWithEmail)
//            return Ok(new
//            {
//                message = "יש לאמת את כתובת המייל שלך",
//                status = "needs_verification",
//                needsVerification = true
//            });

//        // יצירת בקשת גישה חדשה
//        string requestToken = Guid.NewGuid().ToString();

//        // עדכון טוקן הבקשה בשיתוף הקיים
//        shared.AccessRequestToken = requestToken;
//        shared.IsApproved = false;
//        await _datacontext.SaveChangesAsync();

//        // שליחת מייל לבעלים של השיעור לאישור הגישה
//        var owner = shared.Lesson.Owner;
//        if (owner != null && !string.IsNullOrEmpty(owner.Email))
//        {
//            string approvalLink = $"http://localhost:5174/approve-access?token={requestToken}";
//            await SendAccessRequestEmail(owner.Email, request.Email, shared.Lesson.LessonName, approvalLink);

//            return Ok(new
//            {
//                message = "נשלחה בקשת גישה לבעלים של השיעור. תקבל מייל כשהבקשה תאושר.",
//                status = "pending"
//            });
//        }

//        return BadRequest(new { message = "לא ניתן לשלוח בקשת גישה" });
//    }

//    [HttpPost("approve-access")]
//    public async Task<IActionResult> ApproveAccess([FromBody] ApproveAccessModel request)
//    {
//        if (string.IsNullOrEmpty(request.RequestToken))
//            return BadRequest(new { message = "חסר מזהה בקשה" });

//        var shared = await _datacontext.SharedLessons
//            .Include(s => s.Lesson)
//            .FirstOrDefaultAsync(s => s.AccessRequestToken == request.RequestToken);

//        if (shared == null)
//            return NotFound(new { message = "בקשת גישה לא נמצאה" });

//        // עדכון סטטוס האישור
//        shared.IsApproved = request.Approved;
//        await _datacontext.SaveChangesAsync();

//        if (request.Approved)
//        {
//            // שליחת מייל למבקש הגישה עם קישור לשיעור
//            string accessLink = $"http://localhost:5174/shared-lesson?token={shared.Token}";
//            await SendAccessApprovedEmail(shared.SharedWithEmail, shared.Lesson.LessonName, accessLink);

//            return Ok(new
//            {
//                message = "הגישה אושרה ונשלחה הודעה למבקש",
//                status = "approved"
//            });
//        }

//        return Ok(new
//        {
//            message = "בקשת הגישה נדחתה",
//            status = "rejected"
//        });
//    }

//    [HttpDelete("{lessonId}")]
//    public async Task<IActionResult> RemoveSharing(int lessonId)
//    {
//        var shares = await _datacontext.SharedLessons
//            .Where(s => s.LessonId == lessonId)
//            .ToListAsync();

//        if (shares.Count == 0)
//            return NotFound(new { message = "לא נמצאו שיתופים לשיעור זה" });

//        _datacontext.SharedLessons.RemoveRange(shares);
//        await _datacontext.SaveChangesAsync();

//        return Ok(new { message = "כל השיתופים לשיעור זה הוסרו בהצלחה" });
//    }
//}






using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.AspNetCore.Mvc;
using Study.Core.Entities;
using Study.API.Models;
using Study.Data;
using Microsoft.EntityFrameworkCore;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Security.Cryptography;

[ApiController]
[Route("api/shared")]
public class SharedLessonController : ControllerBase
{
    private readonly DataContext _datacontext;
    private readonly IAmazonS3 _s3Client;
    private readonly IWebHostEnvironment _env;
    // קוד OTP פעיל למשך 10 דקות
    private static readonly TimeSpan OTP_VALIDITY = TimeSpan.FromMinutes(10);
    // מספר הניסיונות המקסימלי לאימות קוד
    private static readonly int MAX_VERIFICATION_ATTEMPTS = 5;

    public SharedLessonController(DataContext context, IAmazonS3 s3Client, IWebHostEnvironment env)
    {
        _datacontext = context;
        _s3Client = s3Client;
        _env = env;
    }

    [HttpPost]
    public async Task<IActionResult> ShareLesson([FromBody] ShareLessonPostModle request)
    {
        if (request == null || request.LessonId <= 0 || string.IsNullOrEmpty(request.Email))
            return BadRequest(new { message = "נתונים חסרים בבקשה" });

        var lesson = await _datacontext.LessonList.FindAsync(request.LessonId);
        if (lesson == null)
            return NotFound(new { message = "שיעור לא נמצא" });

        // Check if lesson is already shared with this email
        var existingShare = await _datacontext.SharedLessons
            .FirstOrDefaultAsync(s => s.LessonId == request.LessonId && s.SharedWithEmail == request.Email);

        if (existingShare != null)
        {
            // Update existing share with new visibility settings
            existingShare.IsPublic = request.IsPublic;
            await _datacontext.SaveChangesAsync();

            // Create share link - remove email parameter to force the new flow
            string shareLink = $"http://localhost:5174/shared-lesson?token={existingShare.Token}";

            // Send email about updated share
            await SendShareEmail(request.Email, lesson.LessonName, shareLink, request.IsPublic);

            return Ok(new
            {
                message = "שיתוף עודכן ונשלח בהצלחה",
                shareLink
            });
        }

        // Create new shared lesson
        string token = Guid.NewGuid().ToString();
        var sharedLesson = new SharedLesson
        {
            LessonId = request.LessonId,
            SharedWithEmail = request.Email,
            Token = token,
            SharedAt = DateTime.UtcNow,
            IsPublic = request.IsPublic,
            IsApproved = true, // Initially approved for original recipient
            AccessRequestToken = null, // No access request initially
            EmailVerificationCode = null, // Will be set when verification is requested
            EmailVerificationExpiry = null, // Will be set when verification is requested
            FailedVerificationAttempts = 0 // Initialize failed attempts counter
        };

        _datacontext.SharedLessons.Add(sharedLesson);
        await _datacontext.SaveChangesAsync();

        // Create share link - don't include email to force the new flow
        string newShareLink = $"http://localhost:5174/shared-lesson?token={token}";

        // Send email
        await SendShareEmail(request.Email, lesson.LessonName, newShareLink, request.IsPublic);

        return Ok(new
        {
            message = "שיתוף נשמר ונשלח בהצלחה",
            shareLink = newShareLink
        });
    }

    // יצירה ושליחה של קוד אימות חד פעמי
    [HttpPost("send-verification")]
    public async Task<IActionResult> SendVerificationCode([FromBody] VerificationRequest request)
    {
        if (string.IsNullOrEmpty(request.Token) || string.IsNullOrEmpty(request.Email))
            return BadRequest(new { message = "חסרים פרטים בבקשה" });

        var shared = await _datacontext.SharedLessons
            .Include(s => s.Lesson)
            .FirstOrDefaultAsync(s => s.Token == request.Token);

        if (shared == null)
            return NotFound(new { message = "שיתוף לא נמצא" });

        // אם השיתוף ציבורי - אין צורך באימות מייל
        if (shared.IsPublic)
        {
            var lesson = shared.Lesson;
            var url = _s3Client.GetPreSignedURL(new GetPreSignedUrlRequest
            {
                BucketName = "studystream",
                Key = lesson.UrlName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(60)
            });

            return Ok(new
            {
                message = "השיעור משותף באופן ציבורי, אין צורך באימות",
                isPublic = true,
                LessonName = lesson.LessonName,
                Url = url
            });
        }

        // בדיקה אם המייל שהוזן תואם למייל ששותף איתו השיעור
        if (request.Email != shared.SharedWithEmail)
        {
            // מחזירים חלק מהמייל המורשה לצורך הצגה בממשק
            string maskedEmail = MaskEmail(shared.SharedWithEmail);

            return Ok(new
            {
                message = $"שיעור זה שותף עם כתובת מייל אחרת ({maskedEmail}). אם ברצונך לקבל גישה, אנא בקש זאת מהמורה.",
                needsAccessRequest = true,
                targetEmail = maskedEmail
            });
        }

        // בדיקה אם ישנו כבר קוד אימות פעיל ותקף
        if (shared.EmailVerificationCode != null &&
            shared.EmailVerificationExpiry != null &&
            shared.EmailVerificationExpiry > DateTime.UtcNow)
        {
            // שליחת הקוד הקיים שוב (אופציונלי - ניתן גם ליצור קוד חדש)
            await SendVerificationEmail(shared.SharedWithEmail, shared.EmailVerificationCode, shared.Lesson.LessonName);

            return Ok(new
            {
                message = "קוד אימות חדש נשלח למייל",
                needsAccessRequest = false,
                isPublic = false
            });
        }

        // איפוס מונה ניסיונות כושלים
        shared.FailedVerificationAttempts = 0;

        // יצירת קוד אימות חד-פעמי
        string verificationCode = GenerateVerificationCode();

        // שמירת הקוד בבסיס הנתונים
        shared.EmailVerificationCode = verificationCode;
        shared.EmailVerificationExpiry = DateTime.UtcNow.Add(OTP_VALIDITY);
        await _datacontext.SaveChangesAsync();

        // שליחת הקוד במייל
        await SendVerificationEmail(shared.SharedWithEmail, verificationCode, shared.Lesson.LessonName);

        return Ok(new
        {
            message = "קוד אימות נשלח למייל",
            needsAccessRequest = false,
            isPublic = false
        });
    }

    // אימות הקוד שהוזן ע"י המשתמש
    [HttpPost("verify-code")]
    public async Task<IActionResult> VerifyCode([FromBody] VerificationCodeRequest request)
    {
        if (string.IsNullOrEmpty(request.Token) || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Code))
            return BadRequest(new { message = "חסרים פרטים בבקשה" });

        var shared = await _datacontext.SharedLessons
            .Include(s => s.Lesson)
            .FirstOrDefaultAsync(s => s.Token == request.Token);

        if (shared == null)
            return NotFound(new { message = "שיתוף לא נמצא" });

        // בדיקה אם הגענו למספר הניסיונות המקסימלי
        if (shared.FailedVerificationAttempts >= MAX_VERIFICATION_ATTEMPTS)
        {
            // איפוס הקוד הקיים כדי לחייב שליחה מחדש
            shared.EmailVerificationCode = null;
            shared.EmailVerificationExpiry = null;
            await _datacontext.SaveChangesAsync();

            return BadRequest(new
            {
                message = "מספר ניסיונות האימות עבר את המותר. יש לבקש קוד חדש.",
                needNewCode = true
            });
        }

        // בדיקה אם הקוד תקף
        if (shared.SharedWithEmail != request.Email ||
            shared.EmailVerificationCode != request.Code ||
            shared.EmailVerificationExpiry == null ||
            shared.EmailVerificationExpiry < DateTime.UtcNow)
        {
            // הגדלת מונה הניסיונות הכושלים
            shared.FailedVerificationAttempts += 1;
            await _datacontext.SaveChangesAsync();

            return BadRequest(new
            {
                message = "קוד אימות שגוי או שפג תוקפו",
                attemptsLeft = MAX_VERIFICATION_ATTEMPTS - shared.FailedVerificationAttempts
            });
        }

        // קוד אימות תקין, מאפשרים גישה לשיעור
        var url = _s3Client.GetPreSignedURL(new GetPreSignedUrlRequest
        {
            BucketName = "studystream",
            Key = shared.Lesson.UrlName,
            Verb = HttpVerb.GET,
            Expires = DateTime.UtcNow.AddMinutes(60)
        });

        // מאפסים את הקוד ומונה הניסיונות לאחר שימוש מוצלח
        shared.EmailVerificationCode = null;
        shared.EmailVerificationExpiry = null;
        shared.FailedVerificationAttempts = 0;
        await _datacontext.SaveChangesAsync();

        return Ok(new
        {
            LessonName = shared.Lesson.LessonName,
            Url = url,
            message = "אימות הצליח, מתחבר לשיעור"
        });
    }

    // הסתרת חלק מכתובת המייל לצורכי פרטיות
    private string MaskEmail(string email)
    {
        if (string.IsNullOrEmpty(email) || !email.Contains("@"))
            return email;

        var parts = email.Split('@');
        string name = parts[0];
        string domain = parts[1];

        // הצג רק את התו הראשון ואת 2 התווים האחרונים של שם המשתמש
        string maskedName = name.Length <= 3
            ? name[0] + new string('*', name.Length - 1)
            : name[0] + new string('*', name.Length - 3) + name.Substring(name.Length - 2);

        return maskedName + "@" + domain;
    }

    private string GenerateVerificationCode()
    {
        // יצירת קוד אימות בן 6 ספרות
        using (var rng = RandomNumberGenerator.Create())
        {
            byte[] data = new byte[4];
            rng.GetBytes(data);
            int value = Math.Abs(BitConverter.ToInt32(data, 0) % 1000000);
            return value.ToString("D6"); // מחזיר מספר בן 6 ספרות עם אפסים מובילים אם צריך
        }
    }

    private async Task SendVerificationEmail(string toEmail, string code, string lessonName)
    {
        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "VerificationCodeEmail.html");
        string htmlTemplate;

        // במקרה שהתבנית לא קיימת, ניצור הודעה פשוטה
        if (System.IO.File.Exists(templatePath))
        {
            htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);
        }
        else
        {
            htmlTemplate = @"
            <html dir='rtl'>
            <body>
                <h2>קוד אימות לצפייה בשיעור: {{lessonName}}</h2>
                <p>הקוד שלך לאימות המייל הוא:</p>
                <h1 style='font-size: 32px; text-align: center; background-color: #f0f0f0; padding: 10px; margin: 20px 0;'>{{code}}</h1>
                <p>קוד זה בתוקף ל-10 דקות בלבד.</p>
                <p>אם לא ביקשת קוד זה, ניתן להתעלם מהודעה זו.</p>
            </body>
            </html>";
        }

        string body = htmlTemplate
            .Replace("{{lessonName}}", lessonName)
            .Replace("{{code}}", code)
            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));

        var smtpClient = new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            Credentials = new NetworkCredential("studstream.il@gmail.com", "vilo uqhl ehdk yjcb"),
            EnableSsl = true
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress("studstream.il@gmail.com"),
            Subject = $"🔑 קוד אימות לצפייה בשיעור: {lessonName}",
            Body = body,
            IsBodyHtml = true
        };

        mailMessage.To.Add(toEmail);
        await smtpClient.SendMailAsync(mailMessage);
    }

    private async Task SendShareEmail(string toEmail, string lessonName, string shareLink, bool isPublic = false)
    {
        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "SharedLessonEmail.html");
        string htmlTemplate;

        // במקרה שהתבנית לא קיימת, ניצור הודעה פשוטה
        if (System.IO.File.Exists(templatePath))
        {
            htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);
        }
        else
        {
            htmlTemplate = @"
            <html dir='rtl'>
            <body>
                <h2>שיעור שותף איתך: {{lessonName}}</h2>
                <p>{{shareType}}</p>
                <p>לצפייה בשיעור, לחץ על הקישור הבא:</p>
                <a href='{{shareLink}}' style='display: inline-block; padding: 10px 20px; background-color: #4361ee; color: white; text-decoration: none; border-radius: 5px;'>צפה בשיעור</a>
                <p>או העתק את הקישור הבא לדפדפן:</p>
                <p>{{shareLink}}</p>
                <p>בתאריך: {{date}}</p>
            </body>
            </html>";
        }

        string shareTypeText = isPublic ?
            "שיתוף ציבורי - כל מי שיש לו את הקישור יוכל לצפות בשיעור" :
            "שיתוף מוגבל - רק אתה תוכל לצפות בשיעור באמצעות אימות מייל";

        string body = htmlTemplate
            .Replace("{{lessonName}}", lessonName)
            .Replace("{{shareLink}}", shareLink)
            .Replace("{{shareType}}", shareTypeText)
            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));

        var smtpClient = new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            Credentials = new NetworkCredential("studstream.il@gmail.com", "vilo uqhl ehdk yjcb"),
            EnableSsl = true
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress("studstream.il@gmail.com"),
            Subject = $"🎧 שיתוף שיעור: {lessonName}",
            Body = body,
            IsBodyHtml = true
        };

        mailMessage.To.Add(toEmail);
        await smtpClient.SendMailAsync(mailMessage);
    }

    private async Task SendAccessRequestEmail(string ownerEmail, string requestEmail, string lessonName, string approvalLink)
    {
        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "AccessRequestEmail.html");
        string htmlTemplate;

        // במקרה שהתבנית לא קיימת, ניצור הודעה פשוטה
        if (System.IO.File.Exists(templatePath))
        {
            htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);
        }
        else
        {
            htmlTemplate = @"
            <html dir='rtl'>
            <body>
                <h2>בקשת גישה לשיעור: {{lessonName}}</h2>
                <p>המשתמש <b>{{requestEmail}}</b> מבקש גישה לשיעור שלך.</p>
                <p>לאישור או דחיית הבקשה, לחץ על הקישור:</p>
                <a href='{{approvalLink}}' style='display: inline-block; padding: 10px 20px; background-color: #4361ee; color: white; text-decoration: none; border-radius: 5px;'>אשר/דחה גישה</a>
                <p>או העתק את הקישור הבא לדפדפן:</p>
                <p>{{approvalLink}}</p>
                <p>בתאריך: {{date}}</p>
            </body>
            </html>";
        }

        string body = htmlTemplate
            .Replace("{{lessonName}}", lessonName)
            .Replace("{{requestEmail}}", requestEmail)
            .Replace("{{approvalLink}}", approvalLink)
            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));

        var smtpClient = new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            Credentials = new NetworkCredential("studstream.il@gmail.com", "vilo uqhl ehdk yjcb"),
            EnableSsl = true
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress("studstream.il@gmail.com"),
            Subject = $"🔐 בקשת גישה לשיעור: {lessonName}",
            Body = body,
            IsBodyHtml = true
        };

        mailMessage.To.Add(ownerEmail);
        await smtpClient.SendMailAsync(mailMessage);
    }

    private async Task SendAccessApprovedEmail(string requestEmail, string lessonName, string accessLink)
    {
        string templatePath = Path.Combine(_env.ContentRootPath, "Templates", "AccessApprovedEmail.html");
        string htmlTemplate;

        // במקרה שהתבנית לא קיימת, ניצור הודעה פשוטה
        if (System.IO.File.Exists(templatePath))
        {
            htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath);
        }
        else
        {
            htmlTemplate = @"
            <html dir='rtl'>
            <body>
                <h2>גישה אושרה לשיעור: {{lessonName}}</h2>
                <p>בקשתך לגישה לשיעור אושרה!</p>
                <p>לצפייה בשיעור, לחץ על הקישור הבא:</p>
                <a href='{{accessLink}}' style='display: inline-block; padding: 10px 20px; background-color: #4361ee; color: white; text-decoration: none; border-radius: 5px;'>צפה בשיעור</a>
                <p>או העתק את הקישור הבא לדפדפן:</p>
                <p>{{accessLink}}</p>
                <p>בתאריך: {{date}}</p>
            </body>
            </html>";
        }

        string body = htmlTemplate
            .Replace("{{lessonName}}", lessonName)
            .Replace("{{accessLink}}", accessLink)
            .Replace("{{date}}", DateTime.UtcNow.ToString("dd/MM/yyyy"));

        var smtpClient = new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            Credentials = new NetworkCredential("studstream.il@gmail.com", "vilo uqhl ehdk yjcb"),
            EnableSsl = true
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress("studstream.il@gmail.com"),
            Subject = $"✅ גישה אושרה לשיעור: {lessonName}",
            Body = body,
            IsBodyHtml = true
        };

        mailMessage.To.Add(requestEmail);
        await smtpClient.SendMailAsync(mailMessage);
    }

    [HttpGet("{token}")]
    public async Task<IActionResult> AccessSharedLesson(string token)
    {
        var shared = await _datacontext.SharedLessons
            .Include(s => s.Lesson)
            .FirstOrDefaultAsync(s => s.Token == token);

        if (shared == null)
            return NotFound(new { message = "שיתוף לא נמצא או שפג תוקפו" });

        // בדיקה האם השיעור פתוח לכל (ללא צורך באימות)
        if (shared.IsPublic)
        {
            var lesson = shared.Lesson;
            var url = _s3Client.GetPreSignedURL(new GetPreSignedUrlRequest
            {
                BucketName = "studystream",
                Key = lesson.UrlName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(60)
            });

            // חשוב לציין במפורש שזה שיעור ציבורי ולשלוח את כל המידע
            return Ok(new
            {
                LessonName = lesson.LessonName,
                Url = url,
                isPublic = true  // סימון מפורש שזה שיעור ציבורי
            });
        }

        // אחרת, צריך לעבור תהליך אימות
        string maskedEmail = MaskEmail(shared.SharedWithEmail);
        return Ok(new
        {
            needsVerification = true,
            targetEmail = maskedEmail,
            message = "יש להזין את כתובת המייל לקבלת קוד אימות"
        });
    }


    [HttpGet("request/{token}")]
    public async Task<IActionResult> GetRequestInfo(string token)
    {
        var shared = await _datacontext.SharedLessons
            .Include(s => s.Lesson)
            .FirstOrDefaultAsync(s => s.AccessRequestToken == token);

        if (shared == null)
            return NotFound(new { message = "בקשת גישה לא נמצאה או שפג תוקפה" });

        return Ok(new
        {
            email = shared.SharedWithEmail,
            lessonName = shared.Lesson.LessonName
        });
    }

    [HttpPost("request-access")]
    public async Task<IActionResult> RequestAccess([FromBody] AccessRequestModel request)
    {
        if (string.IsNullOrEmpty(request.Token) || string.IsNullOrEmpty(request.Email))
            return BadRequest(new { message = "חסרים פרטים בבקשה" });

        var shared = await _datacontext.SharedLessons
            .Include(s => s.Lesson)
            .ThenInclude(l => l.Owner)
            .FirstOrDefaultAsync(s => s.Token == request.Token);

        if (shared == null)
            return NotFound(new { message = "שיתוף לא נמצא" });

        // אם השיתוף ציבורי - אין צורך באישור
        if (shared.IsPublic)
        {
            var lesson = shared.Lesson;
            var url = _s3Client.GetPreSignedURL(new GetPreSignedUrlRequest
            {
                BucketName = "studystream",
                Key = lesson.UrlName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddMinutes(60)
            });

            return Ok(new
            {
                message = "השיעור משותף באופן ציבורי, אין צורך באישור",
                status = "approved",
                LessonName = lesson.LessonName,
                Url = url
            });
        }

        // אם המייל זהה למייל ששותף - עוברים לתהליך אימות OTP
        if (request.Email == shared.SharedWithEmail)
        {
            // נשלח קוד OTP למייל
            string verificationCode = GenerateVerificationCode();
            shared.EmailVerificationCode = verificationCode;
            shared.EmailVerificationExpiry = DateTime.UtcNow.Add(OTP_VALIDITY);
            shared.FailedVerificationAttempts = 0; // מאפס את מונה הניסיונות
            await _datacontext.SaveChangesAsync();

            // שליחת הקוד במייל
            await SendVerificationEmail(shared.SharedWithEmail, verificationCode, shared.Lesson.LessonName);

            return Ok(new
            {
                message = "יש לאמת את כתובת המייל שלך",
                status = "needs_verification",
                needsVerification = true
            });
        }

        // יצירת בקשת גישה חדשה למשתמש אחר
        string requestToken = Guid.NewGuid().ToString();

        // עדכון טוקן הבקשה בשיתוף הקיים
        shared.AccessRequestToken = requestToken;
        shared.IsApproved = false;
        shared.SharedWithEmail = request.Email; // מעדכן את המייל בבקשה החדשה - אם המורה תאשר
        await _datacontext.SaveChangesAsync();

        // שליחת מייל לבעלים של השיעור לאישור הגישה
        var owner = shared.Lesson.Owner;
        if (owner != null && !string.IsNullOrEmpty(owner.Email))
        {
            string approvalLink = $"http://localhost:5174/approve-access?token={requestToken}";
            await SendAccessRequestEmail(owner.Email, request.Email, shared.Lesson.LessonName, approvalLink);

            return Ok(new
            {
                message = "נשלחה בקשת גישה לבעלים של השיעור. תקבל מייל כשהבקשה תאושר.",
                status = "pending"
            });
        }

        return BadRequest(new { message = "לא ניתן לשלוח בקשת גישה, נא לפנות למורה באופן ישיר" });
    }

    [HttpPost("approve-access")]
    public async Task<IActionResult> ApproveAccess([FromBody] ApproveAccessModel request)
    {
        if (string.IsNullOrEmpty(request.RequestToken))
            return BadRequest(new { message = "חסר מזהה בקשה" });

        var shared = await _datacontext.SharedLessons
            .Include(s => s.Lesson)
            .FirstOrDefaultAsync(s => s.AccessRequestToken == request.RequestToken);

        if (shared == null)
            return NotFound(new { message = "בקשת גישה לא נמצאה או שפג תוקפה" });

        // עדכון סטטוס האישור
        shared.IsApproved = request.Approved;

        if (request.Approved)
        {
            // יצירת קוד אימות למייל החדש
            string verificationCode = GenerateVerificationCode();
            shared.EmailVerificationCode = verificationCode;
            shared.EmailVerificationExpiry = DateTime.UtcNow.Add(OTP_VALIDITY);
            shared.FailedVerificationAttempts = 0;
        }

        await _datacontext.SaveChangesAsync();

        if (request.Approved)
        {
            // שליחת מייל למבקש הגישה עם קישור לשיעור
            string accessLink = $"http://localhost:5174/shared-lesson?token={shared.Token}";
            await SendAccessApprovedEmail(shared.SharedWithEmail, shared.Lesson.LessonName, accessLink);

            return Ok(new
            {
                message = "הגישה אושרה ונשלחה הודעה למבקש",
                status = "approved"
            });
        }

        return Ok(new
        {
            message = "בקשת הגישה נדחתה",
            status = "rejected"
        });
    }


    [HttpDelete("{lessonId}")]
    public async Task<IActionResult> RemoveSharing(int lessonId)
    {
        var shares = await _datacontext.SharedLessons
            .Where(s => s.LessonId == lessonId)
            .ToListAsync();

        if (shares.Count == 0)
            return NotFound(new { message = "לא נמצאו שיתופים לשיעור זה" });

        _datacontext.SharedLessons.RemoveRange(shares);
        await _datacontext.SaveChangesAsync();

        return Ok(new { message = "כל השיתופים לשיעור זה הוסרו בהצלחה" });
    }
}
