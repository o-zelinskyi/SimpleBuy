namespace PortfolioApi.Models
{
    public class ProjectResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public int SellerId { get; set; }

        public string SellerName { get; set; }
    }
}