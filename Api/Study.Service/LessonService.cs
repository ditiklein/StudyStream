using AutoMapper;
using Study.Core.DTOs;
using Study.Core.Entities;
using Study.Core.Interface.IntarfaceService;
using Study.Core.Interface.InterfaceRepository;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace Study.Services
{
    public class LessonService : ILessonService
    {
        readonly ILessonRepository _lessonRepository;
        readonly IFolderRepository _folderRepository;
        readonly IMapper _mapper;
       readonly IReposiroryManager  _repositoryManager;


        public LessonService(ILessonRepository lessonRepository, IMapper mapper, IReposiroryManager repositoryManager, IFolderRepository folderRepository)

        {
            _lessonRepository = lessonRepository;
            _mapper = mapper;
            _repositoryManager = repositoryManager;
            _folderRepository = folderRepository;
        }

        public async Task<IEnumerable<LessonDTO>> GetAllLessonsAsync()
        {
            var lessons =await _lessonRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<LessonDTO>>(lessons);
        }

        public async Task<LessonDTO> GetLessonByIdAsync(int id)
        {
            var lesson =await _lessonRepository.GetByIdAsync(id);
            return _mapper.Map<LessonDTO>(lesson);
        }

        public async Task<LessonDTO> UpdateLessonAsync(int id, LessonDTO lesson)
        {
            var Lesson = _mapper.Map<Lesson>(lesson);
            var result = await _lessonRepository.UpdateAsync(Lesson, id);
            if (result == null)
                return null;
             await _repositoryManager.SaveAsync();    
             return _mapper.Map<LessonDTO>(result);
        }

        public async Task<LessonDTO> AddLessonAsync(LessonDTO lessonDTO)
        {
            if (await GetLessonByIdAsync(lessonDTO.Id) != null)
                return null;
            if (lessonDTO.FolderId != null)
            {
                var existingFolder = await _lessonRepository.GetFilesInFolderAsync(lessonDTO.FolderId.Value);
                if (existingFolder.Any(f => f.LessonName == lessonDTO.LessonName))
                    return null;
            }
            else
            {
                var existingFolder = await _lessonRepository.GetRootFileAsync(lessonDTO.OwnerId);
                if (existingFolder.Any(f => f.LessonName == lessonDTO.LessonName))
                    return null;
            }
            if ((lessonDTO.FolderId <= 0&&(lessonDTO.FolderId!=null)) || lessonDTO.OwnerId <= 0)
            {
                return null; 
            }
            //if (lessonDTO.FolderId != null)
            //{
            //    var folder = await _folderRepository.GetByIdAsync(lessonDTO.FolderId);

            //}
            if ((lessonDTO.FolderId != null && lessonDTO.FolderId <= 0) || lessonDTO.OwnerId <= 0)
            {
                return null;
            }

            var lesson = _mapper.Map<Lesson>(lessonDTO);

            lesson.FolderId = lessonDTO.FolderId;
            lesson.OwnerId = lessonDTO.OwnerId;
            lesson.CreatedAt =DateTime.UtcNow;
            
            Lesson addedLesson = await _lessonRepository.AddAsync(lesson);

            await _repositoryManager.SaveAsync();
            var lessonDTOResult = _mapper.Map<LessonDTO>(addedLesson);
            return lessonDTOResult;

        }

        public async Task<bool> DeleteLessonAsync(int id)
        {
             bool l = await _lessonRepository.DeleteAsync(id);
            await _repositoryManager.SaveAsync();
            return l;
        }
        public async Task<IEnumerable<LessonDTO>> GetFilesInFolderAsync(int folderId)
        {
            var lessons = await _lessonRepository.GetFilesInFolderAsync(folderId);
            return _mapper.Map<IEnumerable<LessonDTO>>(lessons);
        }
        public async Task<IEnumerable<Lesson>> GetRootFilesAsync(int ownerId)
        {
            return await _lessonRepository.GetRootFileAsync(ownerId);
        }
        public async Task<List<LessonDTO>> SearchFilesAsync(string searchTerm)
        {
            var files = await _lessonRepository.SearchFilesAsync(searchTerm);
            return _mapper.Map<List<LessonDTO>>(files);
        }
        public async Task<IEnumerable<LessonDTO>> GetUserLessonsAsync(int userId)
        {
            var folders = await _lessonRepository.GetUserLessonsAsync(userId);
            return _mapper.Map<IEnumerable<LessonDTO>>(folders);
        }




    }
}
