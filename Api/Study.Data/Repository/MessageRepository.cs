using Study.Core.Entities;
using Study.Core.Interface.InterfaceRepository;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Study.Data.Repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _datacontext;

        public MessageRepository(DataContext context)
        {
            _datacontext = context;
        }

        public async Task<IEnumerable<Message>> GetAllAsync()
        {
            return await _datacontext.MessageList
                .Where(m => !m.IsDeleted)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<Message> AddAsync(Message message)
        {
            await _datacontext.MessageList.AddAsync(message);
            return message;
        }

        public async Task<Message?> GetByIdAsync(int id)
        {
            return await _datacontext.MessageList
                .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);
        }

        public async Task<int> GetIndexByIdAsync(int id)
        {
            var messages = await _datacontext.MessageList.ToListAsync();
            return messages.FindIndex(m => m.Id == id);
        }

        public async Task<Message> UpdateAsync(Message message, int id)
        {
            var existingMessage = await GetByIdAsync(id);
            if (existingMessage == null) return null;

            existingMessage.Content = message.Content;
            existingMessage.IsRead = message.IsRead;

            return existingMessage;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var message = await GetByIdAsync(id);
            if (message == null) return false;

            // מחיקה רכה - סימון כמחוק
            message.IsDeleted = true;
            return true;
        }

        public async Task<IEnumerable<Message>> GetMessagesByUserIdAsync(int userId)
        {
            return await _datacontext.MessageList
                .Where(m => m.UserId == userId && !m.IsDeleted)
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();
        }

        public async Task<bool> MarkAsReadAsync(int id)
        {
            var message = await GetByIdAsync(id);
            if (message == null) return false;

            message.IsRead = true;
            return true;
        }
    }
}
