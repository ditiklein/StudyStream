
using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace YourNamespace
{
    [ApiController]
    [Route("api/transcription")]
    public class TranscriptionController : ControllerBase
    {
        private readonly ILogger<TranscriptionController> _logger;
        private readonly TranscriptionSe _transcriptionService;

        public TranscriptionController(
            ILogger<TranscriptionController> logger,
            TranscriptionSe transcriptionService)
        {
            _logger = logger;
            _transcriptionService = transcriptionService;
        }

        [HttpPost("transcribe-full")]
        public async Task<IActionResult> TranscribeFull(IFormFile file)
        {
            _logger.LogInformation($"Received transcription request for file: {file?.FileName ?? "null"}");

            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("No file uploaded or file is empty");
                return BadRequest("No file uploaded or file is empty");
            }

            try
            {
                // בדיקת סוג הקובץ
                string extension = Path.GetExtension(file.FileName).ToLower();
                string[] allowedExtensions = { ".mp3", ".wav", ".m4a", ".ogg", ".flac" };

                if (Array.IndexOf(allowedExtensions, extension) == -1)
                {
                    _logger.LogWarning($"Invalid file type: {extension}");
                    return BadRequest($"Invalid file type. Allowed types: {string.Join(", ", allowedExtensions)}");
                }

                // בדיקת גודל הקובץ
                if (file.Length > 25 * 1024 * 1024) // 25MB
                {
                    _logger.LogWarning($"File too large: {file.Length / (1024 * 1024)}MB");
                    return BadRequest("File size exceeds the 25MB limit");
                }

                // יצירת תיקיית temp אם לא קיימת
                var tempDir = Path.Combine(Path.GetTempPath(), "AudioTranscriptions");
                if (!Directory.Exists(tempDir))
                {
                    Directory.CreateDirectory(tempDir);
                }

                // שמירת הקובץ
                var fileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(tempDir, fileName);

                _logger.LogInformation($"Saving uploaded file to: {filePath}");

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // וידוא שהקובץ נשמר בהצלחה
                if (!System.IO.File.Exists(filePath))
                {
                    _logger.LogError($"Failed to save file to: {filePath}");
                    return StatusCode(500, "Failed to save uploaded file");
                }

                // קריאה לשירות התמלול
                _logger.LogInformation("Calling transcription service");
                var transcriptionResult = await _transcriptionService.TranscribeAudioFullAsync(filePath);

                // מחיקת הקובץ הזמני
                try
                {
                    System.IO.File.Delete(filePath);
                    _logger.LogInformation($"Deleted temporary file: {filePath}");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, $"Failed to delete temporary file: {filePath}");
                    // לא נחזיר שגיאה למשתמש אם לא הצלחנו למחוק את הקובץ הזמני
                }

                _logger.LogInformation("Transcription completed successfully");
                return Ok(new { text = transcriptionResult });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error transcribing audio");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}