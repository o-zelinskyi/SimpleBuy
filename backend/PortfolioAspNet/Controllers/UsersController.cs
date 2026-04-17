using Microsoft.AspNetCore.Mvc;
using PortfolioApi.Entities;
using PortfolioApi.Models;
using PortfolioApi.Repositories;
using PortfolioAspNet.Models;

namespace PortfolioApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IRepository<User> _userRepo;

        public UsersController(IRepository<User> userRepo)
        {
            _userRepo = userRepo;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponseDto>>> GetAll()
        {
            var users = await _userRepo.GetAllAsync();

            var result = users.Select(u => new UserResponseDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                RoleId = u.RoleID,
                ProjectsCount = u.Projects?.Count ?? 0
            }).ToList();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponseDto>> GetById(int id)
        {
            var user = await _userRepo.GetByIdAsync(id);

            if (user == null)
            {
                return NotFound(new { Message = $"Користувача з ID {id} не знайдено." });
            }

            var response = new UserResponseDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                RoleId = user.RoleID,
                ProjectsCount = user.Projects?.Count ?? 0
            };

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateUserDto dto)
        {

            var newUser = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                RoleID = dto.RoleId,
                Password = dto.Password
            };

            await _userRepo.AddAsync(newUser);

            return CreatedAtAction(nameof(GetById), new { id = newUser.Id }, new UserResponseDto
            {
                Id = newUser.Id,
                FullName = newUser.FullName,
                Email = newUser.Email,
                RoleId = newUser.RoleID
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _userRepo.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            await _userRepo.DeleteAsync(id);
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
        {
            var existingUser = await _userRepo.GetByIdAsync(id);

            if (existingUser == null)
            {
                return NotFound(new { Message = "Користувача не знайдено" });
            }

            existingUser.FullName = dto.FullName;
            existingUser.RoleID = dto.RoleId;

            await _userRepo.UpdateAsync(existingUser);

            return NoContent(); 
        }
    }
}