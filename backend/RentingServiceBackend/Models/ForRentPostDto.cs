namespace RentingServiceBackend.Models
{
    public class ForRentPostDto
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string MainCategory { get; set; }
        public int SleepingPlaceCount { get; set; }
        public float Price { get; set; }
        public float SquareFootage { get; set; }
        public string PicturesPath {  get; set; }
        public List<string> Pictures { get; set; } = new List<string>();
        public string Lat { get; set; }
        public string Lng { get; set; }
        public string BuildingNumber { get; set; }
        public string Street { get; set; }
        public string District { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public bool Confirmed { get; set; }
        public DateTime AddDate { get; set; }
        public int FollowCount { get; set; }
        public List<string> Features { get; set; }
        public List<string> Categories { get; set; }
        public List<CommentDto> Comments { get; set; }
        public double Rate { get; set; }
        public UserDto User { get; set; }
    }
}
