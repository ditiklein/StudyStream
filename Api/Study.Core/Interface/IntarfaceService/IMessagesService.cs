using Study.Core.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Study.Core.Interface.IntarfaceService
{
    public interface IMessageService
    {
        Task<IEnumerable<MessageDTO>> GetAllMessagesAsync();
        Task<MessageDTO> AddMessageAsync(MessageDTO messageDto);
        Task<IEnumerable<MessageDTO>> GetMessagesByUserIdAsync(int userId);
        Task<bool> DeleteMessageAsync(int id);
        Task<bool> MarkAsReadAsync(int id);
    }
}
