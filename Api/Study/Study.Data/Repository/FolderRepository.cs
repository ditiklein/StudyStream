using Study.Core.Entities;
using Study.Core.Interface.InterfaceRepository;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Study.Data.Repository
{
    public class FolderRepository : IFolderRepository
    {
        private readonly DataContext _datacontext;

        public FolderRepository(DataContext context)
        {
            _datacontext = context;
        }

        public async Task<IEnumerable<Folder>> GetAllAsync()
        {
            return await _datacontext.FolderList.ToListAsync();
        }

        public async Task<Folder> AddAsync(Folder folder)
        {
            await _datacontext.FolderList.AddAsync(folder);
            return folder;

        }

        public async Task<IEnumerable<Folder>> GetRootFoldersAsync(int ownerId)
        {
            return await _datacontext.FolderList
                .Where(f => f.ParentFolderId == null && f.OwnerId == ownerId)
                .ToListAsync();
        }

      
        public async Task<IEnumerable<Folder>> GetSubFoldersAsync(int parentFolderId, int ownerId)
        {
            return await _datacontext.FolderList
                .Where(f => f.ParentFolderId == parentFolderId && f.OwnerId == ownerId && !f.IsDeleted)
                .ToListAsync();
        }



        public async Task<Folder?> GetByIdAsync(int id)
        {
            return await _datacontext.FolderList.FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<int> GetIndexByIdAsync(int id)
        {
            var folders = await _datacontext.FolderList.ToListAsync();
            return folders.FindIndex(f => f.Id == id);
        }

        public async Task<Folder> UpdateAsync(Folder folder, int id)
        {
            var existingFolder = await GetByIdAsync(id);
            if (existingFolder == null) return null;

            existingFolder.Name = folder.Name;
            existingFolder.ParentFolderId = folder.ParentFolderId;
            existingFolder.UpdatedAt = System.DateTime.Now;

            return existingFolder;


        }

        public async Task<bool> DeleteAsync(int id)
        {
            //var folder = await GetByIdAsync(id);
            //if (folder == null) return false;


            //_datacontext.FolderList.Remove(folder);
            //return true;
            // מצא את התיקייה שברצונך למחוק
            var folder = await GetByIdAsync(id);
            if (folder == null) return false;

            // מחיקת כל תיקיות המשנה
            var subFolders = await GetSubFoldersAsync(id, folder.OwnerId);
            foreach (var subFolder in subFolders)
            {
                await DeleteAsync(subFolder.Id);  // רקורסיה למחיקת תיקיות משנה
            }

            // אם יש טבלה נפרדת לקבצים, מחק את כל הקבצים הקשורים לתיקייה
            var filesToDelete = await _datacontext.LessonList.Where(f => f.FolderId == id).ToListAsync();
            _datacontext.LessonList.RemoveRange(filesToDelete);

            // מחק את התיקייה עצמה
            _datacontext.FolderList.Remove(folder);

            // שמור את השינויים
            await _datacontext.SaveChangesAsync();

            return true;


        }
        public async Task<List<Folder>> SearchFoldersAsync(string searchTerm)
        {
            return await _datacontext.FolderList
                .Where(f => f.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))
                .ToListAsync();
        }
        public async Task<IEnumerable<Folder>> GetUserFoldersAsync(int userId)
        {
            return await _datacontext.FolderList
                .Where(f => f.OwnerId == userId)
                .ToListAsync();
        }


    }
}
