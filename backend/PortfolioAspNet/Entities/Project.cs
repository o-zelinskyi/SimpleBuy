using System.ComponentModel.DataAnnotations.Schema;

namespace PortfolioApi.Entities
{
    public class Project
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int SellerId { get; set; }
        public User Seller { get; set; } = null!;
    }
}