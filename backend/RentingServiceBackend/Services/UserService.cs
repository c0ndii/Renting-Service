using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using RentingServiceBackend.Entities;
using RentingServiceBackend.Models;
using RentingServiceBackend.Exceptions;
using Microsoft.IdentityModel.Tokens;
using RentingServiceBackend.ServiceSettings;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Security.Claims;
using System.Text;

namespace RentingServiceBackend.Services
{
    public interface IUserService
    {
        Task ForgotPasswordAsync(string email);
        Task<string> LoginAsync(LoginUserDto dto);
        Task RegisterUserAsync(RegisterUserDto dto);
        Task ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
        Task VerifyAccountAsync(string token);
    }

    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IEmailSenderService _emailSenderService;
        private readonly IUserContextService _userContextService;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IMapper _mapper;
        private readonly AuthenticationSettings _authenticationSettings;
        private string CreateRandomToken(int number)
        {
            return Guid.NewGuid().ToString().Substring(0, number).ToUpper();
        }
        public UserService(AppDbContext context, IEmailSenderService emailSenderService, IUserContextService userContextService, IMapper mapper, IPasswordHasher<User> passwordHasher, AuthenticationSettings authenticationSettings)
        {
            _context = context;
            _emailSenderService = emailSenderService;
            _userContextService = userContextService;
            _passwordHasher = passwordHasher;
            _mapper = mapper;
            _authenticationSettings = authenticationSettings;
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
        public async Task<string> LoginAsync(LoginUserDto dto)
        {
            var user = await _context.Users
                .Include(x => x.Role)
                .SingleOrDefaultAsync(x => x.Email == dto.Email && x.Role.Name != "Unconfirmed");
            if (user is null)
            {
                throw new BadRequestException("Invalid password or account not confirmed");
            }
            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                throw new BadRequestException("Invalid username or password");
            }
            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, $"{user.Email}"),
                new Claim(ClaimTypes.Role, $"{user.Role.Name}"),
            };
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authenticationSettings.JwtKey));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(_authenticationSettings.JwtExpireDays);

            var token = new JwtSecurityToken(_authenticationSettings.JwtIssuer,
                _authenticationSettings.JwtIssuer,
                claims,
                expires: expires,
                signingCredentials: cred);

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(token);
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
                throw new NotFoundException("User not found");
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
    }
}
