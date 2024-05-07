using RentingServiceBackend.Services;
using Microsoft.AspNetCore.Mvc;
using RentingServiceBackend.Models;
using Microsoft.AspNetCore.Authorization;

namespace RentingServiceBackend.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthenticationService _authenticationService;
        public AuthenticationController(IAuthenticationService authenticationService)
        {
            _authenticationService = authenticationService;
        }
        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterUserDto dto)
        {
            await _authenticationService.RegisterUserAsync(dto);
            return Created();
        }
        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromBody] LoginUserDto dto)
        {
            var result = await _authenticationService.LoginAsync(dto);
            return Ok(result);
        }
        [HttpGet("verifyemail/{token}")]
        public async Task<IActionResult> VerifyEmail([FromRoute] string token)
        {
            await _authenticationService.VerifyAccountAsync(token);
            return Ok();
        }
        [HttpGet("forgotpassword/{email}")]
        public async Task<IActionResult> ForgotPassword([FromRoute] string email)
        {
            await _authenticationService.ForgotPasswordAsync(email);
            return Ok();
        }
        [HttpPost("resetpassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            await _authenticationService.ResetPasswordAsync(resetPasswordDto);
            return Ok();
        }
        [HttpPost("refreshtoken")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto dto)
        {
            var result = await _authenticationService.RefreshToken(dto);
            return Ok(result);
        }
        [Authorize]
        [HttpDelete("revoketoken")]
        public async Task<IActionResult> RevokeToken()
        {
            await _authenticationService.RevokeToken();
            return Ok();
        }
    }
}
