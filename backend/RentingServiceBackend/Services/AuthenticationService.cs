using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using RentingServiceBackend.Entities;
using RentingServiceBackend.Exceptions;
using RentingServiceBackend.Migrations;
using RentingServiceBackend.Models;
using RentingServiceBackend.ServiceSettings;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace RentingServiceBackend.Services
{
    public interface IAuthenticationService
    {
        Task ForgotPasswordAsync(string email);
        Task<TokenDto> LoginAsync(LoginUserDto dto);
        Task RegisterUserAsync(RegisterUserDto dto);
        Task ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
        Task VerifyAccountAsync(string token);
        Task<TokenDto> RefreshToken(RefreshTokenDto dto);
        Task RevokeToken();
    }

    public class AuthenticationService : IAuthenticationService
    {
        private readonly AppDbContext _context;
        private readonly IEmailSenderService _emailSenderService;
        private readonly IUserContextService _userContextService;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IMapper _mapper;
        private readonly AuthenticationSettings _authenticationSettings;
        public AuthenticationService(AppDbContext context, IEmailSenderService emailSenderService, IUserContextService userContextService, IMapper mapper, IPasswordHasher<User> passwordHasher, AuthenticationSettings authenticationSettings)
        {
            _context = context;
            _emailSenderService = emailSenderService;
            _userContextService = userContextService;
            _passwordHasher = passwordHasher;
            _mapper = mapper;
            _authenticationSettings = authenticationSettings;
        }
        private string CreateRandomToken(int number)
        {
            return Guid.NewGuid().ToString().Substring(0, number).ToUpper();
        }
        private async Task<JwtSecurityToken> GenerateJwtToken(string email)
        {
            var user = await _context.Users.Include(x => x.Role).SingleOrDefaultAsync(x => x.Email == email);
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, $"{user.Email}"),
                new Claim(ClaimTypes.Role, $"{user.Role.Name}"),
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authenticationSettings.JwtKey));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddHours(_authenticationSettings.JwtExpireHours);

            var token = new JwtSecurityToken(_authenticationSettings.JwtIssuer,
            _authenticationSettings.JwtIssuer,
            claims,
            expires: expires,
                signingCredentials: cred);
            return token;
        }
        private static string GenerateRefreshToken()
        {
            var rnd = new byte[64];
            using var gen = RandomNumberGenerator.Create();
            gen.GetBytes(rnd);
            return Convert.ToBase64String(rnd);
        }
        private ClaimsPrincipal GetPrincipalFromExpiredToken(string? token)
        {
            var validation = new TokenValidationParameters
            {
                ValidIssuer = _authenticationSettings.JwtIssuer,
                ValidAudience = _authenticationSettings.JwtIssuer,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authenticationSettings.JwtKey)),
                ValidateLifetime = false,
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            SecurityToken secToken;
            var principal = tokenHandler.ValidateToken(token, validation, out secToken);
            var jwtSecure = secToken as JwtSecurityToken;
            if (jwtSecure == null || !jwtSecure.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            return principal;
        }
        public async Task RegisterUserAsync(RegisterUserDto dto)
        {
            var user = _mapper.Map<User>(dto);
            var passwordHash = _passwordHasher.HashPassword(user, dto.Password);
            user.Role = await _context.Roles.SingleOrDefaultAsync(x => x.Name == "Unconfirmed");
            var verificationToken = CreateRandomToken(8);
            while (await _context.Users.AnyAsync(x => x.VerificationToken == verificationToken))
            {
                verificationToken = CreateRandomToken(8);
            }
            user.VerificationToken = verificationToken;
            user.PasswordHash = passwordHash;
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            await _emailSenderService.SendEmailAsync(dto.Email, "Your verification code", "Your account verification code is below here: \n" + $"{verificationToken}");
        }
        public async Task<TokenDto> LoginAsync(LoginUserDto dto)
        {
            var user = await _context.Users
                .Include(x => x.Role)
                .SingleOrDefaultAsync(x => x.Email == dto.Email);
            if (user is null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            if (user.Role.Name == "Unconfirmed")
            {
                throw new ForbidException("Account has not been confirmed yet");
            }
            var jwtToken = await GenerateJwtToken(dto.Email);

            var refreshToken = GenerateRefreshToken();

            user.RefreshToken = refreshToken;
            user.RefreshTokenTimeExpires = DateTime.Now.AddDays(3);

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return new TokenDto()
            {
                JwtToken = new JwtSecurityTokenHandler().WriteToken(jwtToken),
                Expiration = jwtToken.ValidTo,
                RefreshToken = refreshToken,
            };
        }
        public async Task VerifyAccountAsync(string token)
        {
            var user = await _context.Users.Include(x => x.Role).SingleOrDefaultAsync(x => x.VerificationToken == token && x.Role.Name == "Unconfirmed");
            if (user is null)
            {
                throw new NotFoundException("Account not found");
            }
            user.Role = await _context.Roles.SingleOrDefaultAsync(x => x.Name == "User");
            user.VerificationToken = null;
            _context.Update(user);
            await _context.SaveChangesAsync();
        }
        public async Task ForgotPasswordAsync(string email)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Email.ToLower() == email.ToLower() && (x.ResetPasswordTimeExpires == null || DateTime.Now > x.ResetPasswordTimeExpires));
            if (user is null)
            {
                throw new NotFoundException("Account not found");
            }
            var code = CreateRandomToken(10);
            while (await _context.Users.AnyAsync(x => x.PasswordResetToken == code))
            {
                code = CreateRandomToken(10);
            }
            user.PasswordResetToken = code;
            user.ResetPasswordTimeExpires = DateTime.Now.AddHours(3);
            _context.Update(user);
            await _context.SaveChangesAsync();
            await _emailSenderService.SendEmailAsync(email, "Your code to reset password", "Here's your code to reset password: \n" + $"{code}");
        }
        public async Task ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.PasswordResetToken == resetPasswordDto.ResetToken && x.ResetPasswordTimeExpires > DateTime.Now);
            if (user == null)
            {
                throw new NotFoundException("Invalid or expired token");
            }
            var newPasswordHash = _passwordHasher.HashPassword(user, resetPasswordDto.Password);
            user.PasswordHash = newPasswordHash;
            user.PasswordResetToken = null;
            user.ResetPasswordTimeExpires = null;
            _context.Update(user);
            await _context.SaveChangesAsync();
        }
        public async Task<TokenDto> RefreshToken(RefreshTokenDto dto)
        {
            var splitToken = dto.AccessToken.Split(" ");
            dto.AccessToken = splitToken[1];
            var principal = GetPrincipalFromExpiredToken(dto.AccessToken);
            
            if(principal?.Identity?.Name is null)
            {
                throw new UnauthorizedException("");
            }
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Email == principal.Identity.Name);

            if(user is null || user.RefreshToken != dto.RefreshToken || user.RefreshTokenTimeExpires < DateTime.Now)
            {
                throw new UnauthorizedException("");
            }

            var jwtToken = await GenerateJwtToken(principal.Identity.Name);
            return new TokenDto()
            {
                JwtToken = new JwtSecurityTokenHandler().WriteToken(jwtToken),
                Expiration = jwtToken.ValidTo,
                RefreshToken = dto.RefreshToken,
            };
        }
        public async Task RevokeToken()
        {
            var userId = _userContextService.GetUserId;
            if(userId is null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if(user is null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            user.RefreshToken = null;
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
