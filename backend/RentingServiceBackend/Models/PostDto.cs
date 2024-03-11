using RentingServiceBackend.Entities;

namespace RentingServiceBackend.Models
{
    public class PostDto
    {
        public int PostId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string Location { get; set; }
        public DateTime AddDate { get; set; }
        public int FollowCount { get; set; }
        public List<string> Features { get; set; }
        public List<string> Categories { get; set; }
        public List<CommentDto> Comments { get; set; }
        public int Rate { get; set; }
        public UserDto User { get; set; }
    }
}
