using AutoMapper;
using Study.Core.DTOs;
using Study.Core.Entities;
using Study.Core.Interface.IntarfaceService;
using Study.Core.Interface.InterfaceRepository;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Study.Services
{
    public class MessageService : IMessageService
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IReposiroryManager _repositoryManager;
        private readonly IMapper _mapper;

        public MessageService(IMessageRepository messageRepository, IMapper mapper, IReposiroryManager repositoryManager)
        {
            _messageRepository = messageRepository;
            _mapper = mapper;
            _repositoryManager = repositoryManager;
        }

        public async Task<IEnumerable<MessageDTO>> GetAllMessagesAsync()
        {
            var messages = await _messageRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<MessageDTO>>(messages);
        }

        public async Task<MessageDTO> AddMessageAsync(MessageDTO messageDto)
        {
            var message = _mapper.Map<Message>(messageDto);
            message.CreatedAt = System.DateTime.Now;
            message.IsRead = false; // הודעה חדשה תמיד מתחילה כלא נקראה

            Message result = await _messageRepository.AddAsync(message);
            await _repositoryManager.SaveAsync();

            return _mapper.Map<MessageDTO>(result);
        }

        public async Task<IEnumerable<MessageDTO>> GetMessagesByUserIdAsync(int userId)
        {
            var messages = await _messageRepository.GetMessagesByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<MessageDTO>>(messages);
        }

        public async Task<bool> DeleteMessageAsync(int id)
        {
            bool result = await _messageRepository.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
            return result;
        }

        public async Task<bool> MarkAsReadAsync(int id)
        {
            bool result = await _messageRepository.MarkAsReadAsync(id);
            if (result)
                await _repositoryManager.SaveAsync();
            return result;
        }
    }
}
