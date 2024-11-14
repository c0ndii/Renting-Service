using AutoMapper;
using Humanizer;
using Microsoft.EntityFrameworkCore;
using RentingServiceBackend.Entities;
using RentingServiceBackend.Exceptions;
using RentingServiceBackend.Models;
using System.Drawing.Text;

namespace RentingServiceBackend.Services
{
    public interface ICommentService
    {
        Task AddComment(int postId, CreateCommentDto dto);
        Task DeleteComment(int commentId);
        Task<List<CommentDto>> GetAllUserComments();
        Task<bool> CanUserCommentPost(int postId);
    }

    public class CommentService : ICommentService
    {
        private readonly IUserContextService _userContextService;
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public CommentService(IUserContextService userContextService, AppDbContext context, IMapper mapper)
        {
            _userContextService = userContextService;
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<CommentDto>> GetAllUserComments()
        {
            var userId = _userContextService.GetUserId;
            if (userId == null)
            {
                throw new UnauthorizedException("Could not authenticate user");
            }

            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user is null)
            {
                throw new NotFoundException("User not found");
            }

            var comments = await _context.Comments.Include(x => x.Post).ThenInclude(x => x.MainCategory).Include(x => x.Post).ThenInclude(x=>x.User)
                .Where(x => x.UserId == user.UserId && !x.Post.isDeleted && !x.Post.User.isDeleted).OrderByDescending(x => x.CommentTime).ToListAsync();
            var result = _mapper.Map<List<CommentDto>>(comments);

            return result;
        }

        public async Task DeleteComment(int commentId)
        {
            var userId = _userContextService.GetUserId;
            if (userId == null)
            {
                throw new UnauthorizedException("Could not authenticate user");
            }

            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user is null)
            {
                throw new NotFoundException("User not found");
            }

            var comment = await _context.Comments
                .Include(x => x.User).Include(x => x.Post)
                .SingleOrDefaultAsync(x => x.CommentId == commentId && !x.User.isDeleted && !x.Post.isDeleted && (x.UserId == user.UserId || x.User.Role.Name == "Admin"));
            if (comment is null)
            {
                throw new NotFoundException("Comment not found");
            }
            _context.Remove(comment);
            await _context.SaveChangesAsync();
        }

        public async Task AddComment(int postId, CreateCommentDto dto)
        {
            var userId = _userContextService.GetUserId;
            if (userId == null)
            {
                throw new UnauthorizedException("Could not authenticate user");
            }

            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user is null)
            {
                throw new NotFoundException("User not found");
            }

            var canComment = await _context.Comments
                .Include(x => x.Post)
                .Include(x => x.User)
                .ThenInclude(x => x.Reservations)
                .Where(x => x.PostId == postId && !x.Post.isDeleted && !x.User.isDeleted && x.Post.Reservations
                    .Any(x => x.PostId == postId && x.UserId == userId && x.ReservationFlag == ReservationFlagEnum.Completed)).ToListAsync();

            if(canComment.Count() > 0)
            {
                throw new BadRequestException("Already commented");
            }

            var comment = new Comment()
            {
                CommentText = dto.CommentText,
                UserId = user.UserId,
                PostId = postId,
                CommentTime = DateTime.Now
            };

            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> CanUserCommentPost(int postId)
        {
            var userId = _userContextService.GetUserId;
            if (userId == null)
            {
                throw new UnauthorizedException("Could not authenticate user");
            }

            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user is null)
            {
                throw new NotFoundException("User not found");
            }

            var canComment = await _context.Comments
                .Include(x => x.Post)
                .Include(x => x.User)
                .ThenInclude(x => x.Reservations)
                .Where(x => x.PostId == postId && !x.User.isDeleted && !x.Post.isDeleted && x.Post.Reservations
                    .Any(x => x.PostId == postId && x.UserId == userId && x.ReservationFlag == ReservationFlagEnum.Completed)).ToListAsync();

            if (canComment.Count() > 0)
            {
                return false;
            } else
            {
                return true;
            }
        }
    }
}
