using Study.Core.DTOs;
using Study.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Study.Core.Interface.IntarfaceService
{
    public interface IUserService
    {
        Task< IEnumerable<UserDTO>> GetAllUsersAsync();
        Task< UserDTO> GetUserByIdAsync(int id);
        Task<UserDTO> UpdateUserAsync(int id, UserDTO book);
        Task<UserDTO> AddUserAsync (UserDTO book);
        Task<bool> DeleteUserAsync(int id);
        Task<UserDTO> GetUserByEmailAsync(string email);
        Task< string> AuthenticateAsync(string email, string password);
        Task<List<UserGrowthDTO>> GetUserGrowthByMonthAsync();

    }
}
