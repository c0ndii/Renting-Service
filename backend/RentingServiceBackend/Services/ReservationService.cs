using AutoMapper;
using Microsoft.EntityFrameworkCore;
using RentingServiceBackend.Entities;
using RentingServiceBackend.Exceptions;
using RentingServiceBackend.Models;

namespace RentingServiceBackend.Services
{
    public interface IReservationService
    {
        Task AddNewReservation(int postId, CreateReservationDto dto);
        Task CancelReservation(int reservationId);
        Task CompleteReservation(int reservationId);
        Task ConfirmReservation(int reservationId);
        Task<List<ReservationDto>> GetAllReservationsByPostId(int postId);
        Task<List<ReservationDto>> GetAllUserReservations();
    }

    public class ReservationService : IReservationService
    {
        private readonly IUserContextService _userContextService;
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ReservationService(IUserContextService userContextService, AppDbContext context, IMapper mapper)
        {
            _userContextService = userContextService;
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<ReservationDto>> GetAllReservationsByPostId(int postId)
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

            var reservations = await _context.Reservations.Include(x => x.Post).Where(x => x.PostId == postId).ToListAsync();
            var result = _mapper.Map<List<ReservationDto>>(reservations);

            return result;
        }

        public async Task<List<ReservationDto>> GetAllUserReservations()
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

            var reservations = await _context.Reservations.Include(x => x.Post).Include(x => x.User).Where(x => x.UserId == userId).ToListAsync();
            var result = _mapper.Map<List<ReservationDto>>(reservations);

            return result;
        }

        public async Task AddNewReservation(int postId, CreateReservationDto dto)
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

            var post = await _context.ForRentPosts
                .Include(x => x.User)
                .SingleOrDefaultAsync(x => x.PostId == postId && x.Confirmed && !x.User.isDeleted && x.User.UserId != user.UserId);
            if (post is null)
            {
                throw new NotFoundException("Post not found");
            }

            var isDateFree = await _context.Reservations
                .Include(x => x.Post).ThenInclude(x => x.User)
                .AnyAsync(x => x.Post.PostId == postId && x.Post.User.UserId != userId
                && !(dto.FromDate <= x.ToDate && x.FromDate <= dto.ToDate));

            if (isDateFree)
            {
                throw new BadRequestException("Date is already occupied");
            }

            var reservation = new Reservation()
            {
                FromDate = dto.FromDate,
                ToDate = dto.ToDate,
                User = user,
            };

            await _context.Reservations.AddAsync(reservation);
            await _context.SaveChangesAsync();
        }

        public async Task ConfirmReservation(int reservationId)
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

            var reservation = await _context.Reservations
                .Include(x => x.Post).ThenInclude(x => x.User)
                .SingleOrDefaultAsync(x => x.ReservationId == reservationId
                && x.ReservationFlag != ReservationFlagEnum.Confirmed
                && x.Post.User.UserId == userId);

            if (reservation is null)
            {
                throw new NotFoundException("Reservation not found");
            }

            reservation.ReservationFlag = ReservationFlagEnum.Confirmed;
            _context.Update(reservation);
            await _context.SaveChangesAsync();
        }

        public async Task CancelReservation(int reservationId)
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

            var reservation = await _context.Reservations
                .Include(x => x.User)
                .Include(x => x.Post).ThenInclude(x => x.User)
                .SingleOrDefaultAsync(x => x.ReservationId == reservationId
                && x.ReservationFlag != ReservationFlagEnum.Canceled
                && (x.Post.User.UserId == userId || x.UserId == user.UserId));

            if (reservation is null)
            {
                throw new NotFoundException("Reservation not found");
            }

            reservation.ReservationFlag = ReservationFlagEnum.Canceled;
            _context.Update(reservation);
            await _context.SaveChangesAsync();
        }

        public async Task CompleteReservation(int reservationId)
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

            var reservation = await _context.Reservations
                .Include(x => x.Post)
                .SingleOrDefaultAsync(x => x.ReservationId == reservationId
                && x.ReservationFlag != ReservationFlagEnum.Completed
                && x.Post.User.UserId == userId);

            if (reservation is null)
            {
                throw new NotFoundException("Reservation not found");
            }

            reservation.ReservationFlag = ReservationFlagEnum.Completed;
            _context.Update(reservation);
            await _context.SaveChangesAsync();
        }
    }
}
