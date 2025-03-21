﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentingServiceBackend.Entities;
using RentingServiceBackend.Models;
using RentingServiceBackend.Services;
using System.Linq.Expressions;

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
        //[HttpGet("userrentposts/{userId}")]
        //[Authorize]
        //public async Task<IActionResult> GetAllUserRentPosts([FromRoute] int userId)
        //{
        //    var result = await _postService.GetAllUserRentPosts(userId);
        //    return Ok(result);
        //}
        //[HttpGet("usersaleposts/{userId}")]
        //[Authorize]
        //public async Task<IActionResult> GetAllUserSalePosts([FromRoute] int userId)
        //{
        //    var result = await _postService.GetAllUserSalePosts(userId);
        //    return Ok(result);
        //}
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
        [HttpGet("togglefollow/{postId}")]
        [Authorize]
        public async Task<IActionResult> ToggleFollow([FromRoute] int postId)
        {
            var result = await _postService.ToggleFollow(postId);
            return Ok(result);
        }
        [HttpGet("posts/list")]
        public async Task<IActionResult> GetAllPostsList([FromQuery] PostQuery query)
        {
            var result = await _postService.GetAllPostsList(query);
            return Ok(result);
        }
        [HttpGet("posts/map")]
        public async Task<IActionResult> GetAllPostsMap([FromQuery] PostQueryMap query)
        {
            var result = await _postService.GetAllPostsMap(query);
            return Ok(result);
        }

        [HttpGet("admin/rent")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUnconfirmedRentPosts()
        {
            var result = await _postService.GetUnconfirmedRentPosts();
            return Ok(result);
        }

        [HttpGet("admin/sale")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUnconfirmedSalePosts()
        {
            var result = await _postService.GetUnconfirmedSalePosts();
            return Ok(result);
        }

        [HttpPost("admin/confirm/{postId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ConfirmPost(int postId)
        {
            await _postService.ConfirmPost(postId);
            return Ok();
        }

        [HttpPost("admin/delete/{postId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectPost(int postId)
        {
            await _postService.RejectPost(postId);
            return Ok();
        }
    }
}
