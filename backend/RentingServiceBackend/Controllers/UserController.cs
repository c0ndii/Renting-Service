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
        [HttpPost("register")]
        public async Task<ActionResult> RegisterUser([FromBody] RegisterUserDto dto)
        {
            await _userService.RegisterUserAsync(dto);
            return Ok("Account register successful");
        }
        [HttpPost("login")]
        public async Task<ActionResult> LoginUser([FromBody] LoginUserDto dto)
        {
            string token = await _userService.LoginAsync(dto);
            return Ok(token);
        }
        [HttpGet("verifyemail/{token}")]
        public async Task<IActionResult> VerifyEmail([FromRoute] string token)
        {
            await _userService.VerifyAccountAsync(token);
            return Ok("Account verified");
        }
        [HttpPost("forgotpassword/{email}")]
        public async Task<IActionResult> ForgotPassword([FromRoute] string email)
        {
            await _userService.ForgotPasswordAsync(email);
            return Ok("Reset code has been sent");
        }
        [HttpPost("resetpassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            await _userService.ResetPasswordAsync(resetPasswordDto);
            return Ok("Password has been reseted");
        }
        [HttpGet("getusername")]
        [Authorize]
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
