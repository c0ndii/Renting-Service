﻿using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RentingServiceBackend.Entities;
using RentingServiceBackend.Exceptions;
using RentingServiceBackend.Models;

namespace RentingServiceBackend.Services
{
    public interface IPostService
    {
        Task AddPost(CreatePostDto dto);
        Task<PostDto> GetPostById(int postId);
    }

    public class PostService : IPostService
    {
        private readonly AppDbContext _context;
        private readonly IEmailSenderService _emailSenderService;
        private readonly IUserContextService _userContextService;
        private readonly IMapper _mapper;

        public PostService(AppDbContext context, IEmailSenderService emailSenderService, IUserContextService userContextService, IMapper mapper)
        {
            _context = context;
            _emailSenderService = emailSenderService;
            _userContextService = userContextService;
            _mapper = mapper;
        }
        public async Task AddPost(CreatePostDto dto)
        {
            var userId = _userContextService.GetUserId;
            if (userId == null)
            {
                throw new NotFoundException("Id not found");
            }
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                throw new NotFoundException("Account not found");
            }
            var features = await _context.Features.Where(x => dto.Features.Contains(x.FeatureName)).ToListAsync();
            if (features.IsNullOrEmpty())
            {
                throw new NotFoundException("Features not found");
            }
            var categories = await _context.Categories.Where(x => dto.Categories.Contains(x.CategoryName)).ToListAsync();
            if (categories.IsNullOrEmpty())
            {
                throw new NotFoundException("Categories not found");
            }
            var postToBeAdded = new Post()
            {
                Title = dto.Title,
                Description = dto.Description,
                Image = dto.Image,
                Location = dto.Location,
                AddDate = DateTime.Now,
                FollowedBy = new List<User>(),
                Reservations = new List<Reservation>(),
                Features = features,
                Categories = categories,
                Comments = new List<Comment>(),
                User = user
            };
            await _context.Posts.AddAsync(postToBeAdded);
            await _context.SaveChangesAsync();
        }
        public async Task<PostDto> GetPostById(int postId)
        {
            var post = await _context.Posts.SingleOrDefaultAsync(x => x.PostId == postId);
            if(post == null)
            {
                throw new NotFoundException("Post not found");
            }
            var user = _mapper.Map<UserDto>(post.User);
            List<string> features = post.Features.Select(x => x.FeatureName).ToList();
            List<string> categories = post.Categories.Select(x => x.CategoryName).ToList();
            var comments = _mapper.Map<List<CommentDto>>(post.Comments);
            var result = _mapper.Map<PostDto>(post);
            result.Features = features;
            result.Categories = categories;
            result.Comments = comments;
            result.User = user;
            return result;
        }
    }
}
