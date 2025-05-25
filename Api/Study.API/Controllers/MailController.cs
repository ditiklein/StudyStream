using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MailKit.Net.Smtp;
using System.Text;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MailController : ControllerBase
    {
        private readonly string _email;
        private readonly string _password;

        public MailController(IConfiguration configuration)
        {
            _email = configuration["Email"];
            _password = configuration["EmailPassword"];
        }

        [HttpPost]
        [Route("send-email")]
        public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
        {
            try
            {
                var templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "ManaggerMail.html");
                var htmlTemplate = await System.IO.File.ReadAllTextAsync(templatePath, Encoding.UTF8);

                var bodyWithHtml = htmlTemplate
                    .Replace("{{Subject}}", request.Subject)
                    .Replace("{{Body}}", request.Body.Replace("\n", "<br>"));

                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("StudStream System", _email));
                message.To.Add(new MailboxAddress("", request.To));
                message.Subject = request.Subject;

                var bodyBuilder = new BodyBuilder { HtmlBody = bodyWithHtml };
                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync("smtp.gmail.com", 587, false);
                await client.AuthenticateAsync(_email, _password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                return Ok("Email sent successfully");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }
    }

    public class EmailRequest
    {
        public string To { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
