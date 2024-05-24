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
        [HttpGet("getuser")]
        [Authorize(Roles = ("Admin, User"))]
        public async Task<IActionResult> GetUser()
        {
            var result = await _userService.GetUser();
            return Ok(result);
        }
        [HttpGet("getuser/{userId}")]
        public async Task<IActionResult> GetUser([FromRoute] int userId)
        {
            var result = await _userService.GetUser(userId);
            return Ok(result);
        }
        [HttpPatch("editname/{dto}")]
        [Authorize(Roles = ("Admin, User"))]
        public async Task<IActionResult> EditUserName([FromRoute] string dto)
        {
            await _userService.EditUserName(dto);
            return Ok();
        }
        [HttpPatch("editpicture")]
        [Authorize(Roles = ("Admin, User"))]
        public async Task<IActionResult> EditUserPicture([FromBody] EditUserPictureDto dto)
        {
            await _userService.EditUserPicture(dto);
            return Ok();
        }
    }
}
