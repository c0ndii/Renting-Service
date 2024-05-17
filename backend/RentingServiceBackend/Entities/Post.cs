namespace RentingServiceBackend.Entities
{
    public class Post
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public float Price { get; set; }
        public string Image { get; set; }
        public string Lat { get; set; }
        public string Lng {  get; set; }
        public DateTime AddDate { get; set; }
        public bool Confirmed { get; set; } = false;
        public virtual List<User> FollowedBy { get; set; } = new List<User>();
        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}
