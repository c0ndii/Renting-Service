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
        [HttpPost("addpost")]
        [Authorize]
        public async Task AddPost([FromBody] CreatePostDto dto)
        {
            await _postService.AddPost(dto);
        }
        [HttpGet("{postId}")]
        public async Task<PostDto> GetPostById([FromRoute] int postId)
        {
            var result = await _postService.GetPostById(postId);
            return result;
        }
    }
}
