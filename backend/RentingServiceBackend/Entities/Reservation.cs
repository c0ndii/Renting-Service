namespace RentingServiceBackend.Entities
{
    public enum ReservationFlagEnum
    {
        NotConfirmed,
        Confirmed,
        Canceled,
        Completed
    }
    public class Reservation
    {
        public int ReservationId {  get; set; }
        public int UserId {  get; set; }
        public virtual User User {  get; set; }
        public int PostId {  get; set; }
        public virtual Post Post {  get; set; }
        public DateTime FromDate {  get; set; }
        public DateTime ToDate { get; set; }
        public int ReservationFlag {  get; set; }
    }
}
