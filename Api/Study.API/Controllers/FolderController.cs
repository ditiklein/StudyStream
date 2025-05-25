using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Study.API.Models;
using Study.Core.DTOs;
using Study.Core.Entities;
using Study.Core.Interface.IntarfaceService;
using Study.Service;
using Study.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Study.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FolderController : ControllerBase
    {
        readonly IFolderService _folderService;
        readonly IMapper _mapper;

        public FolderController(IFolderService folderService, IMapper mapper)
        {
            _folderService = folderService;
            _mapper = mapper;
        }

        // GET: api/Lesson
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LessonDTO>>> Get()
        {
            return Ok(await _folderService.GetAllFoldersAsync());
        }

        // GET api/Lesson/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LessonDTO>> GetById(int id)
        {
            if (id < 0) return BadRequest();

            var result = await _folderService.GetFolderByIdAsync(id);
            if (result == null) return NotFound();

            return Ok(result);
        }

        // POST api/Lesson
        [HttpPost]
        public async Task<ActionResult<bool>> Post([FromBody] FolderPostModel folder)
        {
            if (folder == null) return BadRequest("User data is required");
            var FolderD = _mapper.Map<FolderDTO>(folder);
            var result = await _folderService.AddFolderAsync(FolderD);
            if (result == null) return BadRequest("User already exists or could not be added");
            return Ok(result);
        }

        // PUT api/Lesson/5
        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> Put(int id, [FromBody] FolderPostModel folder)
        {
            if (folder == null || id < 0) return BadRequest("Invalid input");
            var FolderD = _mapper.Map<FolderDTO>(folder);
            var result = await _folderService.UpdateFolderAsync(id, FolderD);
            if (result == null) return NotFound("User not found");
            return Ok(result.Id);
        }

        // DELETE api/Lesson/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            if (id < 0) return BadRequest("Invalid input");
            bool result = await _folderService.DeleteFolderAsync(id);
            return result ? Ok(result) : NotFound("User not found or could not be deleted");
        }
        [HttpGet("root/{ownerId}")]
        public async Task<ActionResult<IEnumerable<FolderDTO>>> GetRootFolders(int ownerId)
        {
            if (ownerId < 0) return BadRequest("Invalid owner ID");

            var folders = await _folderService.GetRootFoldersAsync(ownerId);

            if (folders == null || !folders.Any()) return NotFound("No root folders found");

            var folderDTOs = _mapper.Map<IEnumerable<FolderDTO>>(folders);

            return Ok(folderDTOs);

        }
        [HttpGet("subfolders/{parentFolderId}/user/{ownerId}")]
        public async Task<ActionResult<IEnumerable<FolderDTO>>> GetSubFolders(int parentFolderId, int ownerId)
        {
            if (parentFolderId < 0 || ownerId < 0)
                return BadRequest("Invalid input");

            var subFolders = await _folderService.GetSubFoldersAsync(parentFolderId, ownerId);

            if (subFolders == null || !subFolders.Any())
                return NotFound("No subfolders found for this user");

            return Ok(subFolders);
        }

        [HttpGet("folders/{userId}")]
        public async Task<ActionResult<IEnumerable<FolderDTO>>> GetUserFolders(int userId)
        {
            if (userId < 0) return BadRequest("Invalid user ID");

            var folders = await _folderService.GetUserFoldersAsync(userId);

            if (folders == null || !folders.Any()) return NotFound("No folders found for this user");

            return Ok(folders);
        }
        [HttpGet("search-folders")]
        public async Task<IActionResult> SearchFolders(
            [FromQuery] int userId,
            [FromQuery] int? folderId, // שינוי סוג הפרמטר ל-int? כדי לתמוך ב-null
            [FromQuery] string query)
        {
            Console.WriteLine($"userId: {userId}, currentFolderId: {folderId}, query: {query}");
            var folders = await _folderService.SearchFoldersAsync(userId, folderId, query);
            return Ok(folders);
        }

    }

}