using Microsoft.EntityFrameworkCore;
using Study.Core.Entities;
using Study.Core.Interface.InterfaceRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Data.Repository
{
    public class RoleRepository : IRoleRepository
    {
        readonly DataContext _datacontext;

        public RoleRepository(DataContext context)
        {
            _datacontext = context;
        }

        public async Task<Role> AddAsync(Role role)
        {
            role.CreatedAt = DateTime.UtcNow;
            await _datacontext.AddAsync(role);
            return role;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var role = await GetByIdAsync(id);
            if (role == null)
                return false;
            _datacontext.Roles.Remove(role);
            return true;
        }
        public async Task<IEnumerable<Role>> GetAllAsync()
        {
            return await _datacontext.Roles.ToListAsync();
        }

        public async Task<Role> GetByIdAsync(int id)
        {
            return await _datacontext.Roles.FirstOrDefaultAsync(f => f.Id == id);
        }

        public async Task<int> GetIdByRoleAsync(string role)
        {
            var r =await _datacontext.Roles.FirstOrDefaultAsync(r => r.RoleName == role);
            if (r != null)
                return r.Id;
            return -1;
        }

        public async Task<Role> UpdateAsync(Role role,int id)
        {
            Role existingRole = await GetByIdAsync(id);
            if (existingRole == null)
                return null;
                 existingRole.RoleName = role.RoleName;
                existingRole.Description = role.Description;
                existingRole.UpdatedAt = DateTime.UtcNow;
               

                return existingRole;
            
           
        }
    }
}
