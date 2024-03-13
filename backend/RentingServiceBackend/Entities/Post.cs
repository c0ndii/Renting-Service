namespace RentingServiceBackend.Entities
{
    public class Post
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string Location { get; set; }
        public DateTime AddDate { get; set; }
        public bool Confirmed { get; set; } = false;
        public virtual List<User> FollowedBy { get; set; }
        public virtual List<Reservation> Reservations { get; set; }
        public virtual List<Feature> Features {  get; set; }
        public virtual List<Category> Categories {  get; set; }
        public virtual List<Comment> Comments {  get; set; }
        public double RateScore { get; set; } = 2.5;
        public int RateIterator { get; set; } = 1;
        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}
