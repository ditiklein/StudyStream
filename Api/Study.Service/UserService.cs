using AutoMapper;
using Study.Core.DTOs;
using Study.Core.Entities;
using Study.Core.Interface.IntarfaceService;
using Study.Core.Interface.InterfaceRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Study.Service
{

    public class UserService : IUserService
    {
        readonly IUserRepository _userRepository;
        readonly IMapper _mapper;
        readonly IRoleRepository _roleRpository;
        readonly IUserRoleRepository _userRolesRepository;
        readonly IReposiroryManager _reposiroryManager;
        readonly ILessonRepository _lessonRepository;


        public UserService(IUserRepository userRepository, IMapper mapper, IRoleRepository roleRpository, IUserRoleRepository userRolesRepository, IReposiroryManager reposiroryManager,ILessonRepository lessonRepository    )
        {
            _userRepository = userRepository;
            _mapper = mapper;
            _roleRpository = roleRpository;
            _userRolesRepository = userRolesRepository;
            _reposiroryManager = reposiroryManager;
            _lessonRepository = lessonRepository;
        }
        //public string HashPassword(string password)
        //{
        //    using (SHA256 sha256 = SHA256.Create())
        //    {
        //        byte[] bytes = Encoding.UTF8.GetBytes(password);
        //        byte[] hashBytes = sha256.ComputeHash(bytes);
        //        return Convert.ToBase64String(hashBytes);
        //    }
        //}

        public async Task<IEnumerable<UserDTO>> GetAllUsersAsync()
        {
            var users =await _userRepository.GetAllAsync();
            return _mapper.Map<IEnumerable<UserDTO>>(users);
        }

        public async Task<UserDTO> GetUserByIdAsync(int id)
        {
            var user =await _userRepository.GetByIdAsync(id);
            return _mapper.Map<UserDTO>(user);
        }
        public async Task<UserDTO> GetUserByEmailAsync(string email)
        {
            var user =await _userRepository.GetByEmailAsync(email);
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> UpdateUserAsync(int id, UserDTO userDTO)
        {
            var userEntity = _mapper.Map<User>(userDTO);
            var updatedUser = await _userRepository.UpdateAsync(userEntity, id);
            if (updatedUser == null)
            {
                return null;
            }
            await _reposiroryManager.SaveAsync();
            return _mapper.Map<UserDTO>(updatedUser);
        }

        public async Task<UserDTO> AddUserAsync(UserDTO userDTO)
              
         
        {
              int id =await _roleRpository.GetIdByRoleAsync("User");
            if (await GetUserByIdAsync(userDTO.Id) != null)
                return null;
            var user = _mapper.Map<User>(userDTO);
             user.CreatedAt = System.DateTime.Now;
            //user.PasswordHash = HashPassword(user.Password);
            User r = await _userRepository.AddAsync(user);
            await _reposiroryManager.SaveAsync();

            await _userRolesRepository.AddAsync(new UserRole() { RoleId = id, UserId = r.Id });

            await _reposiroryManager.SaveAsync();
            var uD = _mapper.Map<UserDTO>(r);
            return uD;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return false;

            // מחיקת כל השיעורים של המשתמש
            var lessons = await _lessonRepository.GetByUserIdAsync(id);
            foreach (var lesson in lessons)
            {
                await _lessonRepository.DeleteAsync(lesson.Id);
            }

            // מחיקת המשתמש - זה גם ימחק את התיקיות שלו אוטומטית
            await _userRepository.DeleteAsync(user.Id);

            await _reposiroryManager.SaveAsync();
            return true;// שמירת שינויים במסד הנתונים


        }
        public async Task<string> AuthenticateAsync(string email, string password)
        {
            User user =await _userRepository.GetByEmailAsync(email);
            if (user == null || !user.Password.Equals(password))
            {
                return null;
            }
            var userRole =await _userRolesRepository.GetByUserIdAsync(user.Id);
            if (userRole == null)
                return null;

            return userRole.Role.RoleName;
        }
        //public async Task<List<UserGrowthDTO>> GetUserGrowthByMonthAsync()
        //{
        //    var result =await GetAllUsersAsync()
        //        .GroupBy(u => new { Year = u.CreatedAt.Year, Month = u.CreatedAt.Month })
        //        .Select(g => new UserGrowthDTO
        //        {
        //            Year = g.Key.Year,
        //            Month = g.Key.Month,
        //            UserCount = g.Count()
        //        })
        //        .OrderBy(x => x.Year)
        //        .ThenBy(x => x.Month)
        //        .ToList();

        //    return result;
        //}


    }

}

