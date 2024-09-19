using RentingServiceBackend.Entities;

namespace RentingServiceBackend.Models
{
    public class UserDto
    {
        public int UserId { get; set; }
        public string Name { get; set; }
        public string? Picture {  get; set; }
        public string Email { get; set; }
    }
}
