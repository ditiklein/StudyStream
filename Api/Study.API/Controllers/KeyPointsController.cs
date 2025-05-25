



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
//        [HttpPost("extract-keypoints")]
//        public async Task<IActionResult> ExtractKeyPoints([FromForm] IFormFile file)
//        {
//            if (file == null || file.Length == 0)
//            {
//                return BadRequest("לא נבחר קובץ תקין.");
//            }

//            string text;
//            using (var reader = new StreamReader(file.OpenReadStream()))
//            {
//                text = await reader.ReadToEndAsync();
//            }

//            // בודקים אם יש עברית בטקסט
//            bool containsHebrew = text.Any(c => c >= 'א' && c <= 'ת');

//            // קובעים את השפה של ההנחיה ל-OpenAI
//            string systemMessage = containsHebrew
//                ? "חַלֵץ את הנקודות החשובות מהטקסט הבא בעברית."
//                : "Extract the key points from the following text in English.";

//            string openAiApiKey = _configuration["OpenAI:OpenAiApiKey"];
//            var client = _httpClientFactory.CreateClient();
//            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", openAiApiKey);

//            var requestBody = new
//            {
//                model = "gpt-3.5-turbo",
//                messages = new[]
//                {
//            new { role = "system", content = systemMessage },
//            new { role = "user", content = text }
//        },
//                max_tokens = 150,
//                temperature = 0.5,
//            };

//            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
//            var response = await client.PostAsync("https://api.openai.com/v1/chat/completions", content);

//            if (!response.IsSuccessStatusCode)
//            {
//                return StatusCode((int)response.StatusCode, $"שגיאה בהתקשרות עם OpenAI API: {await response.Content.ReadAsStringAsync()}");
//            }

//            var responseString = await response.Content.ReadAsStringAsync();
//            using JsonDocument doc = JsonDocument.Parse(responseString);
//            var keyPoints = doc.RootElement
//                               .GetProperty("choices")[0]
//                               .GetProperty("message")
//                               .GetProperty("content")
//                               .GetString();

//            return Ok(new { keyPoints });
//        }

//    }




using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api")]
public class KeyPointsController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public KeyPointsController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    // פונקציה לחילוץ נקודות חשובות מהטקסט
    [HttpPost("extract-keypoints")]
    public async Task<IActionResult> ExtractKeyPoints([FromBody] KeyPointsRequest request)
    {
        if (string.IsNullOrEmpty(request.Text))
        {
            return BadRequest("לא נמסר טקסט.");
        }

        // בודקים אם יש עברית בטקסט
        bool containsHebrew = request.Text.Any(c => c >= 'א' && c <= 'ת');

        // קובעים את השפה של ההנחיה ל-OpenAI
        string systemMessage = containsHebrew
            ? "חַלֵץ את הנקודות החשובות מהטקסט הבא בעברית. הצג כל נקודה חשובה בשורה נפרדת ומספר אותן (1, 2, 3, וכו')."
            : "Extract the key points from the following text in English. Present each key point on a separate line and number them (1, 2, 3, etc.).";

        // קריאה למפתח מתוך ENV
        string openAiApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
        if (string.IsNullOrEmpty(openAiApiKey))
        {
            return StatusCode(500, "מפתח ה-API לא נמצא.");
        }

        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", openAiApiKey);

        var requestBody = new
        {
            model = "gpt-3.5-turbo",
            messages = new[]
            {
            new { role = "system", content = systemMessage },
            new { role = "user", content = request.Text }
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

    // מחלקה לקבלת הנתונים מהקליינט
    public class KeyPointsRequest
    {
        public string Text { get; set; }
    }
    // פונקציה לסיכום השיעור
    [HttpPost("summarize-lesson")]
    public async Task<IActionResult> SummarizeLesson([FromBody] LessonSummaryRequest request)
    {
        if (string.IsNullOrEmpty(request.Text))
        {
            return BadRequest("לא נמסר טקסט.");
        }

        // בודקים אם יש עברית בטקסט
        bool containsHebrew = request.Text.Any(c => c >= 'א' && c <= 'ת');

        // קובעים את השפה של ההנחיה ל-OpenAI
        string systemMessage = containsHebrew
            ? "סכם את השיעור הבא בעברית."
            : "Summarize the following lesson in English.";

        // קריאה למפתח מתוך ENV
        string openAiApiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY");
        if (string.IsNullOrEmpty(openAiApiKey))
        {
            return StatusCode(500, "מפתח ה-API לא נמצא.");
        }

        var client = _httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", openAiApiKey);

        var requestBody = new
        {
            model = "gpt-3.5-turbo",
            messages = new[]
            {
            new { role = "system", content = systemMessage },
            new { role = "user", content = request.Text }
        },
            max_tokens = 200,
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
        var summary = doc.RootElement
                         .GetProperty("choices")[0]
                         .GetProperty("message")
                         .GetProperty("content")
                         .GetString();

        return Ok(new { summary });
    }

    // מחלקה לקבלת הנתונים מהקליינט
    public class LessonSummaryRequest
    {
        public string Text { get; set; }
    }
}
