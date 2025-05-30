//using System.IO;
//using Microsoft.AspNetCore.Mvc;
//using Amazon.S3;
//using Amazon.S3.Model;
//using Microsoft.AspNetCore.Authorization;

//[ApiController]
//[Route("api/upload")]
//public class UploadController : ControllerBase
//{
//    private readonly IAmazonS3 _s3Client;
//    private readonly HashSet<string> _allowedExtensions = new() { ".mp3", ".wav", ".ogg", ".aac", ".flac", ".txt", ".json" };

//    public UploadController(IAmazonS3 s3Client)
//    {
//        _s3Client = s3Client;
//    }


//    [HttpGet("presigned-url")]
//    public async Task<IActionResult> GetPresignedUrl(
//    [FromQuery] string fileName,
//    [FromQuery] string contentType = null) // הוסף פרמטר
//    {
//        var extension = Path.GetExtension(fileName).ToLower();

//        // בדיקת הרשאה
//        if (!_allowedExtensions.Contains(extension))
//        {
//            return BadRequest("Only audio files are allowed (.mp3, .wav, .ogg, .aac, .flac, .txt, .json)");
//        }

//        // אם לא נשלח contentType, השתמש בברירת מחדל לפי הסיומת
//        string finalContentType = contentType ?? extension switch
//        {
//            ".mp3" => "audio/mpeg",
//            ".wav" => "audio/wav",
//            ".ogg" => "audio/ogg",
//            ".aac" => "audio/aac",
//            ".flac" => "audio/flac",
//            ".txt" => "text/plain",
//            ".json" => "application/json",
//            _ => "application/octet-stream"
//        };

//        // הדפס debug info
//        Console.WriteLine($"🔍 Presigned URL Request:");
//        Console.WriteLine($"   - fileName: '{fileName}'");
//        Console.WriteLine($"   - requested contentType: '{contentType}'");
//        Console.WriteLine($"   - final contentType: '{finalContentType}'");

//        var request = new GetPreSignedUrlRequest
//        {
//            BucketName = "studystream",
//            Key = fileName,
//            Verb = HttpVerb.PUT,
//            Expires = DateTime.UtcNow.AddMinutes(5),
//            ContentType = finalContentType // השתמש בערך הסופי
//        };

//        string url = _s3Client.GetPreSignedURL(request);

//        Console.WriteLine($"✅ Generated presigned URL with ContentType: {finalContentType}");

//        return Ok(new { url });
//    }

//    [HttpGet("download-url/{fileName}")]

//    public async Task<string> GetDownloadUrlAsync(string fileName)
//    {
//        var request = new GetPreSignedUrlRequest
//        {
//            BucketName = "studystream",
//            Key = fileName,
//            Verb = HttpVerb.GET,
//            Expires = DateTime.UtcNow.AddDays(300),
//        };

//        return _s3Client.GetPreSignedURL(request);
//    }
//    [HttpDelete("delete/{fileName}")]
//    [Authorize]
//    public async Task<IActionResult> DeleteFileFromS3(string fileName)
//    {
//        try
//        {
//            var deleteRequest = new DeleteObjectRequest
//            {
//                BucketName = "studystream",
//                Key = fileName
//            };

//            var response = await _s3Client.DeleteObjectAsync(deleteRequest);
//            // ניתן להוסיף בדיקה נוספת על התגובה אם יש צורך
//            return Ok(new { message = "File deleted from S3 successfully." });
//        }
//        catch (Exception ex)
//        {
//            return StatusCode(500, new { message = "Error deleting file from S3", error = ex.Message });
//        }
//    }


//}
using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Study.Core.Interface.InterfaceRepository;
using System.IO.Compression;
using System.Text;


[ApiController]
[Route("api/upload")]
public class UploadController : ControllerBase
{
    private readonly IAmazonS3 _s3Client;
    private readonly IFolderRepository _folderRepository;
    private readonly ILessonRepository _lessonRepository;
    private readonly HashSet<string> _allowedExtensions = new() { ".mp3", ".wav", ".ogg", ".aac", ".flac", ".txt", ".json" };

    public UploadController(IAmazonS3 s3Client, IFolderRepository folderRepository, ILessonRepository lessonRepository)
    {
        _s3Client = s3Client;
        _folderRepository = folderRepository;
        _lessonRepository = lessonRepository;
    }

