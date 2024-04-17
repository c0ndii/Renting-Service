using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentingServiceBackend.Models;
using RentingServiceBackend.Services;

namespace RentingServiceBackend.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {

        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet("getusername")]
        [Authorize(Roles = ("Admin, User"))]
        public async Task<IActionResult> GetUserName()
        {
            var result = await _userService.GetUserName();
            return Ok(result);
        }
        [HttpGet("getusername/{userId}")]
        public async Task<IActionResult> GetUserName([FromRoute] int userId)
        {
            var result = await _userService.GetUserName(userId);
            return Ok(result);
        }
        [HttpPut("editprofile")]
        public async Task<IActionResult> EditUserProfile([FromBody] EditUserDto dto)
        {
            await _userService.EditProfile(dto);
            return Ok();
        }
    }
}
