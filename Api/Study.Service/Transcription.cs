//
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

public class TranscriptionSe
{
    private readonly ILogger<TranscriptionSe> _logger;
    private readonly string _openAiApiKey;

    public TranscriptionSe(ILogger<TranscriptionSe> logger)
    {

        _logger = logger;
        _openAiApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY")
            ?? throw new InvalidOperationException("OPENAI_API_KEY is not set in environment variables.");

     }
    

public async Task<string> TranscribeAudioFullAsync(string audioFilePath)
    {
        _logger.LogInformation($"Starting transcription for file: {Path.GetFileName(audioFilePath)}");

        if (!File.Exists(audioFilePath))
        {
            _logger.LogError($"File not found: {audioFilePath}");
            throw new FileNotFoundException($"Audio file not found: {audioFilePath}");
        }

        // בדיקת גודל הקובץ - ודא שהוא לא חורג מהמגבלה של OpenAI (כ-25MB)
        var fileInfo = new FileInfo(audioFilePath);
        if (fileInfo.Length > 25 * 1024 * 1024)
        {
            _logger.LogError($"File size exceeds OpenAI limit: {fileInfo.Length / (1024 * 1024)}MB");
            throw new InvalidOperationException("File size exceeds OpenAI limit of 25MB");
        }

        using var client = new HttpClient();
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.openai.com/v1/audio/transcriptions");

        // הוסף את מפתח ה-API להרשאות
        request.Headers.Add("Authorization", $"Bearer {_openAiApiKey}");

        using var formData = new MultipartFormDataContent();

        // הוספת מודל Whisper כפרמטר חובה
        formData.Add(new StringContent("whisper-1"), "model");

        // הוספת הקובץ
        try
        {
            await using var fileStream = File.OpenRead(audioFilePath);

            var fileContent = new StreamContent(fileStream);
            string contentType = GetContentTypeFromExtension(Path.GetExtension(audioFilePath));
            fileContent.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue(contentType);

            // הוספת הקובץ לטופס עם שם שדה "file" כנדרש ב-API
            formData.Add(fileContent, "file", Path.GetFileName(audioFilePath));

            // הגדרת הבקשה
            request.Content = formData;

            _logger.LogInformation("Sending request to OpenAI API");

            try
            {
                // שליחת הבקשה לשרת
                using var response = await client.SendAsync(request);

                // קריאת התגובה כטקסט לצורך דיבוג
                var responseContent = await response.Content.ReadAsStringAsync();
                _logger.LogInformation($"Received response with status code: {response.StatusCode}");
                _logger.LogInformation($"Response content: {responseContent}");

                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError($"OpenAI API error: {responseContent}");
                    throw new HttpRequestException($"OpenAI API error: {responseContent}");
                }

                // עיבוד התגובה
                var resultJson = JsonDocument.Parse(responseContent);

                // בדיקה אם קיים שדה "text" בתגובה
                if (resultJson.RootElement.TryGetProperty("text", out var textElement))
                {
                    var fullText = textElement.GetString();
                    _logger.LogInformation("Transcription completed successfully");
                    return fullText ?? string.Empty;
                }
                else
                {
                    _logger.LogError("Missing 'text' field in OpenAI response");
                    throw new InvalidOperationException("Missing 'text' field in OpenAI response");
                }
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError(ex, "HTTP request error when calling OpenAI API");
                throw;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in transcription service");
            throw;
        }
    }

    private string GetContentTypeFromExtension(string extension)
    {
        return extension.ToLower() switch
        {
            ".mp3" => "audio/mpeg",
            ".wav" => "audio/wav",
            ".m4a" => "audio/mp4",
            ".ogg" => "audio/ogg",
            ".flac" => "audio/flac",
            _ => "audio/mpeg" // ברירת מחדל
        };
    }
}