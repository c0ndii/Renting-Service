using RentingServiceBackend.Entities;

namespace RentingServiceBackend.Models
{
    public class CreateReservationDto
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public ReservationFlagEnum ReservationFlag { get; set; } = ReservationFlagEnum.NotConfirmed;
    }
}
