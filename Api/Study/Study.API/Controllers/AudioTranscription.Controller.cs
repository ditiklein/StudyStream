//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.SignalR;
//using Microsoft.Extensions.Logging;
//using OpenAI.Managers;
//using OpenAI;
//using OpenAI.ObjectModels;
//using OpenAI.ObjectModels.RequestModels;
//using System;
//using System.IO;
//using System.Threading.Tasks;
//using NAudio.Wave;
//using Microsoft.AspNetCore.Http;
//using System.Text.Json;

//[ApiController]
//[Route("api/[controller]")]
//public class AudioTranscriptionController : ControllerBase
//{
//    private readonly IHubContext<TranscriptionHub> _hubContext;
//    private readonly OpenAIService _openAIService;
//    private readonly ILogger<AudioTranscriptionController> _logger;

//    public AudioTranscriptionController(
//        IHubContext<TranscriptionHub> hubContext,
//        OpenAIService openAIService,
//        ILogger<AudioTranscriptionController> logger)
//    {
//        _hubContext = hubContext;
//        _openAIService = openAIService;
//        _logger = logger;
//    }

//    [HttpPost("upload")]
//    public async Task<IActionResult> UploadAudio(
//        IFormFile audioFile,
//        [FromQuery] string connectionId)
//    {
//        if (audioFile == null || audioFile.Length == 0)
//            return BadRequest("אין קובץ שמע");

//        if (string.IsNullOrEmpty(connectionId))
//            return BadRequest("חסר מזהה חיבור");

//        try
//        {
//            _logger.LogInformation($"מתחיל תמלול עבור חיבור: {connectionId}");

//            // יצירת תיקייה זמנית אם אינה קיימת
//            var tempDir = Path.Combine(Directory.GetCurrentDirectory(), "TempAudio");
//            Directory.CreateDirectory(tempDir);

//            // שמירת קובץ זמני
//            var tempFilePath = Path.Combine(tempDir, Guid.NewGuid().ToString() + Path.GetExtension(audioFile.FileName));
//            using (var fileStream = new FileStream(tempFilePath, FileMode.Create))
//            {
//                await audioFile.CopyToAsync(fileStream);
//            }

//            // התחלת התמלול בתהליך נפרד
//            _ = TranscribeAudioAsync(tempFilePath, connectionId);

//            return Ok(new { message = "הקובץ נשלח לתמלול", connectionId = connectionId });
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, "שגיאה בעיבוד העלאת האודיו");
//            return StatusCode(500, $"שגיאה: {ex.Message}");
//        }
//    }

//    private async Task TranscribeAudioAsync(string audioFilePath, string connectionId)
//    {
//        try
//        {
//            await _hubContext.Clients.Client(connectionId).SendAsync(
//                "TranscriptionStatus", "התחלת תמלול...");

//            // ממירים ל-WAV אם צריך
//            var wavFilePath = Path.ChangeExtension(audioFilePath, "wav");
//            ConvertToWav(audioFilePath, wavFilePath);

//            // תמלול עם OpenAI Whisper
//            using (var fileStream = new FileStream(wavFilePath, FileMode.Open))
//            {
//                // המרת FileStream לבייטים
//                byte[] fileBytes;
//                using (var memoryStream = new MemoryStream())
//                {
//                    await fileStream.CopyToAsync(memoryStream);
//                    fileBytes = memoryStream.ToArray();
//                }

//                var transcriptionRequest = new AudioCreateTranscriptionRequest
//                {
//                    Model = Models.WhisperV1,
//                    File = fileBytes,
//                    Language = "he", // עברית
//                    ResponseFormat = "json"
//                };

//                var result = await _openAIService.Audio.CreateTranscription(transcriptionRequest);

//                if (result.Successful)
//                {
//                    var resultText = string.Empty;

//                    try
//                    {
//                        // בהנחה שהחבילה מחזירה Text כמאפיין
//                        resultText = result.Text;

//                        // במקרה שיש בעיה לגשת ל-Text ישירות
//                        if (string.IsNullOrEmpty(resultText))
//                        {
//                            var resultJson = JsonSerializer.Serialize(result);
//                            var responseObj = JsonSerializer.Deserialize<JsonElement>(resultJson);

//                            if (responseObj.TryGetProperty("text", out JsonElement textElement))
//                            {
//                                resultText = textElement.GetString();
//                            }
//                        }

//                        // שליחת תוצאה ללקוח
//                        if (!string.IsNullOrEmpty(resultText))
//                        {
//                            foreach (var segment in resultText.Split('\n'))
//                            {
//                                if (!string.IsNullOrWhiteSpace(segment))
//                                {
//                                    await _hubContext.Clients.Client(connectionId).SendAsync(
//                                        "ReceiveTranscription", new { text = segment });
//                                }
//                            }

