using Microsoft.EntityFrameworkCore;
using Study.Core.Entities;
using Study.Core.Interface.InterfaceRepository;
using Study.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Data.Repository
{
    public class UserRoleRepository :IUserRoleRepository
    {
        protected readonly DataContext _dataContext;

        public UserRoleRepository(DataContext context)
        {
            _dataContext = context; // Assuming your DataContext has a DbSet<UserRole> property
        }

        public async Task<UserRole> AddAsync(UserRole userRole)
        {
            _dataContext.UserRoles.AddAsync(userRole);
            return userRole;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var userRole =await GetByIdAsync(id);
            if (userRole == null)
                return false;
            _dataContext.UserRoles.Remove(userRole);
            return true;
        }

        public async Task<IEnumerable<UserRole>> GetAllAsync()
        {
            return await _dataContext.UserRoles.Include(ur => ur.User).Include(ur => ur.Role).ToListAsync();
        }

        public async Task<UserRole> GetByIdAsync(int id)
        {
            return await _dataContext.UserRoles.Include(ur => ur.User).Include(ur => ur.Role).FirstOrDefaultAsync(ur => ur.UserId == id);
        }
        public async Task<UserRole> GetByUserIdAsync(int id)
        {
            return await _dataContext.UserRoles.Include(ur => ur.User).Include(ur => ur.Role).FirstOrDefaultAsync(ur => ur.UserId == id);
        }

        public async Task<UserRole> UpdateAsync( UserRole userRole, int id)
        {
            UserRole existingUserRole =await GetByIdAsync(id);
            if (existingUserRole == null)
                return null;
              existingUserRole.UserId = userRole.UserId;
                existingUserRole.RoleId = userRole.RoleId;
                return existingUserRole;
            
        }
    }
}
