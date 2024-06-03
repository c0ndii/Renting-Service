using Microsoft.EntityFrameworkCore;
using RentingServiceBackend.Entities;
using RentingServiceBackend.Exceptions;

namespace RentingServiceBackend.Services
{
    public interface IMainCategoryService
    {
        Task<IEnumerable<string>> GetRentMainCategories();
        Task<IEnumerable<string>> GetSaleMainCategories();
    }

    public class MainCategoryService : IMainCategoryService
    {
        private readonly AppDbContext _context;
        public MainCategoryService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<string>> GetRentMainCategories()
        {
            var result = await _context.ForRentMainCategories.Select(x => x.MainCategoryName).ToListAsync();
            if (result is null)
            {
                throw new NotFoundException("Main categories not found");
            }
            return result;
        }
        public async Task<IEnumerable<string>> GetSaleMainCategories()
        {
            var result = await _context.ForSaleMainCategories.Select(x => x.MainCategoryName).ToListAsync();
            if (result is null)
            {
                throw new NotFoundException("Main categories not found");
            }
            return result;
        }
        
    }
}
