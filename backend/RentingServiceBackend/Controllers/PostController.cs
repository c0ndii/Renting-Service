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
        [HttpPost("addsalepost")]
        [Authorize]
        public async Task<IActionResult> AddSalePost([FromBody] CreateForSalePostDto dto)
        {
            await _postService.AddSalePost(dto);
            return Created();
        }
        [HttpGet("rentpost/{postId}")]
        public async Task<IActionResult> GetRentPostById([FromRoute] int postId)
        {
            var result = await _postService.GetRentPostById(postId);
            return Ok(result);
        }
        [HttpPost("addpicturestopost")]
        [DisableRequestSizeLimit]
        [Authorize]
        public async Task<IActionResult> AddPicturesToPost([FromForm] EditPostPicturesDto dto)
        {
            var result = await _postService.AddPicturesToPost(dto);
            return Ok(result);
        }
    }
}
