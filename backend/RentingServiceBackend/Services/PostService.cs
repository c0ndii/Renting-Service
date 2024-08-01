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
        Task<ForSalePostDto> GetSalePostById(int postId);
        Task<string> AddPicturesToPost(EditPostPicturesDto dto);
        Task<List<ForRentPostDto>> GetAllUserRentPosts();
        Task<List<ForRentPostDto>> GetAllUserRentPosts(int userId);
        Task<List<ForSalePostDto>> GetAllUserSalePosts();
        Task<List<ForSalePostDto>> GetAllUserSalePosts(int userId);
        Task DeletePost(int postId);
        Task<bool> IsOwner(int postId);
        Task EditSalePost(int postId, CreateForSalePostDto dto);
        Task EditRentPost(int postId, CreateForRentPostDto dto);
        Task<List<ForRentPostDto>> GetUserFollowedRentPosts();
        Task<List<ForSalePostDto>> GetUserFollowedSalePosts();
        Task<bool> ToggleRentFollow(int postId);
        Task<bool> ToggleSaleFollow(int postId);
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
            return $"{user.UserId}_user_{userPostCounter}_post";
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
            var post = await _context.ForRentPosts
                .Include(x => x.User)
                .Include(x => x.MainCategory)
                .Include(x => x.Features)
                .Include(x => x.Comments)
                .Include(x => x.FollowedBy)
                .SingleOrDefaultAsync(x => x.PostId == postId);
            if(post == null)
            {
                throw new NotFoundException("Post not found");
            }
            var result = _mapper.Map<ForRentPostDto>(post);
            result.isFollowedByUser = await CheckIfUserFollowsRentPost(postId);
            int iter = 0;
            var path = Path.Combine(userPostPicturesPath, $"{post.PicturesPath}\\image{iter}.png");
            while (File.Exists(path))
            {
                byte[] bytes = File.ReadAllBytes(path);
                string image = Convert.ToBase64String(bytes);
                result.Pictures.Add(image);
                path = Path.Combine(userPostPicturesPath, $"{post.PicturesPath}\\image{++iter}.png");
            }
            return result;
        }
        public async Task<ForSalePostDto> GetSalePostById(int postId)
        {
            var post = await _context.ForSalePosts.Include(x => x.User).Include(x => x.MainCategory).SingleOrDefaultAsync(x => x.PostId == postId);
            if (post == null)
            {
                throw new NotFoundException("Post not found");
            }
            var result = _mapper.Map<ForSalePostDto>(post);
            result.isFollowedByUser = await CheckIfUserFollowsSalePost(postId);
            int iter = 0;
            var path = Path.Combine(userPostPicturesPath, $"{post.PicturesPath}\\image{iter}.png");
            while (File.Exists(path))
            {
                byte[] bytes = File.ReadAllBytes(path);
                string image = Convert.ToBase64String(bytes);
                result.Pictures.Add(image);
                path = Path.Combine(userPostPicturesPath, $"{post.PicturesPath}\\image{++iter}.png");
            }
            return result;
        }
        public async Task<List<ForRentPostDto>> GetAllUserRentPosts()
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
            var posts = await _context.ForRentPosts.Include(x => x.User).Include(x => x.MainCategory).Include(x => x.Features).Include(x => x.Comments).Where(x => x.UserId == userId).ToListAsync();
            var result = _mapper.Map<List<ForRentPostDto>>(posts);
            foreach(var post in result)
            {
                var path = Path.Combine(userPostPicturesPath, $"{post.PicturesPath}\\image0.png");
                if (File.Exists(path))
                {
                    byte[] bytes = File.ReadAllBytes(path);
                    string image = Convert.ToBase64String(bytes);
                    post.Pictures.Add(image);
                }   
            }
            return result;
        }
        public async Task<List<ForRentPostDto>> GetAllUserRentPosts(int userId)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var posts = await _context.ForRentPosts.Include(x => x.User).Include(x => x.MainCategory).Include(x => x.Features).Include(x => x.Comments).Where(x => x.UserId == userId).ToListAsync();
            var result = _mapper.Map<List<ForRentPostDto>>(posts);
            foreach (var post in result)
            {
                post.isFollowedByUser = await CheckIfUserFollowsRentPost(post.PostId);
                var path = Path.Combine(userPostPicturesPath, $"{post.PicturesPath}\\image0.png");
                if (File.Exists(path))
                {
                    byte[] bytes = File.ReadAllBytes(path);
                    string image = Convert.ToBase64String(bytes);
                    post.Pictures.Add(image);
                }
            }
            return result;
        }
        public async Task<List<ForSalePostDto>> GetAllUserSalePosts()
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
            var posts = await _context.ForSalePosts.Include(x => x.User).Include(x => x.MainCategory).Where(x => x.UserId == userId).ToListAsync();
            var result = _mapper.Map<List<ForSalePostDto>>(posts);
            foreach (var post in result)
            {
                var path = Path.Combine(userPostPicturesPath, $"{post.PicturesPath}\\image0.png");
                if (File.Exists(path))
                {
                    byte[] bytes = File.ReadAllBytes(path);
                    string image = Convert.ToBase64String(bytes);
                    post.Pictures.Add(image);
                }
            }
            return result;
        }
        public async Task<List<ForSalePostDto>> GetAllUserSalePosts(int userId)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var posts = await _context.ForSalePosts.Include(x => x.User).Include(x => x.MainCategory).Where(x => x.UserId == userId).ToListAsync();
            var result = _mapper.Map<List<ForSalePostDto>>(posts);
            foreach (var post in result)
            {
                post.isFollowedByUser = await CheckIfUserFollowsSalePost(post.PostId);
                var path = Path.Combine(userPostPicturesPath, $"{post.PicturesPath}\\image0.png");
                if (File.Exists(path))
                {
                    byte[] bytes = File.ReadAllBytes(path);
                    string image = Convert.ToBase64String(bytes);
                    post.Pictures.Add(image);
                }
            }
            return result;
        }
        public async Task DeletePost(int postId)
        {
            var userId = _userContextService.GetUserId;
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var post = await _context.Posts.SingleOrDefaultAsync(x => x.PostId == postId && x.UserId == userId);
            if(post == null)
            {
                throw new NotFoundException("Post not found");
            }
            _context.Posts.Remove(post);
            await _context.SaveChangesAsync();
        }
        public async Task<bool> IsOwner(int postId)
        {
            var userId = _userContextService.GetUserId;
            if(userId is null)
            {
                return false;
            }
            var result = await _context.Posts.AnyAsync(x => x.PostId == postId && x.UserId == userId);
            return result;
        }
        public async Task EditRentPost(int postId, CreateForRentPostDto dto)
        {
            var userId = _userContextService.GetUserId;
            var post = await _context.ForRentPosts.SingleOrDefaultAsync(x => x.PostId == postId && x.UserId == userId);
            if (post is not null)
            {
                post.Title = dto.Title;
                post.Description = dto.Description;
                post.MainCategory = await _context.ForRentMainCategories.SingleOrDefaultAsync(x => x.MainCategoryName == dto.MainCategory);
                post.SleepingPlaceCount = dto.SleepingPlaceCount;
                post.Price = dto.Price;
                post.SquareFootage = dto.SquareFootage;
                post.PicturesPath = dto.PicturesPath;
                post.Lat = dto.Lat;
                post.Lng = dto.Lng;
                post.Features = await _context.Features.Where(x => dto.Features.Contains(x.FeatureName)).ToListAsync();
                post.BuildingNumber = dto.BuildingNumber;
                post.Street = dto.Street;
                post.District = dto.District;
                post.City = dto.City;
                post.Country = dto.Country;
                await _context.SaveChangesAsync();
            }
        }
        public async Task EditSalePost(int postId, CreateForSalePostDto dto)
        {
            var userId = _userContextService.GetUserId;
            var post = await _context.ForRentPosts.SingleOrDefaultAsync(x => x.PostId == postId && x.UserId == userId);
            if (post is not null)
            {
                post.Title = dto.Title;
                post.Description = dto.Description;
                post.MainCategory = await _context.ForRentMainCategories.SingleOrDefaultAsync(x => x.MainCategoryName == dto.MainCategory);
                post.Price = dto.Price;
                post.SquareFootage = dto.SquareFootage;
                post.PicturesPath = dto.PicturesPath;
                post.Lat = dto.Lat;
                post.Lng = dto.Lng;
                post.BuildingNumber = dto.BuildingNumber;
                post.Street = dto.Street;
                post.District = dto.District;
                post.City = dto.City;
                post.Country = dto.Country;
                await _context.SaveChangesAsync();
            }
        }
        public async Task<List<ForRentPostDto>> GetUserFollowedRentPosts()
        {
            var userId = _userContextService.GetUserId;
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var posts = await _context.ForRentPosts.Include(x => x.User).Include(x => x.MainCategory).Where(x => x.FollowedBy.Contains(user)).ToListAsync();
            var result = _mapper.Map<List<ForRentPostDto>>(posts);
            foreach (var post in result)
            {
                post.isFollowedByUser = true;
                var path = Path.Combine(userPostPicturesPath, $"{post.PicturesPath}\\image0.png");
                if (File.Exists(path))
                {
                    byte[] bytes = File.ReadAllBytes(path);
                    string image = Convert.ToBase64String(bytes);
                    post.Pictures.Add(image);
                }
            }
            return result;
        }
        public async Task<List<ForSalePostDto>> GetUserFollowedSalePosts()
        {
            var userId = _userContextService.GetUserId;
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var posts = await _context.ForSalePosts.Include(x => x.User).Include(x => x.MainCategory).Where(x => x.FollowedBy.Contains(user)).ToListAsync();
            var result = _mapper.Map<List<ForSalePostDto>>(posts);
            foreach (var post in result)
            {
                post.isFollowedByUser = true;
                var path = Path.Combine(userPostPicturesPath, $"{post.PicturesPath}\\image0.png");
                if (File.Exists(path))
                {
                    byte[] bytes = File.ReadAllBytes(path);
                    string image = Convert.ToBase64String(bytes);
                    post.Pictures.Add(image);
                }
            }
            return result;
        }
        public async Task<bool> ToggleRentFollow(int postId)
        {
            var userId = _userContextService.GetUserId;
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var post = await _context.Posts.Include(x => x.User).Include(x => x.FollowedBy).SingleOrDefaultAsync(x => x.PostId == postId && x.User != user);
            if (post.FollowedBy.Contains(user))
            {
                post.FollowedBy.Remove(user);
                await _context.SaveChangesAsync();
                return false;
            } else
            {
                post.FollowedBy.Add(user);
                await _context.SaveChangesAsync();
                return true;
            }
            
        }
        public async Task<bool> ToggleSaleFollow(int postId)
        {
            var userId = _userContextService.GetUserId;
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user == null)
            {
                throw new UnauthorizedException("Could not authorize user");
            }
            var post = await _context.Posts.Include(x => x.User).Include(x => x.FollowedBy).SingleOrDefaultAsync(x => x.PostId == postId && x.User != user);
            if (post.FollowedBy.Contains(user))
            {
                post.FollowedBy.Remove(user);
                await _context.SaveChangesAsync();
                return false;
            }
            else
            {
                post.FollowedBy.Add(user);
                await _context.SaveChangesAsync();
                return true;
            }

        }
        private async Task<bool?> CheckIfUserFollowsRentPost(int postId)
        {
            int? userId = _userContextService.GetUserId;
            if (userId is null)
            {
                return null;
            }
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user is null)
            {
                return null;
            }
            var result = await _context.ForRentPosts.Include(x => x.FollowedBy).AnyAsync(x => x.PostId == postId && x.FollowedBy.Contains(user));
            return result;
        }
        private async Task<bool?> CheckIfUserFollowsSalePost(int postId)
        {
            int? userId = _userContextService.GetUserId;
            if (userId is null)
            {
                return null;
            }
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user is null)
            {
                return null;
            }
            var result = await _context.ForSalePosts.Include(x => x.FollowedBy).AnyAsync(x => x.PostId == postId && x.FollowedBy.Contains(user));
            return result;
        }
    }
}
