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
        Task<List<Folder>> SearchFoldersAsync(string searchTerm);
        Task<IEnumerable<Folder>> GetUserFoldersAsync(int userId);

    }
}
