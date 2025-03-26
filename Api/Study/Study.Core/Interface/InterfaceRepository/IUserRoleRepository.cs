using Study.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.Interface.InterfaceRepository
{
    public interface IUserRoleRepository:IRepository<UserRole>
    {
        Task<UserRole> GetByUserIdAsync(int id);

    }
}
