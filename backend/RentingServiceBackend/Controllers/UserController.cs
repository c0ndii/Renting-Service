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
        public async Task<UserDto> GetUserName()
        {
            var result = await _userService.GetUserName();
            return result;
        }
        [HttpGet("getusername/{userId}")]
        public async Task<UserDto> GetUserName([FromRoute] int userId)
        {
            var result = await _userService.GetUserName(userId);
            return result;
        }
    }
}
