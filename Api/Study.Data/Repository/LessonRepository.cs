
using Study.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using Study.Core.Interface.InterfaceRepository;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Study.Data.Repository
{
    public class LessonRepository : ILessonRepository
    {
        readonly DataContext _datacontext;

        public LessonRepository(DataContext context)
        {
            _datacontext = context;
        }

        public async Task<IEnumerable<Lesson>> GetAllAsync()
        {
            return await _datacontext.LessonList
                .Where(lesson => !lesson.IsDeleted) // הוספת תנאי לסינון רק שיעורים שלא נמחקו
                .ToListAsync();
        }
        public async Task<Lesson> AddAsync(Lesson lesson)
        {
            _datacontext.LessonList.Add(lesson);
            return lesson;

        }

        public async Task<Lesson?> GetByIdAsync(int id)
        {
            return await _datacontext.LessonList.FirstOrDefaultAsync(l => l.Id == id);
        }

      
        public async Task<Lesson> UpdateAsync(Lesson lesson, int id)
        {
            var existingLesson = _datacontext.LessonList.FirstOrDefault(c => c.Id == id);
            if (existingLesson == null) return null;
            existingLesson.OwnerId = lesson.OwnerId;
            existingLesson.LessonName = lesson.LessonName;
            existingLesson.Url = lesson.Url;
            existingLesson.FolderId = lesson.FolderId;
            existingLesson.FileType = lesson.FileType;
            existingLesson.UpdatedAt = DateTime.Now;




           return lesson;
           
            
               
            
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var lesson = _datacontext.LessonList.FirstOrDefault(c => c.Id == id);
            
            if (lesson == null) return false;
            lesson.IsDeleted = true;

                return true;
            

        }
        public async Task<IEnumerable<Lesson>> GetFilesInFolderAsync(int folderId)
        {
            return await _datacontext.LessonList
                .Where(l => l.FolderId == folderId && !l.IsDeleted)
                .ToListAsync();
        }
        public async Task<IEnumerable<Lesson>> GetRootFileAsync(int ownerId)
        {
            return await _datacontext.LessonList
                .Where(f => f.FolderId == null && f.OwnerId == ownerId&& !f.IsDeleted)
                .ToListAsync();
        }
        public async Task<List<Lesson>> GetByUserIdAsync(int userId)
        {
           

            var userLessons = await _datacontext.LessonList
                .Where(l => l.OwnerId == userId && !l.IsDeleted)
                .Include(l => l.Folder)
                .ToListAsync();

            return userLessons;
        }
        public async Task<List<Lesson>> SearchFilesAsync(string searchTerm)
        {
            return await _datacontext.LessonList
                .Where(f => f.LessonName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))
                .ToListAsync();
        }
        public async Task<IEnumerable<Lesson>> GetUserLessonsAsync(int userId)
        {
            return await _datacontext.LessonList
                .Where(f => f.OwnerId == userId && f.IsDeleted == false)
                .ToListAsync();
        }



    }
}
