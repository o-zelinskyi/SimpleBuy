using Microsoft.AspNetCore.Mvc;
using PortfolioApi.Entities;
using PortfolioApi.Repositories;
using PortfolioAspNet.Entities;
using PortfolioAspNet.Models;

namespace PortfolioAspNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IRepository<User> _userRepo;
        private readonly IRepository<Role> _roleRepo;

        public AuthController(IRepository<User> userRepo, IRepository<Role> roleRepo)
        {
            _userRepo = userRepo;
            _roleRepo = roleRepo;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
        {
            var users = await _userRepo.GetAllAsync();
            var user = users.FirstOrDefault(u =>
                u.Email.ToLower() == dto.Email.ToLower() &&
                u.Password == dto.Password);

            if (user == null)
            {
                return Unauthorized(new { Message = "Невірний email або пароль" });
            }

            var roles = await _roleRepo.GetAllAsync();
            var role = roles.FirstOrDefault(r => r.Id == user.RoleID);

            var response = new AuthResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                RoleId = user.RoleID,
                RoleName = role?.Name ?? "Unknown"
            };

            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
        {
            var users = await _userRepo.GetAllAsync();

            if (users.Any(u => u.Email.ToLower() == dto.Email.ToLower()))
            {
                return BadRequest(new { Message = "Користувач з таким email вже існує" });
            }

            var newUser = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Password = dto.Password,
                RoleID = dto.RoleId
            };

            await _userRepo.AddAsync(newUser);

            var roles = await _roleRepo.GetAllAsync();
            var role = roles.FirstOrDefault(r => r.Id == newUser.RoleID);

            var response = new AuthResponseDto
            {
                Id = newUser.Id,
                FullName = newUser.FullName,
                Email = newUser.Email,
                RoleId = newUser.RoleID,
                RoleName = role?.Name ?? "Unknown"
            };

            return CreatedAtAction(nameof(Login), response);
        }

        [HttpGet("roles")]
        public async Task<ActionResult<List<Role>>> GetRoles()
        {
            var roles = await _roleRepo.GetAllAsync();
            return Ok(roles);
        }
    }
}
