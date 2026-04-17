using System.ComponentModel.DataAnnotations.Schema;

namespace PortfolioApi.Entities
{
    public class Order
    {
        public int Id { get; set; }

        public int ProjectId { get; set; }
        public Project Project { get; set; } = null!;

        public int BuyerId { get; set; }
        public User Buyer { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>Pending | Confirmed | Cancelled</summary>
        public string Status { get; set; } = "Pending";
    }
}
