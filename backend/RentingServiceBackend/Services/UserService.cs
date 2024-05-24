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
using System.Drawing;

namespace RentingServiceBackend.Services
{
    public interface IUserService
    {
        Task<UserDto> GetUser();
        Task<UserDto> GetUser(int userId);
        Task EditUserName(string dto);
        Task EditUserPicture(EditUserPictureDto dto);
    }

    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly IUserContextService _userContextService;
        private readonly IMapper _mapper;
        private readonly string userPicturesPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, $"images/profilePictures/");
        public UserService(AppDbContext context, IUserContextService userContextService, IMapper mapper)
        {
            _context = context;
            _userContextService = userContextService;
            _mapper = mapper;
        }
        private async Task<User> AuthUser()
        {
            var userId = _userContextService.GetUserId;
            if (userId == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var user = await _context.Users.Include(x => x.Role).SingleOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            return user;
        }
        private async Task<User> AuthUser(int userId)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                throw new NotFoundException("User not found");
            }
            return user;
        }
        public async Task<UserDto> GetUser()
        {
            var user = await AuthUser();
            var result = _mapper.Map<UserDto>(user);
            var path = Path.Combine(userPicturesPath, $"{user.UserId}avatar");
            if (File.Exists(path))
            {
                byte[] bytes = File.ReadAllBytes(path);
                string image = Convert.ToBase64String(bytes);
                result.Picture = image;
            }
            return result;
        }
        public async Task<UserDto> GetUser(int userId)
        {
            var user = await AuthUser(userId);
            var result = _mapper.Map<UserDto>(user);
            var path = Path.Combine(userPicturesPath, $"{user.UserId}avatar");
            if (File.Exists(path))
            {
                byte[] bytes = File.ReadAllBytes(path);
                string image = Convert.ToBase64String(bytes);
                result.Picture = image;
            }
            return result;
        }
        public async Task EditUserName(string dto)
        {
            var user = await AuthUser();
            user.Name = dto;
            _context.Update(user);
            await _context.SaveChangesAsync();
        }
        public async Task EditUserPicture(EditUserPictureDto dto)
        {
            List<string> PermittedFileTypes = new List<string> {
                "image/jpeg",
                "image/png",
            };
            var user = await AuthUser();
            if (!PermittedFileTypes.Contains(dto.Picture.ContentType))
            {
                throw new UnprocessableEntityException("Wrong image format");
            }
            var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory,$"images/profilePictures/{user.UserId}avatar");
            Console.WriteLine(path);
            using (FileStream stream = new FileStream(path, FileMode.Create))
            {
                await dto.Picture.CopyToAsync(stream);
                stream.Close();
            }
            user.Picture = $"{user.UserId}avatar";
            _context.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
