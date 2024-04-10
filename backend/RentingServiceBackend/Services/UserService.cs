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
        Task<UserDto> GetUserName();
        Task<UserDto> GetUserName(int userId);
    }

    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IUserContextService _userContextService;
        private readonly IMapper _mapper;
        public UserService(AppDbContext context, IUserContextService userContextService, IMapper mapper)
        {
            _context = context;
            _userContextService = userContextService;
            _mapper = mapper;
        }
        
        public async Task<UserDto> GetUserName()
        {
            var userId = _userContextService.GetUserId;
            if(userId == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if(user == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var result = _mapper.Map<UserDto>(user);
            return result;
        }
        public async Task<UserDto> GetUserName(int userId)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }
            var result = _mapper.Map<UserDto>(user);
            return result;
        }
    }
}
