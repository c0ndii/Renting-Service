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
        [HttpPatch("editname")]
        [Authorize(Roles = ("Admin, User"))]
        public async Task<IActionResult> EditUserName([FromBody] EditUserNameDto dto)
        {
            await _userService.EditProfile(dto);
            return Ok();
        }
        [HttpPatch("editpicture")]
        [Authorize(Roles = ("Admin, User"))]
        public async Task<IActionResult> EditUserPicture([FromBody] EditUserPictureDto dto)
        {
            await _userService.EditProfile(dto);
            return Ok();
        }
    }
}
