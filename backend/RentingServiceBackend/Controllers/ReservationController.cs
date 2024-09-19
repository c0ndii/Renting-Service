using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RentingServiceBackend.Models;
using RentingServiceBackend.Services;

namespace RentingServiceBackend.Controllers
{
    [Route("/api/reservation")]
    [Authorize(Roles = "Admin,User")]
    [ApiController]
    public class ReservationController : ControllerBase
    {
        private readonly IReservationService _reservationService;

        public ReservationController(IReservationService reservationService)
        {
            _reservationService = reservationService;
        }

        [HttpPost("{postId}")]
        public async Task<IActionResult> AddReservation(int postId, CreateReservationDto dto)
        {
            await _reservationService.AddNewReservation(postId, dto);
            return Created();
        }

        [HttpGet("post/{postId}")]
        public async Task<IActionResult> GetPostReservations(int postId)
        {
            var result = await _reservationService.GetAllReservationsByPostId(postId);
            return Ok(result);
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserReservations()
        {
            var result = await _reservationService.GetAllUserReservations();
            return Ok(result);
        }

        [HttpPut("confirm/{reservationId}")]
        public async Task<IActionResult> ConfirmReservation(int reservationId)
        {
            await _reservationService.ConfirmReservation(reservationId);
            return Ok();
        }

        [HttpPut("cancel/{reservationId}")]
        public async Task<IActionResult> CancelReservation(int reservationId)
        {
            await _reservationService.CancelReservation(reservationId);
            return Ok();
        }

        [HttpPut("complete/{reservationId}")]
        public async Task<IActionResult> CompleteReservation(int reservationId)
        {
            await _reservationService.CompleteReservation(reservationId);
            return Ok();
        }
    }
}
