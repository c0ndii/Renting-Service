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
                if (!_context.Features.Any())
                {
                    var features = GetFeatures();
                    _context.Features.AddRange(features);
                    _context.SaveChanges();
                }
                if (!_context.MainCategories.Any())
                {
                    var ForSaleMainCategories = GetForSaleMainCategories();
                    var ForRentMainCategories = GetForRentMainCategories();
                    _context.ForSaleMainCategories.AddRange(ForSaleMainCategories);
                    _context.ForRentMainCategories.AddRange(ForRentMainCategories);
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
        private static IEnumerable<Feature> GetFeatures()
        {
            var features = new List<Feature>()
            {
                new Feature()
                {
                    FeatureName = "Klimatyzacja"
                },
                new Feature()
                {
                    FeatureName = "Miejsce parkingowe"
                },
                new Feature()
                {
                    FeatureName = "Balkon"
                },
                new Feature()
                {
                    FeatureName = "Winda"
                },
                new Feature()
                {
                    FeatureName = "Grill"
                },
                new Feature()
                {
                    FeatureName = "Ciepła woda"
                },
                new Feature()
                {
                    FeatureName = "Basen"
                },
            };
            return features;
        }
        private static IEnumerable<ForSaleMainCategory> GetForSaleMainCategories()
        {
            var forSaleCategories = new List<ForSaleMainCategory>()
            {
                new ForSaleMainCategory()
                {
                    MainCategoryName = "Mieszkanie"
                },
                new ForSaleMainCategory()
                {
                    MainCategoryName = "Dom"
                },
                new ForSaleMainCategory()
                {
                    MainCategoryName = "Działka"
                },
            };
            return forSaleCategories;
        }
        private static IEnumerable<ForRentMainCategory> GetForRentMainCategories()
        {
            var forRentCategories = new List<ForRentMainCategory>()
            {
                new ForRentMainCategory()
                {
                    MainCategoryName = "Mieszkanie"
                },
                new ForRentMainCategory()
                {
                    MainCategoryName = "Dom"
                },
                new ForRentMainCategory()
                {
                    MainCategoryName = "Wypoczynek"
                },
            };
            return forRentCategories;
        }
    }
}
