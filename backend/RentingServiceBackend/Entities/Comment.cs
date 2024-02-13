namespace RentingServiceBackend.Entities
{
    public class Comment
    {
        public int CommentId {  get; set; }
        public string CommentText { get; set; }
        public DateTime CommentTime {  get; set; }
        public int UserId {  get; set; }
        public virtual User User {  get; set; }
        public int PostId {  get; set; }
        public virtual Post Post { get; set; }
    }
}
