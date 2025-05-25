using AutoMapper;
using Liabry.core.Entities;
using Microsoft.AspNetCore.Mvc;
using Study.API.Models;
using Study.Core.DTOs;
using Study.Core.Entities;
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
        // Check if user exists first
        var user = await _userService.GetUserByEmailAsync(model.Email);
        if (user == null)
        {
            return BadRequest(new { message = "המשתמש לא קיים במערכת. אנא הירשם תחילה." });
        }

        var roleName = await _userService.AuthenticateAsync(model.Email, model.Password);

        // If authentication failed (wrong password)
        if (string.IsNullOrEmpty(roleName))
        {
            return Unauthorized(new { message = "סיסמה שגויה. אנא נסה שוב." });
        }

        if (roleName == "Admin")
        {
            var token = _authService.GenerateJwtToken(user.Id, model.Email, new[] { "Admin" });
            return Ok(new { Token = token, User = user });
        }
        else if (roleName == "User")
        {
            var token = _authService.GenerateJwtToken(user.Id, model.Email, new[] { "User" });
            return Ok(new { Token = token, User = user });
        }

        return Unauthorized(new { message = "גישה לא מורשית." });
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterModel model)
    {
        if (model == null)
        {
            return Conflict(new { message = "נתוני המשתמש לא תקינים." });
        }

        if (!Validition.IsValidEmail(model.Email))
        {
            return BadRequest(new { message = "כתובת האימייל לא תקינה." });
        }

        // Check if user already exists
        var existingUserCheck = await _userService.GetUserByEmailAsync(model.Email);
        if (existingUserCheck != null)
        {
            return Conflict(new { message = "משתמש עם כתובת האימייל הזו כבר קיים במערכת. אנא התחבר במקום זאת." });
        }

        var modelD = _mapper.Map<UserDTO>(model);
        var existingUser = await _userService.AddUserAsync(modelD);
        if (existingUser == null)
        {
            return BadRequest(new { message = "לא ניתן ליצור את המשתמש. אנא נסה שוב." });
        }

        // Check if the role exists
        int roleId = await _roleRpository.GetIdByRoleAsync(model.RoleName);
        if (roleId == -1)
        {
            return BadRequest(new { message = "התפקיד המבוקש לא נמצא במערכת." });
        }

        var userRole = await _userRoleService.AddAsync(model.RoleName, existingUser.Id);
        if (userRole == null)
        {
            return BadRequest(new { message = "שגיאה בהקצאת התפקיד למשתמש." });
        }

        var token = _authService.GenerateJwtToken(existingUser.Id, model.Email, new[] { model.RoleName });
        return Ok(new { Token = token, User = existingUser });
    }
}

public class LoginModel
{
    public string? Email { get; set; }
    public string? Password { get; set; }
}