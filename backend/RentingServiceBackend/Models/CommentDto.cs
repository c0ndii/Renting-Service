
namespace RentingServiceBackend.Models
{
    public class CommentDto
    {
        public string CommentText { get; set; }
        public DateTime CommentTime { get; set; }
        public UserDto User { get; set; }

        public static implicit operator List<object>(CommentDto v)
        {
            throw new NotImplementedException();
        }
    }
}
