using Study.Core.DTOs;
using Study.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.Interface.IntarfaceService
{
    public interface IFolderService
    {
        Task<IEnumerable<FolderDTO>> GetAllFoldersAsync();
        Task<FolderDTO> GetFolderByIdAsync(int id);
        Task<FolderDTO> UpdateFolderAsync(int id, FolderDTO folderDto);
        Task<FolderDTO> AddFolderAsync(FolderDTO folderDto);
        Task<bool> DeleteFolderAsync(int id);
        Task<IEnumerable<Folder>> GetRootFoldersAsync(int ownerId);
        Task<IEnumerable<FolderDTO>> GetSubFoldersAsync(int parentFolderId, int ownerId);
        Task<List<FolderDTO>> SearchFoldersAsync(string searchTerm);
        Task<IEnumerable<FolderDTO>> GetUserFoldersAsync(int userId);



    }
}
