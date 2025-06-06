﻿using AutoMapper;
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
    public class LessonController : ControllerBase
    {
        readonly ILessonService _lessonService;
        readonly IMapper _mapper;

        public LessonController(ILessonService lessonService, IMapper mapper)
        {
            _lessonService = lessonService;
            _mapper = mapper;
        }

        // GET: api/Lesson
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LessonDTO>>> Get()
        {
            return Ok(await _lessonService.GetAllLessonsAsync());
        }

        // GET api/Lesson/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LessonDTO>> GetById(int id)
        {
            if (id < 0) return BadRequest();

            var result =await _lessonService.GetLessonByIdAsync(id);
            if (result == null) return NotFound();

            return Ok(result);
        }

        // POST api/Lesson
        [HttpPost]
        public async Task<ActionResult<LessonDTO>> Post([FromBody] LessonPostModel lesson)
        {
            if (lesson == null) return BadRequest("User data is required");
            var LessonD = _mapper.Map<LessonDTO>(lesson);
            var result = await _lessonService.AddLessonAsync(LessonD);
            if (result == null) return BadRequest("User already exists or could not be added");
            return Ok(result);
        }

        // PUT api/Lesson/5
        [HttpPut("{id}")]
        public async Task<ActionResult<bool>> Put(int id, [FromBody] LessonPostModel lesson)
        {
            if (lesson == null || id < 0) return BadRequest("Invalid input");
            var LessonD = _mapper.Map<LessonDTO>(lesson);
            var result = await _lessonService.UpdateLessonAsync(id, LessonD);
            if (result == null) return NotFound("User not found");
            return Ok(result.Id);
        }

        // DELETE api/Lesson/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> Delete(int id)
        {
            if (id < 0) return BadRequest("Invalid input");
            bool result = await _lessonService.DeleteLessonAsync(id);
            return result ? Ok(result) : NotFound("User not found or could not be deleted");
        }
        [HttpGet("lessons/{folderId}")]
        
        public async Task<ActionResult<IEnumerable<LessonDTO>>> GetFilesInFolder(int folderId)
        {
            var files = await _lessonService.GetFilesInFolderAsync(folderId);

            if (files == null || !files.Any())
            {
                return NotFound("No files found in the folder.");
            }

            return Ok(files);
        }
        [HttpGet("root/{ownerId}")]
        public async Task<ActionResult<IEnumerable<LessonDTO>>> GetRootFolders(int ownerId)
        {
            if (ownerId < 0) return BadRequest("Invalid owner ID");

            var files = await _lessonService.GetRootFilesAsync(ownerId);

            if (files == null || !files.Any()) return NotFound("No root folders found");

            var folderDTOs = _mapper.Map<IEnumerable<LessonDTO>>(files);

            return Ok(folderDTOs);

        }
      
        [HttpGet("lessons/user/{userId}")]
        public async Task<ActionResult<IEnumerable<LessonDTO>>> GetUserLessons(int userId)
        {
            if (userId < 0) return BadRequest("Invalid user ID");

            var folders = await _lessonService.GetUserLessonsAsync(userId);

            if (folders == null || !folders.Any()) return NotFound("No folders found for this user");

            return Ok(folders);
        }
        [HttpGet("deleted/{ownerId}")]
        public async Task<ActionResult<IEnumerable<LessonDTO>>> GetDeletedLessons(int ownerId)
        {
            if (ownerId < 0) return BadRequest("Invalid owner ID");

            var lessons = await _lessonService.GetDeletedLessonsByOwnerIdAsync(ownerId);


            return Ok(lessons);
        }
        [HttpDelete("harddelete/{id}")]
        public async Task<ActionResult<bool>> DeleteHard(int id)
        {
            if (id < 0) return BadRequest("Invalid input");

            bool result = await _lessonService.DeleteHardLessonAsync(id);

            // אם המחיקה הצליחה, מחזירים תשובה חיובית
            if (result)
            {
                return Ok("Lesson permanently deleted.");
            }

            // אם לא הצליחה, מחזירים תשובה של לא נמצא
            return NotFound("Lesson not found or could not be permanently deleted");
        }
        [HttpGet("search-files")]
        public async Task<IActionResult> SearchFiles([FromQuery] int userId, [FromQuery] int folderId, [FromQuery] string query)
        {
            var files = await _lessonService.SearchFilesAsync(userId, folderId, query);
            return Ok(files);
        }
        [HttpGet("with-transcript")]
        public async Task<IActionResult> GetLessonsWithTranscript()
        {
            var lessons = await _lessonService.GetLessonsWithTranscriptAsync();
            return Ok(lessons);
        }

        [HttpGet("without-transcript")]
        public async Task<IActionResult> GetLessonsWithoutTranscript()
        {
            var lessons = await _lessonService.GetLessonsWithoutTranscriptAsync();
            return Ok(lessons);
        }



    }

}

