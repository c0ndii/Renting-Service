using RentingServiceBackend.Entities;

namespace RentingServiceBackend.Models
{
    public class ReservationDto
    {
        public int ReservationId { get; set; }
        public int UserId { get; set; }
        public int PostId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public ReservationFlagEnum ReservationFlag { get; set; }
        public PostDto Post { get; set; }
        public double Price {  get; set; }
    }
}
