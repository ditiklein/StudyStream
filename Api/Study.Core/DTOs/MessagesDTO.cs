using System;

public class MessageDTO
{
    public int Id { get; set; }
    public string Content { get; set; }
    public string? Subject { get; set; }
    public int? UserId { get; set; }
    public string? GuestName { get; set; }
    public string? GuestEmail { get; set; }
    public string? TicketNumber { get; set; }  // שדה חדש למספר פנייה
    public DateTime CreatedAt { get; set; }
    public bool IsRead { get; set; }
    public bool IsDeleted { get; set; }
}