    [HttpGet("presigned-url")]
    public async Task<IActionResult> GetPresignedUrl(
    [FromQuery] string fileName,
    [FromQuery] string contentType = null)
    {
        var extension = Path.GetExtension(fileName).ToLower();

        if (!_allowedExtensions.Contains(extension))
        {
            return BadRequest("Only audio files are allowed (.mp3, .wav, .ogg, .aac, .flac, .txt, .json)");
        }

        string finalContentType = contentType ?? extension switch
        {
            ".mp3" => "audio/mpeg",
            ".wav" => "audio/wav",
            ".ogg" => "audio/ogg",
            ".aac" => "audio/aac",
            ".flac" => "audio/flac",
            ".txt" => "text/plain",
            ".json" => "application/json",
            _ => "application/octet-stream"
        };

        var request = new GetPreSignedUrlRequest
        {
            BucketName = "studystream",
            Key = fileName,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(5),
            ContentType = finalContentType
        };

        string url = _s3Client.GetPreSignedURL(request);
        return Ok(new { url });
    }

    [HttpGet("download-url/{fileName}")]
    public async Task<string> GetDownloadUrlAsync(string fileName)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = "studystream",
            Key = fileName,
            Verb = HttpVerb.GET,
            Expires = DateTime.UtcNow.AddDays(300),
        };
        return _s3Client.GetPreSignedURL(request);
    }

    [HttpDelete("delete/{fileName}")]
    [Authorize]
    public async Task<IActionResult> DeleteFileFromS3(string fileName)
    {
        try
        {
            var deleteRequest = new DeleteObjectRequest
            {
                BucketName = "studystream",
                Key = fileName
            };
            var response = await _s3Client.DeleteObjectAsync(deleteRequest);
            return Ok(new { message = "File deleted from S3 successfully." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error deleting file from S3", error = ex.Message });
        }
    }

    [HttpGet("download-folder-zip/{folderId}")]
    [Authorize]
    public async Task<IActionResult> DownloadFolderAsZip(int folderId)
    {
        try
        {
            Console.WriteLine($"🔄 התחלת יצירת ZIP עבור תיקייה {folderId}");

            var folder = await _folderRepository.GetByIdAsync(folderId);
            if (folder == null)
            {
                Console.WriteLine($"❌ תיקייה {folderId} לא נמצאה");
                return NotFound("תיקייה לא נמצאה");
            }

            Console.WriteLine($"📁 נמצאה תיקייה: {folder.Name}");

            // יצירת ZIP בזיכרון
            using var memoryStream = new MemoryStream();

            await CreateFolderZipAsync(memoryStream, folderId, folder.Name);

            var zipBytes = memoryStream.ToArray();
            Console.WriteLine($"✅ ZIP נוצר בהצלחה, גודל: {zipBytes.Length} bytes");

            if (zipBytes.Length == 0)
            {
                Console.WriteLine("❌ קובץ ZIP ריק");
                return BadRequest("לא ניתן ליצור קובץ ZIP - התיקייה ריקה או שגיאה ביצירה");
            }

            var fileName = $"{SanitizeFileName(folder.Name)}.zip";
            Console.WriteLine($"📥 מחזיר קובץ: {fileName}");

            return File(zipBytes, "application/zip", fileName);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ שגיאה כללית: {ex}");
            return StatusCode(500, $"שגיאה ביצירת קובץ ZIP: {ex.Message}");
        }
    }

    private async Task CreateFolderZipAsync(MemoryStream memoryStream, int folderId, string folderName)
    {
        using var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, leaveOpen: true);

        Console.WriteLine($"🔄 מתחיל להוסיף תיקייה {folderName} ל-ZIP");

        var filesAdded = await AddFolderToZipAsync(archive, folderId, folderName);

        Console.WriteLine($"✅ סיים להוסיף תיקייה {folderName}, קבצים שנוספו: {filesAdded}");

        // וידוא שיש לפחות תיקייה אחת ב-ZIP גם אם אין קבצים
        if (filesAdded == 0)
        {
            var emptyFolderEntry = archive.CreateEntry($"{folderName}/");
            Console.WriteLine($"📁 נוצרה תיקייה ריקה: {folderName}/");
        }
    }

    private async Task<int> AddFolderToZipAsync(ZipArchive archive, int folderId, string currentPath)
    {
        int filesAdded = 0;

        try
        {
            var folder = await _folderRepository.GetByIdAsync(folderId);
            if (folder == null)
            {
                Console.WriteLine($"❌ תיקייה {folderId} לא נמצאה");
                return filesAdded;
            }

            Console.WriteLine($"📁 מעבד תיקייה: {folder.Name} בנתיב: {currentPath}");

            // הוסף את כל הקבצים בתיקייה הנוכחית
            var filesInFolder = await _lessonRepository.GetFilesInFolderAsync(folderId);
            Console.WriteLine($"📄 נמצאו {filesInFolder.Count()} קבצים בתיקייה {folder.Name}");

            foreach (var file in filesInFolder)
            {
                var success = await AddFileToZipFromS3Async(archive, file, currentPath);
                if (success) filesAdded++;
            }

            // הוסף באופן רקורסיבי את כל תיקיות המשנה
            var subFolders = await _folderRepository.GetSubFoldersAsync(folderId, folder.OwnerId);
            Console.WriteLine($"📁 נמצאו {subFolders.Count()} תיקיות משנה בתיקייה {folder.Name}");

            foreach (var subFolder in subFolders)
            {
                var subFolderPath = $"{currentPath}/{subFolder.Name}";
                var subFilesAdded = await AddFolderToZipAsync(archive, subFolder.Id, subFolderPath);
                filesAdded += subFilesAdded;
            }

            // צור תיקייה ריקה אם אין קבצים ותיקיות משנה
            if (filesInFolder.Count() == 0 && subFolders.Count() == 0)
            {
                var emptyFolderEntry = archive.CreateEntry($"{currentPath}/");
                Console.WriteLine($"📁 נוצרה תיקייה ריקה: {currentPath}/");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ שגיאה בעיבוד תיקייה {folderId}: {ex.Message}");
        }

        return filesAdded;
    }

    private async Task<bool> AddFileToZipFromS3Async(ZipArchive archive, Study.Core.Entities.Lesson file, string folderPath)
    {
        try
        {
            if (string.IsNullOrEmpty(file.UrlName))
            {
                Console.WriteLine($"⚠️ קובץ {file.LessonName} ללא UrlName");
                return false;
            }

            Console.WriteLine($"📄 מוריד קובץ מ-S3: {file.UrlName}");

            // יצירת שם קובץ מתאים
            var fileName = !string.IsNullOrEmpty(file.FileType)
                ? $"{SanitizeFileName(file.LessonName)}.{file.FileType}"
                : SanitizeFileName(file.LessonName);

            var filePath = $"{folderPath}/{fileName}";

            // הורדת הקובץ מ-S3
            var getObjectRequest = new GetObjectRequest
            {
                BucketName = "studystream",
                Key = file.UrlName
            };

            using var response = await _s3Client.GetObjectAsync(getObjectRequest);
            using var responseStream = response.ResponseStream;

            // יצירת ערך ב-ZIP
            var entry = archive.CreateEntry(filePath, CompressionLevel.Optimal);

            using var entryStream = entry.Open();
            await responseStream.CopyToAsync(entryStream);

            Console.WriteLine($"✅ קובץ {fileName} נוסף ל-ZIP (גודל: {response.ContentLength} bytes)");
            return true;
        }
        catch (AmazonS3Exception s3Ex) when (s3Ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            Console.WriteLine($"⚠️ קובץ {file.UrlName} לא נמצא ב-S3");
            await AddErrorFileToZip(archive, file, folderPath, "הקובץ לא נמצא ב-S3");
            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ שגיאה בהוספת קובץ {file.LessonName}: {ex.Message}");
            await AddErrorFileToZip(archive, file, folderPath, ex.Message);
            return false;
        }
    }

    private async Task AddErrorFileToZip(ZipArchive archive, Study.Core.Entities.Lesson file, string folderPath, string errorMessage)
    {
        try
        {
            var errorFileName = $"{SanitizeFileName(file.LessonName)}_ERROR.txt";
            var errorFilePath = $"{folderPath}/{errorFileName}";
            var errorEntry = archive.CreateEntry(errorFilePath);

            using var errorStream = errorEntry.Open();
            var errorContent = $"שגיאה בהורדת הקובץ: {file.LessonName}\n" +
                              $"שגיאה: {errorMessage}\n" +
                              $"UrlName: {file.UrlName}\n" +
                              $"תאריך: {DateTime.Now:yyyy-MM-dd HH:mm:ss}";

            var errorBytes = Encoding.UTF8.GetBytes(errorContent);
            await errorStream.WriteAsync(errorBytes, 0, errorBytes.Length);

            Console.WriteLine($"📄 נוצר קובץ שגיאה: {errorFileName}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ שגיאה ביצירת קובץ שגיאה: {ex.Message}");
        }
    }

    private static string SanitizeFileName(string fileName)
    {
        if (string.IsNullOrEmpty(fileName))
            return "unnamed";

        // הסר תווים לא חוקיים משמות קבצים
        var invalidChars = Path.GetInvalidFileNameChars();
        var sanitized = new string(fileName.Where(c => !invalidChars.Contains(c)).ToArray());

        return string.IsNullOrEmpty(sanitized) ? "unnamed" : sanitized;
    }
}

