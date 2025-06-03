using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Study.API.Models;
using Study.Core.DTOs;
using Study.Core.Interface.IntarfaceService;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Study.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        readonly IMessageService _messageService;
        readonly IMapper _mapper;

        public MessageController(IMessageService messageService, IMapper mapper)
        {
            _messageService = messageService;
            _mapper = mapper;
        }

        // GET: api/Message - קבלת כל ההודעות
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> Get()
        {
            return Ok(await _messageService.GetAllMessagesAsync());
        }

        // POST api/Message - הוספת הודעה חדשה
        [HttpPost]
        public async Task<ActionResult<MessageDTO>> Post([FromBody] MessagePostModel message)
        {
            if (message == null) return BadRequest("Message data is required");

            var messageDto = _mapper.Map<MessageDTO>(message);
            var result = await _messageService.AddMessageAsync(messageDto);

            if (result == null) return BadRequest("Message could not be added");

            return Ok(result);
        }

        // GET api/Message/user/5 - קבלת הודעות לפי UserId
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessagesByUserId(int userId)
        {
            if (userId < 0) return BadRequest("Invalid user ID");

            var messages = await _messageService.GetMessagesByUserIdAsync(userId);

            if (messages == null || !messages.Any())
                return NotFound("No messages found for this user");

            return Ok(messages);
        }

        // DELETE api/Message/5 - מחיקת הודעה
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            if (id < 0) return BadRequest("Invalid input");

            bool result = await _messageService.DeleteMessageAsync(id);
            return result ? Ok(result) : NotFound("Message not found or could not be deleted");
        }

        // PUT api/Message/markasread/5 - סימון הודעה כנקראה
        [HttpPut("markasread/{id}")]
        public async Task<ActionResult<bool>> MarkAsRead(int id)
        {
            if (id < 0) return BadRequest("Invalid input");

            bool result = await _messageService.MarkAsReadAsync(id);
            return result ? Ok(result) : NotFound("Message not found or could not be marked as read");
        }
    }
}
