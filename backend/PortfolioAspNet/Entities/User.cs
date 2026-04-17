using PortfolioAspNet.Entities;
using System.ComponentModel.DataAnnotations.Schema;

namespace PortfolioApi.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        [ForeignKey("Role")]
        public int RoleID { get; set; }
        public Role Role { get; set; } = null!;
        public List<Project> Projects { get; set; } = new List<Project>();
    }
}