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
        [DisableRequestSizeLimit]
        public async Task<IActionResult> GetRentPostById([FromRoute] int postId)
        {
            var result = await _postService.GetRentPostById(postId);
            return Ok(result);
        }
        [HttpGet("salepost/{postId}")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> GetSalePostById([FromRoute] int postId)
        {
            var result = await _postService.GetSalePostById(postId);
            return Ok(result);
        }
        [HttpGet("userrentposts/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetAllUserRentPosts([FromRoute] int userId)
        {
            var result = await _postService.GetAllUserRentPosts(userId);
            return Ok(result);
        }
        [HttpGet("usersaleposts/{userId}")]
        [Authorize]
        public async Task<IActionResult> GetAllUserSalePosts([FromRoute] int userId)
        {
            var result = await _postService.GetAllUserSalePosts(userId);
            return Ok(result);
        }
        [HttpGet("userrentposts")]
        [Authorize]
        public async Task<IActionResult> GetAllUserRentPosts()
        {
            var result = await _postService.GetAllUserRentPosts();
            return Ok(result);
        }
        [HttpGet("usersaleposts")]
        [Authorize]
        public async Task<IActionResult> GetAllUserSalePosts()
        {
            var result = await _postService.GetAllUserSalePosts();
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
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePost([FromRoute] int id)
        {
            await _postService.DeletePost(id);
            return Ok();
        }
        [HttpGet("isowner/{postId}")]
        public async Task<IActionResult> IsOwner([FromRoute] int postId)
        {
            var result = await _postService.IsOwner(postId);
            return Ok(result);
        }
        [HttpPut("editrentpost/{postId}")]
        [Authorize]
        public async Task<IActionResult> EditRentPost([FromRoute] int postId, [FromBody] CreateForRentPostDto dto)
        {
            await _postService.EditRentPost(postId, dto);
            return Ok();
        }
        [HttpPut("editsalepost/{postId}")]
        [Authorize]
        public async Task<IActionResult> EditSalePost([FromRoute] int postId, [FromBody] CreateForSalePostDto dto)
        {
            await _postService.EditSalePost(postId, dto);
            return Ok();
        }
        [HttpGet("followedrentposts")]
        [Authorize]
        public async Task<IActionResult> GetUserFollowedRentPosts()
        {
            var result = await _postService.GetUserFollowedRentPosts();
            return Ok(result);
        }
        [HttpGet("followedsaleposts")]
        [Authorize]
        public async Task<IActionResult> GetUserFollowedSalePosts()
        {
            var result = await _postService.GetUserFollowedSalePosts();
            return Ok(result);
        }
        [HttpGet("togglerentfollow/{postId}")]
        [Authorize]
        public async Task<IActionResult> ToggleRentFollow([FromRoute] int postId)
        {
            var result = await _postService.ToggleRentFollow(postId);
            return Ok(result);
        }
        [HttpGet("togglesalefollow/{postId}")]
        [Authorize]
        public async Task<IActionResult> ToggleSaleFollow([FromRoute] int postId)
        {
            var result = await _postService.ToggleSaleFollow(postId);
            return Ok(result);
        }
    }
}
