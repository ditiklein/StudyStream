
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
            lesson.UrlName = lesson.LessonName;
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
            existingLesson.UrlName = lesson.LessonName;
            existingLesson.FolderId = lesson.FolderId;
            existingLesson.FileType = lesson.FileType;
            existingLesson.UpdatedAt = DateTime.Now;
            existingLesson.IsDeleted = lesson.IsDeleted;




           return lesson;
           
            
               
            
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var lesson = _datacontext.LessonList.FirstOrDefault(c => c.Id == id);
            
            if (lesson == null) return false;
            lesson.IsDeleted = true;

                return true;
            

        }
        public async Task<bool> DeleteHardAsync(int id)
        {
            var lesson = _datacontext.LessonList.FirstOrDefault(c => c.Id == id);

            if (lesson == null) return false;
            _datacontext.LessonList.Remove(lesson);

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

        public async Task<IEnumerable<Lesson>> GetDeletedLessonsByOwnerIdAsync(int ownerId)
        {
            return await _datacontext.LessonList
                .Where(l => l.OwnerId == ownerId && l.IsDeleted == true)
                .ToListAsync();
        }
        public List<Lesson> GetFilesRecursively(int folderId)
        {
            var allFolders = _datacontext.FolderList.ToList(); // טוען את כל התיקיות לזיכרון
            var allLessons = _datacontext.LessonList.ToList(); // טוען את כל הקבצים לזיכרון

            var folderIds = GetAllSubFolderIds(folderId, allFolders);

            return allLessons
                .Where(l => l.FolderId.HasValue && folderIds.Contains(l.FolderId.Value))
                .ToList();
        }
        public List<int> GetAllSubFolderIds(int folderId, List<Folder> allFolders)
        {
            var folderIds = new List<int> { folderId };

            var subFolders = allFolders.Where(f => f.ParentFolderId == folderId).ToList();

            foreach (var folder in subFolders)
            {
                folderIds.AddRange(GetAllSubFolderIds(folder.Id, allFolders)); // קריאה רקורסיבית
            }

            return folderIds;
        }

        public async Task<List<Lesson>> SearchFilesAsync(int userId, int currentFolderId, string query)
        {
            return await Task.Run(() => GetFilesRecursively(currentFolderId)
                .Where(f => f.OwnerId == userId && f.LessonName.Contains(query))
                .ToList());
        }
        public async Task<IEnumerable<Lesson>> GetLessonsWithTranscriptAsync()
        {
            return await _datacontext.LessonList
                .Where(l => l.Transcript != null && !l.IsDeleted)
                .ToListAsync();
        }

        public async Task<IEnumerable<Lesson>> GetLessonsWithoutTranscriptAsync()
        {
            return await _datacontext.LessonList
                .Where(l => l.Transcript == null && !l.IsDeleted)
                .ToListAsync();
        }

    }



}
