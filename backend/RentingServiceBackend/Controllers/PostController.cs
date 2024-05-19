using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentingServiceBackend.Models;
using RentingServiceBackend.Services;

namespace RentingServiceBackend.Controllers
{
    [Route("/api/post")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly IPostService _postService;
        public PostController(IPostService postService)
        {
            _postService = postService;
        }
        [HttpPost("addrentpost")]
        [Authorize]
        public async Task<IActionResult> AddRentPost([FromBody] CreateForRentPostDto dto)
        {
            await _postService.AddRentPost(dto);
            return Created();
        }
        [HttpGet("rentpost/{postId}")]
        public async Task<IActionResult> GetRentPostById([FromRoute] int postId)
        {
            var result = await _postService.GetRentPostById(postId);
            return Ok(result);
        }
    }
}
