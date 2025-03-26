using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Study.API.Models;
using Study.Core.DTOs;
using Study.Core.Interface.IntarfaceService;
using Study.Core.Interface.InterfaceRepository;
using Study.Data.Repository;
using Study.Service;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly IUserService _userService;
    private readonly IMapper _mapper;
    private readonly IUserRoleService _userRoleService;
    private readonly IRoleRepository _roleRpository;


    public AuthController(AuthService authService, IUserService userService, IMapper mapper, IUserRoleService userRoleService, IRoleRepository roleRpository)
    {
        _authService = authService;
        _userService = userService;
        _mapper = mapper;
        _userRoleService = userRoleService;
        _roleRpository = roleRpository;
    }


    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] LoginModel model)
    {
        var roleName =await _userService.AuthenticateAsync(model.Email, model.Password);
        var user =await _userService.GetUserByEmailAsync(model.Email);
        if (roleName == "Admin")
        {
            var token = _authService.GenerateJwtToken(model.Email, new[] { "Admin" });
            return Ok(new { Token = token, User = user });
        }

        else if (roleName == "User")
        {
            var token = _authService.GenerateJwtToken(model.Email, new[] { "User" });
            return Ok(new { Token = token , User = user });
        }
         
        return Unauthorized();
    }
 
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
    {
        if (model == null)
        {
            return Conflict("User is not valid");
        }

        var modelD = _mapper.Map<UserDTO>(model);
        var existingUser = await _userService.AddUserAsync(modelD);
        if (existingUser == null)
            return BadRequest("User could not be created.");

        // Check if the role exists
        int roleId =await _roleRpository.GetIdByRoleAsync(model.RoleName);
        if (roleId == -1)
        {
            return BadRequest("Role not found.");
        }

        var userRole = await _userRoleService.AddAsync(model.RoleName, existingUser.Id);
        if (userRole == null)
            return BadRequest("Error assigning role to user.");

        var token = _authService.GenerateJwtToken(model.Email, new[] { model.RoleName });
        return Ok(new { Token = token,User=existingUser });
    }
}

public class LoginModel
{
    public string? Email { get; set; }
    public string? Password { get; set; }
}

