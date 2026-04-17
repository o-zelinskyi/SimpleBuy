using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioApi.Data;
using PortfolioApi.Entities;
using PortfolioAspNet.Models;

namespace PortfolioAspNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrdersController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/orders?userId=&role=
        // Admin: всі замовлення
        // Seller (role=2): замовлення на їх проєкти
        // Buyer (role=3): власні замовлення
        [HttpGet]
        public async Task<ActionResult<List<OrderResponseDto>>> GetOrders(
            [FromQuery] int userId,
            [FromQuery] int role)
        {
            IQueryable<Order> query = _context.Orders
                .Include(o => o.Project)
                .Include(o => o.Buyer);

            if (role == 1) // Admin – all orders
            {
                // no filter
            }
            else if (role == 2) // Seller – orders for their projects
            {
                query = query.Where(o => o.Project.SellerId == userId);
            }
            else // Buyer or other – own orders
            {
                query = query.Where(o => o.BuyerId == userId);
            }

            var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();

            var sellerIds = orders.Select(o => o.Project.SellerId).Distinct().ToList();
            var sellers = await _context.Users
                .Where(u => sellerIds.Contains(u.Id))
                .ToListAsync();

            var result = orders.Select(o =>
            {
                var seller = sellers.FirstOrDefault(s => s.Id == o.Project.SellerId);
                return new OrderResponseDto
                {
                    Id = o.Id,
                    ProjectId = o.ProjectId,
                    ProjectTitle = o.Project.Title,
                    ProjectPrice = o.Project.Price,
                    BuyerId = o.BuyerId,
                    BuyerName = o.Buyer.FullName,
                    SellerId = o.Project.SellerId,
                    SellerName = seller?.FullName ?? "Невідомий",
                    CreatedAt = o.CreatedAt,
                    Status = o.Status
                };
            }).ToList();

            return Ok(result);
        }

        // POST /api/orders
        [HttpPost]
        public async Task<ActionResult<OrderResponseDto>> Create([FromBody] CreateOrderDto dto)
        {
            var project = await _context.Projects.FindAsync(dto.ProjectId);
            if (project == null)
                return BadRequest(new { Message = "Проєкт не знайдено." });

            var buyer = await _context.Users.FindAsync(dto.BuyerId);
            if (buyer == null)
                return BadRequest(new { Message = "Покупця не знайдено." });

            // Prevent seller from ordering own project
            if (project.SellerId == dto.BuyerId)
                return BadRequest(new { Message = "Продавець не може замовляти власний проєкт." });

            var order = new Order
            {
                ProjectId = dto.ProjectId,
                BuyerId = dto.BuyerId,
                CreatedAt = DateTime.UtcNow,
                Status = "Pending"
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            var seller = await _context.Users.FindAsync(project.SellerId);

            return CreatedAtAction(nameof(GetOrders), new { id = order.Id }, new OrderResponseDto
            {
                Id = order.Id,
                ProjectId = order.ProjectId,
                ProjectTitle = project.Title,
                ProjectPrice = project.Price,
                BuyerId = order.BuyerId,
                BuyerName = buyer.FullName,
                SellerId = project.SellerId,
                SellerName = seller?.FullName ?? "Невідомий",
                CreatedAt = order.CreatedAt,
                Status = order.Status
            });
        }

        // PATCH /api/orders/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateOrderStatusDto dto)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
                return NotFound(new { Message = "Замовлення не знайдено." });

            order.Status = dto.Status;
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
