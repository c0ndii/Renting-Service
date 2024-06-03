using Microsoft.AspNetCore.Mvc;
using RentingServiceBackend.Services;

namespace RentingServiceBackend.Controllers
{
    [Route("api/maincategory")]
    [ApiController]
    public class MainCategoryController : ControllerBase
    {
        private readonly IMainCategoryService _mainCategoryService;
        public MainCategoryController(IMainCategoryService mainCategoryService)
        {
            _mainCategoryService = mainCategoryService;
        }
        [HttpGet("rent")]
        public async Task<IActionResult> GetRentMainCategories()
        {
            var result = await _mainCategoryService.GetRentMainCategories();
            return Ok(result);
        }
        [HttpGet("sale")]
        public async Task<IActionResult> GetSaleMainCategories()
        {
            var result = await _mainCategoryService.GetSaleMainCategories();
            return Ok(result);
        }
    }
}
