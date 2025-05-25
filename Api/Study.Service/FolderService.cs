using AutoMapper;
using Study.Core.DTOs;
using Study.Core.Entities;
using Study.Core.Interface.IntarfaceService;
using Study.Core.Interface.InterfaceRepository;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Study.Services
{
    public class FolderService : IFolderService
    {
        private readonly IFolderRepository _folderRepository;
        private readonly IReposiroryManager _repositoryManager;

        private readonly IMapper _mapper;

        public FolderService(IFolderRepository folderRepository, IMapper mapper, IReposiroryManager repositoryManager)
        {
            _folderRepository = folderRepository;
            _mapper = mapper;
            _repositoryManager = repositoryManager;
        }

        public async Task<IEnumerable<FolderDTO>> GetAllFoldersAsync()
        {
            var folders = await _folderRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<FolderDTO>>(folders);
        }
        public async Task<IEnumerable<Folder>> GetRootFoldersAsync(int ownerId)
        {
            return await _folderRepository.GetRootFoldersAsync(ownerId);
        }
        public async Task<IEnumerable<FolderDTO>> GetSubFoldersAsync(int parentFolderId, int ownerId)
        {
            var subFolders = await _folderRepository.GetSubFoldersAsync(parentFolderId, ownerId);
            return _mapper.Map<IEnumerable<FolderDTO>>(subFolders);
        }


        public async Task<FolderDTO> GetFolderByIdAsync(int id)
        {
            var folder = await _folderRepository.GetByIdAsync(id);
            return _mapper.Map<FolderDTO>(folder);
        }        


        public async Task<FolderDTO> UpdateFolderAsync(int id, FolderDTO folderDto)
        {
            var folderEntity = _mapper.Map<Folder>(folderDto);
            var updatedFolder = await _folderRepository.UpdateAsync(folderEntity, id);
            if (updatedFolder == null)
            {
                return null;
            }
            await _repositoryManager.SaveAsync();
            return _mapper.Map<FolderDTO>(updatedFolder);
        }

        public async Task<FolderDTO> AddFolderAsync(FolderDTO folderDto)
        {
            if (await GetFolderByIdAsync(folderDto.Id) != null)
                return null;
            if (folderDto.ParentFolderId != null)
            {
                var existingFolder = await _folderRepository.GetSubFoldersAsync(folderDto.ParentFolderId.Value, folderDto.OwnerId);
                if (existingFolder.Any(f => f.Name == folderDto.Name))
                    return null;
            }
            else
            {
                var existingFolder = await _folderRepository.GetRootFoldersAsync(folderDto.OwnerId);
                if (existingFolder.Any(f => f.Name == folderDto.Name))
                    return null;
            }

             var folder = _mapper.Map<Folder>(folderDto);
            folder.CreatedAt= System.DateTime.Now;
            Folder r = await _folderRepository.AddAsync(folder);
            await _repositoryManager.SaveAsync();
            var fD = _mapper.Map<FolderDTO>(r);
            return fD;
        }

        public async Task<bool> DeleteFolderAsync(int id)
        {
            bool f = await _folderRepository.DeleteAsync(id);
            
            await _repositoryManager.SaveAsync();
            return f;

        }
        public async Task<IEnumerable<FolderDTO>> GetUserFoldersAsync(int userId)
        {
            var folders = await _folderRepository.GetUserFoldersAsync(userId);
            return _mapper.Map<IEnumerable<FolderDTO>>(folders);
        }
        public async Task<List<FolderDTO>> SearchFoldersAsync(int userId, int? currentFolderId, string query)
        {
            var folders= await _folderRepository.SearchFoldersAsync(userId, currentFolderId, query);
            return _mapper.Map<List<FolderDTO>>(folders);
        }



    }
}
