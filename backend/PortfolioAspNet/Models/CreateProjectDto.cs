namespace PortfolioAspNet.Models
{
    public class CreateProjectDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int SellerId { get; set; }
    }
}
