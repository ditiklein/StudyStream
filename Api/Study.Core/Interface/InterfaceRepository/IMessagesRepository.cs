using Study.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Study.Core.Interface.InterfaceRepository
{
    public interface IMessageRepository : IRepository<Message>
    {
        Task<IEnumerable<Message>> GetMessagesByUserIdAsync(int userId);
        Task<bool> MarkAsReadAsync(int id);
    }
}
