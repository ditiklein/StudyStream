using Study.Core.DTOs;
using Study.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.Interface.IntarfaceService
{
    public interface ILessonService
    {
        Task<IEnumerable<LessonDTO>> GetAllLessonsAsync();
        Task<LessonDTO> GetLessonByIdAsync(int id);
        Task<LessonDTO> UpdateLessonAsync(int id, LessonDTO lesson);
        Task<LessonDTO> AddLessonAsync(LessonDTO lesson);
        Task<bool> DeleteLessonAsync(int id);
        Task<IEnumerable<LessonDTO>> GetFilesInFolderAsync(int folderId);
        Task<IEnumerable<Lesson>> GetRootFilesAsync(int ownerId);
        Task<IEnumerable<LessonDTO>> GetUserLessonsAsync(int userId);
        Task<IEnumerable<LessonDTO>> GetDeletedLessonsByOwnerIdAsync(int ownerId);
        Task<bool> DeleteHardLessonAsync(int id);
        Task<List<LessonDTO>> SearchFilesAsync(int userId, int currentFolderId, string query);
        Task<IEnumerable<Lesson>> GetLessonsWithTranscriptAsync();
        Task<IEnumerable<Lesson>> GetLessonsWithoutTranscriptAsync();




    }
}
