using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Study.API.Models;
using Study.Core.DTOs;
using Study.Core.Entities;
using Study.Core.Interface.IntarfaceService;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Study.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        readonly IUserService _userService;
        readonly IMapper _mapper;



        public UserController(IUserService userService, IMapper mapper)
        {
            _userService = userService;
            _mapper = mapper;
        }

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDTO>>> Get()
        {
            return Ok(await _userService.GetAllUsersAsync());
        }

        // GET api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> GetById(int id)
        {
            if (id < 0) return BadRequest("Invalid user ID");
            var result =await _userService.GetUserByIdAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // POST api/User
        [HttpPost]
        public async Task<ActionResult> Post([FromBody] UserPostModel user)
        {
            if (user == null) return BadRequest("User data is required");
            var UserD = _mapper.Map<UserDTO>(user);
            var result = await _userService.AddUserAsync(UserD);
            if (result == null) return BadRequest("User already exists or could not be added");
            return Ok(result);
        }

        // PUT api/User/5
        [HttpPut("{id}")]

        public async Task<ActionResult> Put(int id, [FromBody] UserPostModel user)
        {
            if (user == null || id < 0) return BadRequest("Invalid input");
            var UserD = _mapper.Map<UserDTO>(user);
            var result = await _userService.UpdateUserAsync(id, UserD);
            if (result == null) return NotFound("User not found");
            return Ok(result.Id);
        }

        // DELETE api/User/5
        [HttpDelete("{id}")]

        public async Task<ActionResult<bool>> DeleteAsync(int id)
        {
            if (id < 0) return BadRequest("Invalid input");
            bool result = await _userService.DeleteUserAsync(id);
            return result ? Ok(result) : NotFound("User not found or could not be deleted");


        }
        [HttpGet("by-email/{email}")]
        [Authorize(Policy = "AdminOnly")]
        public ActionResult<User> GetByEmail(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest();
            var result = _userService.GetUserByEmailAsync(email);
            if (result == null) return NotFound();
            return Ok(result);
        }


    }
}
