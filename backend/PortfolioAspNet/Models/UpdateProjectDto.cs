using System.ComponentModel.DataAnnotations;

namespace PortfolioAspNet.Models
{
    public class UpdateProjectDto
    {
        [Required]
        public string Title { get; set; }

        public string Description { get; set; }

        [Range(0, double.MaxValue)]
        public decimal Price { get; set; }
    }
}
