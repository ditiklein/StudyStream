using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Study.API.Models;
using Study.Core.DTOs;
using Study.Core.Entities;
using Study.Core.Interface.IntarfaceService;
using Study.Service;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Study.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TranscriptController : ControllerBase
    {
        readonly ITranscriptService _transcriptService;
        readonly IMapper _mapper;

        public TranscriptController(ITranscriptService transcriptService, IMapper mapper)
        {
            _transcriptService = transcriptService;
            _mapper = mapper;

        }

        // GET: api/Transcript
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TranscriptDTO>>> Get()
        {
            var transcripts =await _transcriptService.GetAllTranscriptAsync();
            return Ok(transcripts);
        }

        // GET api/Transcript/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TranscriptDTO>> GetById(int id)
        {
            if (id < 0) return BadRequest();

            var result =await _transcriptService.GetTranscriptByIdAsync(id);
            if (result == null) return NotFound();

            return Ok(result);
        }

        // POST api/Transcript
        [HttpPost]
        public async Task<ActionResult<bool>> Post([FromBody] TranscriptPostModel transcript)
        {
            if (transcript == null) return BadRequest("User data is required");
            var TranscruptD = _mapper.Map<TranscriptDTO>(transcript);
            var result = await _transcriptService.AddTranscriptAsync(TranscruptD);
            if (result == null) return BadRequest("User already exists or could not be added");
            return Ok(result);
        }

        // PUT api/Transcript/5
        [HttpPut("{id}")]
        public async Task<ActionResult> Put(int id, [FromBody] TranscriptPostModel transcript)
        {
            if (transcript == null || id < 0) return BadRequest("Invalid input");
            var TranscriptD = _mapper.Map<TranscriptDTO>(transcript);
            var result = await _transcriptService.UpdateTranscriptAsync(id, TranscriptD);
            if (result == null) return NotFound("User not found");
            return Ok(result.Id);

        }

        // DELETE api/Transcript/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            if (id < 0) return BadRequest("Invalid input");
            bool result = await _transcriptService.DeleteTranscriptAsync(id);
            return result ? Ok(result) : NotFound("User not found or could not be deleted");

        }
    }
}