//                            await _hubContext.Clients.Client(connectionId).SendAsync(
//                                "TranscriptionComplete", "התמלול הושלם בהצלחה");
//                        }
//                        else
//                        {
//                            await _hubContext.Clients.Client(connectionId).SendAsync(
//                                "TranscriptionError", "לא התקבל טקסט מהתמלול");
//                        }
//                    }
//                    catch (Exception ex)
//                    {
//                        _logger.LogError(ex, "שגיאה בעיבוד תוצאת התמלול");
//                        await _hubContext.Clients.Client(connectionId).SendAsync(
//                            "TranscriptionError", $"שגיאה בעיבוד תוצאות התמלול: {ex.Message}");
//                    }
//                }
//                else
//                {
//                    _logger.LogError("שגיאת OpenAI API: {Error}", result.Error?.Message);
//                    await _hubContext.Clients.Client(connectionId).SendAsync(
//                        "TranscriptionError", $"שגיאה בתמלול: {result.Error?.Message}");
//                }
//            }

//            // ניקוי קבצים זמניים
//            if (System.IO.File.Exists(audioFilePath))
//                System.IO.File.Delete(audioFilePath);

//            if (System.IO.File.Exists(wavFilePath))
//                System.IO.File.Delete(wavFilePath);
//        }
//        catch (Exception ex)
//        {
//            _logger.LogError(ex, "שגיאה בתהליך התמלול");
//            await _hubContext.Clients.Client(connectionId).SendAsync(
//                "TranscriptionError", $"שגיאה בתמלול: {ex.Message}");
//        }
//    }

//    private void ConvertToWav(string inputPath, string outputPath)
//{
//    try
//    {
//        if (string.IsNullOrEmpty(inputPath))
//        {
//            throw new ArgumentNullException(nameof(inputPath), "נתיב קובץ הקלט ריק");
//        }

//        if (!System.IO.File.Exists(inputPath))
//        {
//            throw new FileNotFoundException("קובץ הקלט לא נמצא", inputPath);
//        }

//        using (var reader = new MediaFoundationReader(inputPath))
//        {
//            WaveFileWriter.CreateWaveFile(outputPath, reader);
//        }
//    }
//    catch (Exception ex)
//    {
//        _logger.LogError(ex, $"שגיאה בהמרת אודיו ל-WAV. נתיב קלט: {inputPath}, נתיב פלט: {outputPath}");
//        throw new Exception($"שגיאה בהמרת קובץ השמע: {ex.Message}", ex);
//    }
//}

//}
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using OpenAI.Managers;
using OpenAI.ObjectModels;
using OpenAI.ObjectModels.RequestModels;
using System;
using System.IO;
using System.Threading.Tasks;
using NAudio.Wave;
using Microsoft.AspNetCore.Http;
using System.Text.Json;
using OpenAI.ObjectModels.RequestModels;
using OpenAI.ObjectModels;
using OpenAI;


[ApiController]
[Route("api/[controller]")]
public class AudioTranscriptionController : ControllerBase
{
    private readonly IHubContext<TranscriptionHub> _hubContext;
    private readonly OpenAIService _openAIService;
    private readonly ILogger<AudioTranscriptionController> _logger;

    public AudioTranscriptionController(
        IHubContext<TranscriptionHub> hubContext,
        OpenAIService openAIService,
        ILogger<AudioTranscriptionController> logger)
    {
        _hubContext = hubContext;
        _openAIService = openAIService;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadAudio(
        IFormFile audioFile,
        [FromQuery] string connectionId)
    {
        if (audioFile == null || audioFile.Length == 0)
            return BadRequest("אין קובץ שמע");

        if (string.IsNullOrEmpty(connectionId))
            return BadRequest("חסר מזהה חיבור");

        try
        {
            _logger.LogInformation($"מתחיל תמלול עבור חיבור: {connectionId}");

            // יצירת תיקייה זמנית אם אינה קיימת
            var tempDir = Path.Combine(Directory.GetCurrentDirectory(), "TempAudio");
            Directory.CreateDirectory(tempDir);

            // שמירת קובץ זמני
            var tempFilePath = Path.Combine(tempDir, Guid.NewGuid().ToString() + Path.GetExtension(audioFile.FileName));
            using (var fileStream = new FileStream(tempFilePath, FileMode.Create))
            {
                await audioFile.CopyToAsync(fileStream);
            }

            // התחלת התמלול בתהליך נפרד
            _ = TranscribeAudioAsync(tempFilePath, connectionId, audioFile.FileName); // שליחת שם הקובץ המקורי

            return Ok(new { message = "הקובץ נשלח לתמלול", connectionId = connectionId });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "שגיאה בעיבוד העלאת האודיו");
            return StatusCode(500, $"שגיאה: {ex.Message}");
        }
    }

