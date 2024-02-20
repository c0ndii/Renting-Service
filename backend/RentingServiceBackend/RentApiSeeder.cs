using Azure;
using RentingServiceBackend.Entities;

namespace RentingServiceBackend
{
    public class RentApiSeeder
    {
        private readonly AppDbContext _context;
        public void Seed()
        {
            if (_context.Database.CanConnect())
            {
                if (!_context.Roles.Any())
                {
                    var roles = GetRoles();
                    _context.Roles.AddRange(roles);
                    _context.SaveChanges();
                }
            }
        }
        public RentApiSeeder(AppDbContext context)
        {
            _context = context;
        }
        private static IEnumerable<Role> GetRoles()
        {
            var roles = new List<Role>()
            {
                new Role()
                {
                    Name = "Unconfirmed"
                },
                new Role()
                {
                    Name = "User"
                },
                new Role()
                {
                    Name = "Admin"
                }
                
            };
            return roles;
        }
    }
}
