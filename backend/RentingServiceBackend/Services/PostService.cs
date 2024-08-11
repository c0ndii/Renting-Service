using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RentingServiceBackend.Entities;
using RentingServiceBackend.Exceptions;
using RentingServiceBackend.Models;
using System.Linq.Expressions;

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
        Task EditSalePost(int postId, CreateForSalePostDto dto);
        Task EditRentPost(int postId, CreateForRentPostDto dto);
        Task<List<ForRentPostDto>> GetUserFollowedRentPosts();
        Task<List<ForSalePostDto>> GetUserFollowedSalePosts();
        Task<bool> ToggleFollow(int postId);
        Task<PageResult<PostDto>> GetAllPostsList(PostQuery query);
        Task<PageResult<PostDto>> GetAllPostsMap(PostQueryMap query);
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
                Lat = Double.Parse(dto.Lat.Replace(".",",")),
                Price = dto.Price,
                SquareFootage = dto.SquareFootage,
                Lng = Double.Parse(dto.Lng.Replace(".", ",")),
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
                Price = dto.Price,
                SquareFootage = dto.SquareFootage,
                Country = dto.Country,
                Lat = Double.Parse(dto.Lat.Replace(".", ",")),
                Lng = Double.Parse(dto.Lng.Replace(".", ",")),
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
            result.isFollowedByUser = await CheckIfUserFollowsPost(postId);
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
            result.isFollowedByUser = await CheckIfUserFollowsPost(postId);
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
                post.isFollowedByUser = await CheckIfUserFollowsPost(post.PostId);
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
                post.isFollowedByUser = await CheckIfUserFollowsPost(post.PostId);
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
            var isUserLoggedIn = _userContextService.isUserLogged;
            if ((isUserLoggedIn is null) || isUserLoggedIn == false)
            {
                return false;
            }
            var userId = _userContextService.GetUserId;
            if (userId is null)
            {
                return false;
            }
            var result = await _context.Posts.AnyAsync(x => x.PostId == postId && x.UserId == userId);
            return result;
        }
        public async Task EditRentPost(int postId, CreateForRentPostDto dto)
        {
            var userId = _userContextService.GetUserId;
            var post = await _context.ForRentPosts.Include(x => x.MainCategory).Include(x => x.Features).SingleOrDefaultAsync(x => x.PostId == postId && x.UserId == userId);
            if (post is not null)
            {
                if(post.MainCategory != await _context.ForRentMainCategories.SingleOrDefaultAsync(x => x.MainCategoryName == dto.MainCategory))
                {
                    post.MainCategory = await _context.ForRentMainCategories.SingleOrDefaultAsync(x => x.MainCategoryName == dto.MainCategory);
                }
                post.Title = dto.Title;
                post.Description = dto.Description;
                post.SleepingPlaceCount = dto.SleepingPlaceCount;
                post.Price = dto.Price;
                post.SquareFootage = dto.SquareFootage;
                post.PicturesPath = dto.PicturesPath;
                post.Lat = Double.Parse(dto.Lat.Replace(".", ","));
                post.Lng = Double.Parse(dto.Lng.Replace(".", ","));
                post.Features = await _context.Features.Where(x => dto.Features.Contains(x.FeatureName) && !post.Features.Contains(x)).ToListAsync();

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
            var post = await _context.ForSalePosts.SingleOrDefaultAsync(x => x.PostId == postId && x.UserId == userId);
            if (post is not null)
            {
                if (post.MainCategory != await _context.ForSaleMainCategories.SingleOrDefaultAsync(x => x.MainCategoryName == dto.MainCategory))
                {
                    post.MainCategory = await _context.ForSaleMainCategories.SingleOrDefaultAsync(x => x.MainCategoryName == dto.MainCategory);
                }
                post.Title = dto.Title;
                post.Description = dto.Description;
                post.Price = dto.Price;
                post.SquareFootage = dto.SquareFootage;
                post.PicturesPath = dto.PicturesPath;
                post.Lat = Double.Parse(dto.Lat.Replace(".", ","));
                post.Lng = Double.Parse(dto.Lng.Replace(".", ","));
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

        public async Task<bool> ToggleFollow(int postId)
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
        private async Task<bool?> CheckIfUserFollowsPost(int postId)
        {
            var isUserLoggedIn = _userContextService.isUserLogged;
            if ((isUserLoggedIn is null) || isUserLoggedIn == false)
            {
                return null;
            }
            var userId = _userContextService.GetUserId;
            if (userId is null)
            {
                return null;
            }
            var user = await _context.Users.SingleOrDefaultAsync(x => x.UserId == userId);
            if (user is null)
            {
                return null;
            }
            var result = await _context.Posts.Include(x => x.FollowedBy).AnyAsync(x => x.PostId == postId && x.FollowedBy.Contains(user));
            return result;
        }
        public async Task<PageResult<PostDto>> GetAllPostsList(PostQuery query) 
        {
            if (String.Compare(query.PostType, "rent") == 0)
            {
                var rentPosts = await GetRentPosts(query);
                
                return rentPosts;
            } else
            {
                var salePosts = await GetSalePosts(query);
                return salePosts;
            }
        }
        private async Task<PageResult<PostDto>> GetRentPosts(PostQuery query)
        {
            var columnSelectors = new Dictionary<string, Expression<Func<Post, object>>>
            {
                { nameof(Post.AddDate), x => x.AddDate },
                { nameof(Post.Price), x => x.Price },
                { nameof(Post.SquareFootage), x => x.SquareFootage },
            };
            var selectedColumn = columnSelectors[query.SortBy];
            List<Post> rentPosts = new List<Post>(); 
            if (query.SortDirection == SortDirection.ASC)
            {
                rentPosts = await _context.ForRentPosts
                    .Include(x => x.Features)
                    .Include(x => x.User)
                    .Include(x => x.MainCategory)
                    .Where(x => (string.IsNullOrEmpty(query.SearchPhrase)
                    || (x.Title.ToLower().Contains(query.SearchPhrase.ToLower())
                    || x.Description.ToLower().Contains(query.SearchPhrase.ToLower())))
                    && (query.FeatureFilters.IsNullOrEmpty()
                    || x.Features.Any(y => query.FeatureFilters.Contains(y.FeatureName)))
                    && (!query.MinPrice.HasValue
                    || x.Price >= query.MinPrice)
                    && (!query.MaxPrice.HasValue
                    || x.Price <= query.MaxPrice)
                    && (!query.MinSquare.HasValue
                    || x.SquareFootage >= query.MinSquare)
                    && (!query.MaxSquare.HasValue
                    || x.SquareFootage <= query.MaxSquare)
                    && (!query.MinSleepingCount.HasValue
                    || x.SleepingPlaceCount >= query.MinSleepingCount)
                    && (!query.MaxSleepingCount.HasValue
                    || x.SleepingPlaceCount <= query.MaxSleepingCount)
                    && (query.MainCategory.IsNullOrEmpty()
                    || x.MainCategory.MainCategoryName == query.MainCategory)
                    && x.Confirmed == true).OrderBy(selectedColumn).ToListAsync();
            }
            else
            {
                rentPosts = await _context.ForRentPosts
                    .Include(x => x.Features)
                    .Include(x => x.User)
                    .Include(x => x.MainCategory)
                    .Where(x => (string.IsNullOrEmpty(query.SearchPhrase)
                    || (x.Title.ToLower().Contains(query.SearchPhrase.ToLower())
                    || x.Description.ToLower().Contains(query.SearchPhrase.ToLower())))
                    && (query.FeatureFilters.IsNullOrEmpty()
                    || x.Features.Any(y => query.FeatureFilters.Contains(y.FeatureName)))
                    && (!query.MinPrice.HasValue
                    || x.Price >= query.MinPrice)
                    && (!query.MaxPrice.HasValue
                    || x.Price <= query.MaxPrice)
                    && (!query.MinSquare.HasValue
                    || x.SquareFootage >= query.MinSquare)
                    && (!query.MaxSquare.HasValue
                    || x.SquareFootage <= query.MaxSquare)
                    && (!query.MinSleepingCount.HasValue
                    || x.SleepingPlaceCount >= query.MinSleepingCount)
                    && (!query.MaxSleepingCount.HasValue
                    || x.SleepingPlaceCount <= query.MaxSleepingCount)
                    && (query.MainCategory.IsNullOrEmpty()
                    || x.MainCategory.MainCategoryName == query.MainCategory)
                    && x.Confirmed == true).OrderByDescending(selectedColumn).ToListAsync();
            }
            var result = rentPosts
                    .Skip(query.PageSize * (query.PageNumber - 1))
                    .Take(query.PageSize);
            var totalItemsCount = rentPosts.Count;
            var mappedResult = _mapper.Map<List<PostDto>>(result);
            foreach (var post in mappedResult)
            {
                post.isFollowedByUser = await CheckIfUserFollowsPost(post.PostId);
                var path = Path.Combine(userPostPicturesPath, $"{post.PicturesPath}\\image0.png");
                if (File.Exists(path))
                {
                    byte[] bytes = File.ReadAllBytes(path);
                    string image = Convert.ToBase64String(bytes);
                    post.Pictures.Add(image);
                }
            }
            return new PageResult<PostDto>(mappedResult, totalItemsCount, query.PageSize, query.PageNumber);
        }
        private async Task<PageResult<PostDto>> GetSalePosts(PostQuery query)
        {
            var columnSelectors = new Dictionary<string, Expression<Func<Post, object>>>
            {
                { nameof(Post.AddDate), x => x.AddDate },
                { nameof(Post.Price), x => x.Price },
                { nameof(Post.SquareFootage), x => x.SquareFootage },
            };
            var selectedColumn = columnSelectors[query.SortBy];
            List<Post> salePosts = new List<Post>();
            if (query.SortDirection == SortDirection.ASC)
            {
                salePosts = await _context.ForSalePosts
                        .Include(x => x.User)
                        .Include(x => x.MainCategory)
                        .Where(x => (string.IsNullOrEmpty(query.SearchPhrase)
                        || (x.Title.ToLower().Contains(query.SearchPhrase.ToLower())
                        || x.Description.ToLower().Contains(query.SearchPhrase.ToLower())))
                        && (!query.MinPrice.HasValue
                        || x.Price >= query.MinPrice)
                        && (!query.MaxPrice.HasValue
                        || x.Price <= query.MaxPrice)
                        && (!query.MinSquare.HasValue
                        || x.SquareFootage >= query.MinSquare)
                        && (!query.MaxSquare.HasValue
                        || x.SquareFootage <= query.MaxSquare)
                        && (query.MainCategory.IsNullOrEmpty()
                        || x.MainCategory.MainCategoryName == query.MainCategory)
                        && x.Confirmed == true).OrderBy(selectedColumn).ToListAsync();
            }
            else
            {
                salePosts = await _context.ForSalePosts
                        .Include(x => x.User)
                        .Include(x => x.MainCategory)
                        .Where(x => (string.IsNullOrEmpty(query.SearchPhrase)
                        || (x.Title.ToLower().Contains(query.SearchPhrase.ToLower())
                        || x.Description.ToLower().Contains(query.SearchPhrase.ToLower())))
                        && (!query.MinPrice.HasValue
                        || x.Price >= query.MinPrice)
                        && (!query.MaxPrice.HasValue
                        || x.Price <= query.MaxPrice)
                        && (!query.MinSquare.HasValue
                        || x.SquareFootage >= query.MinSquare)
                        && (!query.MaxSquare.HasValue
                        || x.SquareFootage <= query.MaxSquare)
                        && (query.MainCategory.IsNullOrEmpty()
                        || x.MainCategory.MainCategoryName == query.MainCategory)
                        && x.Confirmed == true).OrderByDescending(selectedColumn).ToListAsync();
            }
            var result = salePosts
                    .Skip(query.PageSize * (query.PageNumber - 1))
                    .Take(query.PageSize);
            var totalItemsCount = salePosts.Count;
            var mappedResult = _mapper.Map<List<PostDto>>(result);
            foreach (var post in mappedResult)
            {
                post.isFollowedByUser = await CheckIfUserFollowsPost(post.PostId);
                var path = Path.Combine(userPostPicturesPath, $"{post.PicturesPath}\\image0.png");
                if (File.Exists(path))
                {
                    byte[] bytes = File.ReadAllBytes(path);
                    string image = Convert.ToBase64String(bytes);
                    post.Pictures.Add(image);
                }
            }
            return new PageResult<PostDto>(mappedResult, totalItemsCount, query.PageSize, query.PageNumber);
        }

        public async Task<PageResult<PostDto>> GetAllPostsMap(PostQueryMap query)
        {
            if (String.Compare(query.PostType, "rent") == 0)
            {
                var rentPosts = await GetRentPostsMap(query);

                return rentPosts;
            }
            else
            {
                var salePosts = await GetSalePostsMap(query);
                return salePosts;
            }
        }

        private async Task<PageResult<PostDto>> GetRentPostsMap(PostQueryMap query)
        {
            var rentPosts = await _context.ForRentPosts
                .Include(x => x.Features)
                .Include(x => x.User)
                .Include(x => x.MainCategory)
                .Where(x => (string.IsNullOrEmpty(query.SearchPhrase)
                || (x.Title.ToLower().Contains(query.SearchPhrase.ToLower())
                || x.Description.ToLower().Contains(query.SearchPhrase.ToLower())))
                && (query.FeatureFilters.IsNullOrEmpty()
                || x.Features.Any(y => query.FeatureFilters.Contains(y.FeatureName)))
                && (!query.MinPrice.HasValue
                || x.Price >= query.MinPrice)
                && (!query.MaxPrice.HasValue
                || x.Price <= query.MaxPrice)
                && (!query.MinSquare.HasValue
                || x.SquareFootage >= query.MinSquare)
                && (!query.MaxSquare.HasValue
                || x.SquareFootage <= query.MaxSquare)
                && (!query.MinSleepingCount.HasValue
                || x.SleepingPlaceCount >= query.MinSleepingCount)
                && (!query.MaxSleepingCount.HasValue
                || x.SleepingPlaceCount <= query.MaxSleepingCount)
                && (query.MainCategory.IsNullOrEmpty()
                || x.MainCategory.MainCategoryName == query.MainCategory)
                && x.Confirmed == true
                && x.Lat <= Double.Parse(query.NorthEastLat.Replace(".", ","))
                && x.Lat >= Double.Parse(query.SouthWestLat.Replace(".", ","))
                && x.Lng <= Double.Parse(query.NorthEastLng.Replace(".", ","))
                && x.Lng >= Double.Parse(query.SouthWestLng.Replace(".", ","))
                ).ToListAsync();
            var mappedResult = _mapper.Map<List<PostDto>>(rentPosts);
            foreach (var post in mappedResult)
            {
                post.isFollowedByUser = await CheckIfUserFollowsPost(post.PostId);
                var path = Path.Combine(userPostPicturesPath, $"{post.PicturesPath}\\image0.png");
                if (File.Exists(path))
                {
                    byte[] bytes = File.ReadAllBytes(path);
                    string image = Convert.ToBase64String(bytes);
                    post.Pictures.Add(image);
                }
            }
            return new PageResult<PostDto>(mappedResult, 0, 0, 0);
        }
        private async Task<PageResult<PostDto>> GetSalePostsMap(PostQueryMap query)
        {
            var salePosts = await _context.ForSalePosts
                .Include(x => x.User)
                .Include(x => x.MainCategory)
                .Where(x => (string.IsNullOrEmpty(query.SearchPhrase)
                || (x.Title.ToLower().Contains(query.SearchPhrase.ToLower())
                || x.Description.ToLower().Contains(query.SearchPhrase.ToLower())))
                && (!query.MinPrice.HasValue
                || x.Price >= query.MinPrice)
                && (!query.MaxPrice.HasValue
                || x.Price <= query.MaxPrice)
                && (!query.MinSquare.HasValue
                || x.SquareFootage >= query.MinSquare)
                && (!query.MaxSquare.HasValue
                || x.SquareFootage <= query.MaxSquare)
                && (query.MainCategory.IsNullOrEmpty()
                || x.MainCategory.MainCategoryName == query.MainCategory)
                && x.Confirmed == true 
                && x.Lat <= Double.Parse(query.NorthEastLat.Replace(".", ","))
                && x.Lat >= Double.Parse(query.SouthWestLat.Replace(".", ","))
                && x.Lng <= Double.Parse(query.NorthEastLng.Replace(".", ","))
                && x.Lng >= Double.Parse(query.SouthWestLng.Replace(".", ","))
                ).ToListAsync();

            var mappedResult = _mapper.Map<List<PostDto>>(salePosts);
            foreach (var post in mappedResult)
            {
                post.isFollowedByUser = await CheckIfUserFollowsPost(post.PostId);
                var path = Path.Combine(userPostPicturesPath, $"{post.PicturesPath}\\image0.png");
                if (File.Exists(path))
                {
                    byte[] bytes = File.ReadAllBytes(path);
                    string image = Convert.ToBase64String(bytes);
                    post.Pictures.Add(image);
                }
            }
            return new PageResult<PostDto>(mappedResult, 0, 0, 0);
        }
    }
}
