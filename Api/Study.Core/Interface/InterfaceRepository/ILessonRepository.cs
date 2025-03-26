using Study.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.Interface.InterfaceRepository
{
    public interface ILessonRepository:IRepository<Lesson>
    {
        Task<IEnumerable<Lesson>> GetFilesInFolderAsync(int folderId);
        Task<IEnumerable<Lesson>> GetRootFileAsync(int ownerId);
        Task<List<Lesson>> GetByUserIdAsync(int userId);
        Task<List<Lesson>> SearchFilesAsync(string searchTerm);
        Task<IEnumerable<Lesson>> GetUserLessonsAsync(int userId);
    }
}
