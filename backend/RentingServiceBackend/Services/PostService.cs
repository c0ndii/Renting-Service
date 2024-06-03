using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RentingServiceBackend.Entities;
using RentingServiceBackend.Exceptions;
using RentingServiceBackend.Models;

namespace RentingServiceBackend.Services
{
    public interface IPostService
    {
        Task AddRentPost(CreateForRentPostDto dto);
        Task AddSalePost(CreateForSalePostDto dto);
        Task<ForRentPostDto> GetRentPostById(int postId);
        Task<string> AddPicturesToPost(EditPostPicturesDto dto);
    }

    public class PostService : IPostService
    {
        private readonly AppDbContext _context;
        private readonly IEmailSenderService _emailSenderService;
        private readonly IUserContextService _userContextService;
        private readonly IMapper _mapper;
        private readonly string userPostPicturesPath = Path.Combine(System.Environment.CurrentDirectory, $"images\\postPictures\\");

        public PostService(AppDbContext context, IEmailSenderService emailSenderService, IUserContextService userContextService, IMapper mapper)
        {
            _context = context;
            _emailSenderService = emailSenderService;
            _userContextService = userContextService;
            _mapper = mapper;
        }
        public async Task<string> AddPicturesToPost(EditPostPicturesDto dto)
        {
            var userId = _userContextService.GetUserId;
            if (userId == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            if (dto.Pictures.All(x => !(x.ContentType == "image/jpeg" || x.ContentType == "image/png")))
            {
                throw new UnprocessableEntityException("Wrong image format");
            }
            var userPosts = await _context.Users.Include(x => x.OwnedPosts).Where(x => x.UserId == userId).SelectMany(x => x.OwnedPosts).ToListAsync();
            var userPostCounter = userPosts.Count();
            var path = Path.Combine(userPostPicturesPath, $"{user.UserId}_user_{userPostCounter}_post\\");
            Directory.CreateDirectory(path);
            int iter = 0;
            foreach (var picture in dto.Pictures)
            {
                using (FileStream stream = new FileStream(Path.Combine(path, $"image{iter}.png"), FileMode.Create))
                {

                    await picture.CopyToAsync(stream);
                    stream.Close();
                }
                iter++;
            }
            return $"{user.UserId}user_{userPostCounter}";
        }
        public async Task AddRentPost(CreateForRentPostDto dto)
        {
            var userId = _userContextService.GetUserId;
            if (userId == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var features = await _context.Features.Where(x => dto.Features.Contains(x.FeatureName)).ToListAsync();
            if (features.IsNullOrEmpty())
            {
                throw new NotFoundException("Features not found");
            }
            var mainCategory = await _context.ForRentMainCategories.SingleOrDefaultAsync(x => x.MainCategoryName == dto.MainCategory);
            if (mainCategory is null)
            {
                throw new NotFoundException("Main category not found");
            }
            //var categories = await _context.Categories.Where(x => dto.Categories.Contains(x.CategoryName)).ToListAsync();
            //if (categories.IsNullOrEmpty())
            //{
            //    throw new NotFoundException("Categories not found");
            //}
            var postToBeAdded = new ForRentPost()
            {
                Title = dto.Title,
                Description = dto.Description,
                PicturesPath = dto.PicturesPath,
                SleepingPlaceCount = dto.SleepingPlaceCount,
                BuildingNumber = dto.BuildingNumber,
                MainCategoryId = mainCategory.MainCategoryId,
                Street = dto.Street,
                District = dto.District,
                City = dto.City,
                Country = dto.Country,
                Lat = dto.Lat,
                Lng = dto.Lng,
                AddDate = DateTime.Now,
                FollowedBy = new List<User>(),
                Reservations = new List<Reservation>(),
                Features = features,
                Categories = new List<Category>(),
                Comments = new List<Comment>(),
                User = user
            };
            await _context.ForRentPosts.AddAsync(postToBeAdded);
            await _context.SaveChangesAsync();
        }
        public async Task AddSalePost(CreateForSalePostDto dto)
        {
            var userId = _userContextService.GetUserId;
            if (userId == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var mainCategory = await _context.ForSaleMainCategories.SingleOrDefaultAsync(x => x.MainCategoryName == dto.MainCategory);
            if (mainCategory is null)
            {
                throw new NotFoundException("Main category not found");
            }
            var postToBeAdded = new ForSalePost()
            {
                Title = dto.Title,
                Description = dto.Description,
                PicturesPath = dto.PicturesPath,
                BuildingNumber = dto.BuildingNumber,
                MainCategoryId = mainCategory.MainCategoryId,
                Street = dto.Street,
                District = dto.District,
                City = dto.City,
                Country = dto.Country,
                Lat = dto.Lat,
                Lng = dto.Lng,
                AddDate = DateTime.Now,
                FollowedBy = new List<User>(),
                User = user
            };
            await _context.ForSalePosts.AddAsync(postToBeAdded);
            await _context.SaveChangesAsync();
        }
        public async Task<ForRentPostDto> GetRentPostById(int postId)
        {
            var post = await _context.ForRentPosts.Include(x => x.User).Include(x => x.Features).Include(x => x.Categories).SingleOrDefaultAsync(x => x.PostId == postId);
            if(post == null)
            {
                throw new NotFoundException("Post not found");
            }
            //var postOwner = await _context.Users.SingleOrDefaultAsync(x => x.UserId == post.UserId);
            //if (post == null)
            //{
            //    throw new NotFoundException("User not found");
            //}
            var user = _mapper.Map<UserDto>(post.User);
            List<string> features = post.Features.Select(x => x.FeatureName).ToList();
            List<string> categories = post.Categories.Select(x => x.CategoryName).ToList();
            var comments = _mapper.Map<List<CommentDto>>(post.Comments);
            var result = _mapper.Map<ForRentPostDto>(post);
            result.Features = features;
            result.Categories = categories;
            result.Comments = comments;
            result.User = user;
            return result;
        }
    }
}
