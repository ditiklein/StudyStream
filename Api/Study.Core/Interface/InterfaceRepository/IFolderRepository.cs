using Study.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.Interface.InterfaceRepository
{
   public interface IFolderRepository:IRepository<Folder>
   {
        Task<IEnumerable<Folder>> GetRootFoldersAsync(int ownerId);
        Task<IEnumerable<Folder>> GetSubFoldersAsync(int parentFolderId, int ownerId);
        Task<IEnumerable<Folder>> GetUserFoldersAsync(int userId);
        Task<List<Folder>> SearchFoldersAsync(int userId, int? currentFolderId, string query);
        List<Folder> GetFoldersRecursively(int? folderId);
        List<int> GetAllSubFolderIds(int folderId, List<Folder> allFolders);
        }
}
