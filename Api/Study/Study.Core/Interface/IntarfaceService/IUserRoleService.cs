using Study.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.Interface.IntarfaceService
{
    public interface IUserRoleService
    {
        public Task<UserRole> AddAsync(string role, int userId);
    }
}
