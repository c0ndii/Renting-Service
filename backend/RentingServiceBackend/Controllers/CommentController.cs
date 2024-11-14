using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentingServiceBackend.Models;
using RentingServiceBackend.Services;

namespace RentingServiceBackend.Controllers
{
    [Route("/api/comment")]
    [Authorize(Roles = "Admin, User")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;

        public CommentController(ICommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUserComments()
        {
            var result = await _commentService.GetAllUserComments();
            return Ok(result);
        }

        [HttpDelete("{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            await _commentService.DeleteComment(commentId);
            return Ok();
        }

        [HttpPost("{postId}")]
        public async Task<IActionResult> CreateComment([FromRoute]int postId, [FromBody]CreateCommentDto dto)
        {
            await _commentService.AddComment(postId, dto);
            return Created();
        }

        [HttpGet("{postId}")]
        public async Task<IActionResult> CanUserComment([FromRoute]int postId)
        {
            var result = await _commentService.CanUserCommentPost(postId);
            return Ok(result);
        }
    }
}
