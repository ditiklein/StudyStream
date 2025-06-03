using System.ComponentModel.DataAnnotations;

public class MessagePostModel
{
    [Required]
    public string Content { get; set; }

    public string? Subject { get; set; }

    public int? UserId { get; set; }  // nullable

    public string? GuestName { get; set; }

    [EmailAddress]
    public string? GuestEmail { get; set; }

    public string? TicketNumber { get; set; }  // שדה חדש למספר פנייה
}
