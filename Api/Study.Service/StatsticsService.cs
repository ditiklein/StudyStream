using Study.Core.DTOs;
using Study.Core.Interface.IntarfaceService;
using Study.Core.Interface.InterfaceRepository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Study.Core.DTOs.StatticsDTO;

namespace Study.Service
{
    public class StatsticsService: IStatsticsService
    {

        readonly IUserRepository _userRepository;
        readonly IFolderRepository _folderRepository;
        readonly ILessonRepository _lessonRepository;

        public StatsticsService(IUserRepository userRepository, IFolderRepository folderRepository, ILessonRepository lessonRepository)
        {
            _userRepository = userRepository;
            _folderRepository = folderRepository;
            _lessonRepository = lessonRepository;
        }

        public async Task<List<UserGrowthDTO>> GetUserGrowthByMonthAsync()
        {
            var users = await _userRepository.GetAllAsync(); // מחכים לנתונים
            var result = users
                .GroupBy(u => new { Year = u.CreatedAt.Year, Month = u.CreatedAt.Month })
                .Select(g => new UserGrowthDTO
                {
                    Year = g.Key.Year,
                    Month = g.Key.Month,
                    UserCount = g.Count()
                })
                .OrderBy(x => x.Year)
                .ThenBy(x => x.Month)
                .ToList(); // לא צריך ToListAsync כי הנתונים כבר בזיכרון

            return result;
        }


     

        // סטטיסטיקה לכל משתמש
        public async Task<IEnumerable<UserStatisticsDto>> GetUserStatisticsAsync()
        {
            var users = await _userRepository.GetAllAsync();
            var folders = await _folderRepository.GetAllAsync();
            var files = await _lessonRepository.GetAllAsync();

            var userStats = users.Select(user => new UserStatisticsDto
            {
                UserId = user.Id,
                Username = user.LastName,
                FolderCount = folders.Count(a => a.OwnerId == user.Id),
               LessonCount = files.Count(f => f.OwnerId == user.Id)
            }).ToList();

            return userStats;
        }

        // סטטיסטיקה כללית של המערכת
        public async Task<SystemStatisticsDto> GetSystemStatisticsAsync()
        {
            var users = await _userRepository.GetAllAsync();
            var totalUsers = users.Count();
            var folder = await _folderRepository.GetAllAsync();
            var totalFolders = folder.Count();
            var files = await _lessonRepository.GetAllAsync();
            var totalFiles = files.Count();

            var systemStats = new SystemStatisticsDto
            {
                TotalUsers = totalUsers,
                TotalFolders = totalFolders,
                TotalFiles = totalFiles
            };

            return systemStats;
        }

    }
}
