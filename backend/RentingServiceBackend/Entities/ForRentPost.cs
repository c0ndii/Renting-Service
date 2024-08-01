namespace RentingServiceBackend.Entities
{
    public class ForRentPost : Post
    {
        public int SleepingPlaceCount { get; set; }
        public int MainCategoryId { get; set; }
        public virtual ForRentMainCategory MainCategory { get; set; }
        public virtual List<Reservation> Reservations { get; set; } = new List<Reservation>();
        public virtual List<Feature> Features { get; set; } = new List<Feature>();
        public virtual List<Comment> Comments { get; set; } = new List<Comment>();
        public double RateScore { get; set; } = 2.5;
        public int RateIterator { get; set; } = 1;
    }
}
