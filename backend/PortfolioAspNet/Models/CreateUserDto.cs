using System.ComponentModel.DataAnnotations;

namespace PortfolioApi.Models
{
    public class CreateUserDto
    {
        [Required]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }

        public int RoleId { get; set; }
    }
}