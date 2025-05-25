using Study.Core.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Study.Core.DTOs.StatticsDTO;

namespace Study.Core.Interface.IntarfaceService
{
    public interface IStatsticsService
    {
        Task<List<UserGrowthDTO>> GetUserGrowthByMonthAsync();
        Task<IEnumerable<UserStatisticsDto>> GetUserStatisticsAsync();
        Task<SystemStatisticsDto> GetSystemStatisticsAsync();
    }
}
