//using Microsoft.AspNetCore.Mvc;
//using System.Net.Http;
//using System.Net.Http.Headers;
//using System.Text;
//using System.Text.Json;
//using System.Threading.Tasks;

//[ApiController]
//[Route("api")]
//public class KeyPointsController : ControllerBase
//{
//    private readonly IHttpClientFactory _httpClientFactory;
//    private readonly IConfiguration _configuration;

//    public KeyPointsController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
//    {
//        _httpClientFactory = httpClientFactory;
//        _configuration = configuration;
//    }

//    // אין כאן דרישות הרשאה – Endpoint פתוח לכולם
//    [HttpPost("extract-keypoints")]
//    public async Task<IActionResult> ExtractKeyPoints([FromForm] IFormFile file)
//    {
//        if (file == null || file.Length == 0)
//        {
//            return BadRequest("לא נבחר קובץ תקין.");
//        }

//        string text;
//        using (var reader = new StreamReader(file.OpenReadStream()))
//        {
//            text = await reader.ReadToEndAsync();
//        }

//        // קריאה ל-OpenAI לצורך חילוץ נקודות חשובות
//        string openAiApiKey = _configuration["OpenAI:OpenAiApiKey"];
//                                                              // ודאו שהמפתח מוגדר בקובץ ההגדרות או במשתני סביבה
//        var client = _httpClientFactory.CreateClient();
//        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", openAiApiKey);

//        var prompt = $"Extract the key points from the following text:\n\n{text}\n\nKey Points:";

//        var requestBody = new
//        {
//            model = "text-davinci-003",
//            prompt = prompt,
//            max_tokens = 150,
//            temperature = 0.5,
//        };

//        var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
//        Console.WriteLine(  "sdfh");
//        var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);
//        Console.WriteLine(response);

//        if (!response.IsSuccessStatusCode)
//        {
//            return StatusCode((int)response.StatusCode, "אירעה שגיאה בהתקשרות עם OpenAI API");
//        }

//        var responseString = await response.Content.ReadAsStringAsync();
//        using JsonDocument doc = JsonDocument.Parse(responseString);
//        var keyPoints = doc.RootElement
//                           .GetProperty("choices")[0]
//                           .GetProperty("text")
//                           .GetString();

//        return Ok(new { keyPoints });
//    }
//}



using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

[ApiController]
[Route("api")]
public class KeyPointsController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public KeyPointsController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }
        [HttpPost("extract-keypoints")]
        public async Task<IActionResult> ExtractKeyPoints([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("לא נבחר קובץ תקין.");
            }

            string text;
            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                text = await reader.ReadToEndAsync();
            }

            // בודקים אם יש עברית בטקסט
            bool containsHebrew = text.Any(c => c >= 'א' && c <= 'ת');

            // קובעים את השפה של ההנחיה ל-OpenAI
            string systemMessage = containsHebrew
                ? "חַלֵץ את הנקודות החשובות מהטקסט הבא בעברית."
                : "Extract the key points from the following text in English.";

            string openAiApiKey = _configuration["OpenAI:OpenAiApiKey"];
            var client = _httpClientFactory.CreateClient();
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", openAiApiKey);

            var requestBody = new
            {
                model = "gpt-3.5-turbo",
                messages = new[]
                {
            new { role = "system", content = systemMessage },
            new { role = "user", content = text }
        },
                max_tokens = 150,
                temperature = 0.5,
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, $"שגיאה בהתקשרות עם OpenAI API: {await response.Content.ReadAsStringAsync()}");
            }

            var responseString = await response.Content.ReadAsStringAsync();
            using JsonDocument doc = JsonDocument.Parse(responseString);
            var keyPoints = doc.RootElement
                               .GetProperty("choices")[0]
                               .GetProperty("message")
                               .GetProperty("content")
                               .GetString();

            return Ok(new { keyPoints });
        }

    }

