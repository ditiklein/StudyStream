using Study.Core.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

public class Message
{
    public int Id { get; set; }

    [Required]
    public string Content { get; set; }

    public string? Subject { get; set; }

    public int? UserId { get; set; }  // nullable

    public string? GuestName { get; set; }

    public string? GuestEmail { get; set; }

    public string? TicketNumber { get; set; }  // שדה חדש למספר פנייה

    public DateTime CreatedAt { get; set; }

    public bool IsRead { get; set; } = false;

    public bool IsDeleted { get; set; } = false;

    [ForeignKey(nameof(UserId))]
    public User? User { get; set; }  // nullable
}