    private async Task TranscribeAudioAsync(string audioFilePath, string connectionId, string originalFileName)
    {
        try
        {
            if (string.IsNullOrEmpty(audioFilePath))
            {
                await _hubContext.Clients.Client(connectionId).SendAsync(
                    "TranscriptionError", "שגיאה: נתיב קובץ האודיו ריק");
                return;
            }

            if (!System.IO.File.Exists(audioFilePath))
            {
                await _hubContext.Clients.Client(connectionId).SendAsync(
                    "TranscriptionError", $"שגיאה: קובץ האודיו לא נמצא בנתיב {audioFilePath}");
                return;
            }

            await _hubContext.Clients.Client(connectionId).SendAsync(
                "TranscriptionStatus", "התחלת תמלול...");

            // ממירים ל-WAV אם צריך
            var wavFilePath = Path.ChangeExtension(audioFilePath, "wav");
            ConvertToWav(audioFilePath, wavFilePath);

            // תמלול עם OpenAI Whisper
            using (var fileStream = new FileStream(wavFilePath, FileMode.Open))
            {
                // המרת FileStream לבייטים
                byte[] fileBytes;
                using (var memoryStream = new MemoryStream())
                {
                    await fileStream.CopyToAsync(memoryStream);
                    fileBytes = memoryStream.ToArray();
                }

                var transcriptionRequest = new AudioCreateTranscriptionRequest
                {
                    Model = Models.WhisperV1,
                    File = fileBytes,
                    FileName = originalFileName, // שימוש בשם הקובץ המקורי
                    Language = "he",
                    ResponseFormat = "json"
                };

                var result = await _openAIService.Audio.CreateTranscription(transcriptionRequest);

                if (result.Successful)
                {
                    var resultText = string.Empty;

                    try
                    {
                        // בהנחה שהחבילה מחזירה Text כמאפיין
                        resultText = result.Text;

                        // במקרה שיש בעיה לגשת ל-Text ישירות
                        if (string.IsNullOrEmpty(resultText))
                        {
                            var resultJson = JsonSerializer.Serialize(result);
                            var responseObj = JsonSerializer.Deserialize<JsonElement>(resultJson);

                            if (responseObj.TryGetProperty("text", out JsonElement textElement))
                            {
                                resultText = textElement.GetString();
                            }
                        }

                        // שליחת תוצאה ללקוח
                        if (!string.IsNullOrEmpty(resultText))
                        {
                            foreach (var segment in resultText.Split('\n'))
                            {
                                if (!string.IsNullOrWhiteSpace(segment))
                                {
                                    await _hubContext.Clients.Client(connectionId).SendAsync(
                                        "ReceiveTranscription", new { text = segment });
                                }
                            }

                            await _hubContext.Clients.Client(connectionId).SendAsync(
                                "TranscriptionComplete", "התמלול הושלם בהצלחה");
                        }
                        else
                        {
                            await _hubContext.Clients.Client(connectionId).SendAsync(
                                "TranscriptionError", "לא התקבל טקסט מהתמלול");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "שגיאה בעיבוד תוצאת התמלול");
                        await _hubContext.Clients.Client(connectionId).SendAsync(
                            "TranscriptionError", $"שגיאה בעיבוד תוצאות התמלול: {ex.Message}");
                    }
                }
                else
                {
                    _logger.LogError("שגיאת OpenAI API: {Error}", result.Error?.Message);
                    await _hubContext.Clients.Client(connectionId).SendAsync(
                        "TranscriptionError", $"שגיאה בתמלול: {result.Error?.Message}");
                }
            }

            // ניקוי קבצים זמניים
            if (System.IO.File.Exists(audioFilePath))
                System.IO.File.Delete(audioFilePath);

            if (System.IO.File.Exists(wavFilePath))
                System.IO.File.Delete(wavFilePath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "שגיאה בתהליך התמלול");
            await _hubContext.Clients.Client(connectionId).SendAsync(
                "TranscriptionError", $"שגיאה בתמלול: {ex.Message}");
        }
    }
       private void ConvertToWav(string inputPath, string outputPath)
    {
        try
        {
            if (string.IsNullOrEmpty(inputPath))
            {
                throw new ArgumentNullException(nameof(inputPath), "נתיב קובץ הקלט ריק");
            }

            if (!System.IO.File.Exists(inputPath))
            {
                throw new FileNotFoundException("קובץ הקלט לא נמצא", inputPath);
            }

            using (var reader = new MediaFoundationReader(inputPath))
            {
                WaveFileWriter.CreateWaveFile(outputPath, reader);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"שגיאה בהמרת אודיו ל-WAV. נתיב קלט: {inputPath}, נתיב פלט: {outputPath}");
            throw new Exception($"שגיאה בהמרת קובץ השמע: {ex.Message}", ex);
        }
        }
}








