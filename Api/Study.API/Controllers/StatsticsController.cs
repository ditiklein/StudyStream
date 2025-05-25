using Microsoft.AspNetCore.Mvc;
using Sprache;
using Study.Core.DTOs;
using Study.Core.Interface.IntarfaceService;
using static Study.Core.DTOs.StatticsDTO;
using Study.Service;
using AutoMapper;
using Study.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Study.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatsticsController : ControllerBase
    {
        readonly IUserService _userService;
        private readonly IStatsticsService _statisticsService;

        public StatsticsController(IUserService userService, IStatsticsService statisticsService)
        {
            _userService = userService;
            _statisticsService = statisticsService;
        }


        [HttpGet("user-registration-growth")]
        public async Task<ActionResult<IEnumerable<UserGrowthDTO>>> GetUserGrowthByMonth()
        {
            var userGrowthData = await _statisticsService.GetUserGrowthByMonthAsync();
            return Ok(userGrowthData);
        }
        [HttpGet("user-statistics")]
        public async Task<ActionResult<IEnumerable<UserStatisticsDto>>> GetUserStatistics()
        {
            var result = await _statisticsService.GetUserStatisticsAsync();
            if (result!=null)
            {
                return Ok(result);
            }

            return StatusCode(500, "result.ErrorMessage"); // Or another suitable error status code
        }

        [HttpGet("system-statistics")]
        public async Task<ActionResult<SystemStatisticsDto>>GetSystemStatistics()
        {
            var result = await _statisticsService.GetSystemStatisticsAsync();
            if (result!=null)
            {
                return Ok(result);
            }

            return StatusCode(500, "result.ErrorMessage"); // Or another suitable error status code
        }
    }
}
