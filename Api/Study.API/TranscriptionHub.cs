using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

public class TranscriptionHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        // שליחת מזהה החיבור ללקוח
        await Clients.Caller.SendAsync("Connected", Context.ConnectionId);
        await base.OnConnectedAsync();
    }

    public async Task JoinTranscriptionGroup(string transcriptionId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, transcriptionId);
        await Clients.Caller.SendAsync("JoinedGroup", transcriptionId);
    }

    public async Task LeaveTranscriptionGroup(string transcriptionId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, transcriptionId);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        // אפשר להוסיף כאן קוד ניקוי
        await base.OnDisconnectedAsync(exception);
    }
}
