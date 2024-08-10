using Microsoft.EntityFrameworkCore;
using RentingServiceBackend.Entities;

namespace RentingServiceBackend.Services
{
    public interface IFeatureService
    {
        Task<List<string>> GetAllFeatures();
    }

    public class FeatureService : IFeatureService
    {
        private readonly AppDbContext _context;

        public FeatureService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<string>> GetAllFeatures()
        {
            var result = await _context.Features.Select(x => x.FeatureName).ToListAsync();
            return result;
        }
    }
}
