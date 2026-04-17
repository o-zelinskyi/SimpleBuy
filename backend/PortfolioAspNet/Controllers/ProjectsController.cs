using Microsoft.AspNetCore.Mvc;
using PortfolioApi.Entities;
using PortfolioApi.Models;
using PortfolioApi.Repositories;
using PortfolioAspNet.Models;

namespace PortfolioApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly IRepository<Project> _projectRepo;
        private readonly IRepository<User> _userRepo;

        public ProjectsController(IRepository<Project> projectRepo, IRepository<User> userRepo)
        {
            _projectRepo = projectRepo;
            _userRepo = userRepo;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProjectResponseDto>>> GetAll()
        {
            var projects = await _projectRepo.GetAllAsync();
            var users = await _userRepo.GetAllAsync();

            var result = projects.Select(p => new ProjectResponseDto
            {
                Id = p.Id,
                Title = p.Title,
                Price = p.Price,
                Description = p.Description,
                CreatedAt = p.CreatedAt,
                SellerId = p.SellerId,
                SellerName = users.FirstOrDefault(u => u.Id == p.SellerId)?.FullName ?? "Невідомий"
            }).ToList();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProjectResponseDto>> GetById(int id)
        {
            var project = await _projectRepo.GetByIdAsync(id);

            if (project == null)
            {
                return NotFound(new { Message = $"Проєкт з ID {id} не знайдено." });
            }

            var seller = await _userRepo.GetByIdAsync(project.SellerId);

            var responseDto = new ProjectResponseDto
            {
                Id = project.Id,
                Title = project.Title,
                Price = project.Price,
                Description = project.Description,
                CreatedAt = project.CreatedAt,
                SellerId = project.SellerId,
                SellerName = seller?.FullName ?? "Невідомий"
            };

            return Ok(responseDto);
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromBody] CreateProjectDto dto)
        {
            var seller = await _userRepo.GetByIdAsync(dto.SellerId);
            if (seller == null)
            {
                return BadRequest(new { Message = "Вказаного продавця (SellerId) не існує." });
            }

            var newProject = new Project
            {
                Title = dto.Title,
                Description = dto.Description,
                Price = dto.Price,
                SellerId = dto.SellerId,
                CreatedAt = DateTime.UtcNow
            };

            await _projectRepo.AddAsync(newProject);

            return CreatedAtAction(nameof(GetById), new { id = newProject.Id }, new ProjectResponseDto
            {
                Id = newProject.Id,
                Title = newProject.Title,
                Price = newProject.Price,
                SellerName = seller.FullName
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProjectDto dto)
        {
            var existingProject = await _projectRepo.GetByIdAsync(id);

            if (existingProject == null)
            {
                return NotFound(new { Message = "Проєкт не знайдено." });
            }

            existingProject.Title = dto.Title;
            existingProject.Description = dto.Description;
            existingProject.Price = dto.Price;

            await _projectRepo.UpdateAsync(existingProject);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingProject = await _projectRepo.GetByIdAsync(id);

            if (existingProject == null)
            {
                return NotFound(new { Message = "Проєкт не знайдено." });
            }

            await _projectRepo.DeleteAsync(id);

            return NoContent();
        }
    }
}