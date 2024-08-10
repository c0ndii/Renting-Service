using Microsoft.AspNetCore.Mvc;
using RentingServiceBackend.Services;

namespace RentingServiceBackend.Controllers
{
    [Route("api/feature")]
    [ApiController]
    public class FeatureController : ControllerBase
    {
        private readonly IFeatureService _featureService;
        public FeatureController(IFeatureService featureService)
        {
            _featureService = featureService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllFeatures()
        {
            var result = await _featureService.GetAllFeatures();
            return Ok(result);
        }
    }
}
