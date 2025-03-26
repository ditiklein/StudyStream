using System.IO;
using Microsoft.AspNetCore.Mvc;
using Amazon.S3;
using Amazon.S3.Model;

[ApiController]
[Route("api/upload")]
public class UploadController : ControllerBase
{
    private readonly IAmazonS3 _s3Client;
    private readonly HashSet<string> _allowedExtensions = new() { ".mp3", ".wav", ".ogg", ".aac", ".flac" };

    public UploadController(IAmazonS3 s3Client)
    {
        _s3Client = s3Client;
    }

    [HttpGet("presigned-url")]
    public async Task<IActionResult> GetPresignedUrl([FromQuery] string fileName)
    {

        var extension = Path.GetExtension(fileName).ToLower();

        // אם הסיומת לא ברשימה, החזרת שגיאה
        if (!_allowedExtensions.Contains(extension))
        {
            return BadRequest("Only audio files are allowed (.mp3, .wav, .ogg, .aac, .flac)");
        }

        string contentType = extension switch
        {
            ".mp3" => "audio/mpeg",
            ".wav" => "audio/wav",
            ".ogg" => "audio/ogg",
            ".aac" => "audio/aac",
            ".flac" => "audio/flac",
            _ => "application/octet-stream" // ברירת מחדל (לא אמור לקרות בגלל הבדיקה)
        };

        var request = new GetPreSignedUrlRequest
        {
            BucketName = "studystream",
            Key = fileName,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.AddMinutes(5),
            ContentType = contentType
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

}
