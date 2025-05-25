using Microsoft.AspNetCore.SignalR;

public class TranscriptionHub : Hub
{
    public async Task SendTranscriptionUpdate(string text)
    {
        await Clients.All.SendAsync("ReceiveTranscriptionUpdate", text);
    }
}
