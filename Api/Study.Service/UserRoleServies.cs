using Study.Core.Entities;
using Study.Core.Interface.IntarfaceService;
using Study.Core.Interface.InterfaceRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Service
{
    public class UserRoleService : IUserRoleService
    {
        private readonly IUserRoleRepository _userRolesRepository;
        private readonly IRoleRepository _roleRpository;
        readonly IReposiroryManager _repositoryManager;

        public UserRoleService(IUserRoleRepository userRolesRepository, IRoleRepository roleRpository, IReposiroryManager repositoryManager)
        {
            _userRolesRepository = userRolesRepository;
            _roleRpository = roleRpository;
            _repositoryManager = repositoryManager;
        }
        public async Task<UserRole> AddAsync(string role, int userId)
        {
            int r =await _roleRpository.GetIdByRoleAsync(role);
            if (r == -1)
                return null;
            UserRole u = await _userRolesRepository.AddAsync(new UserRole { RoleId = r, UserId = userId });
            await _repositoryManager.SaveAsync();
            return u;
        }
    }
}
