namespace RentingServiceBackend.Entities
{
    public class Post
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public float Price { get; set; }
        public float SquareFootage { get; set; }
        public string PicturesPath { get; set; }
        public string Lat { get; set; }
        public string Lng {  get; set; }
        public string BuildingNumber {  get; set; }
        public string Street {  get; set; }
        public string District {  get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public DateTime AddDate { get; set; }
        public bool Confirmed { get; set; } = false;
        public virtual List<User> FollowedBy { get; set; } = new List<User>();
        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}
