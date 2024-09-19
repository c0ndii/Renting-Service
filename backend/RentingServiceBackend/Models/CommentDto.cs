
namespace RentingServiceBackend.Models
{
    public class CommentDto
    {
        public int CommentId { get; set; }
        public string CommentText { get; set; }
        public DateTime CommentTime { get; set; }
        public UserDto User { get; set; }
        public ForRentPostDto ForRentPost { get; set; }
    }
}
