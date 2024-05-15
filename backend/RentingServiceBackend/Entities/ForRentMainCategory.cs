namespace RentingServiceBackend.Entities
{
    public class ForRentMainCategory : MainCategory
    {
        public virtual List<ForRentPost> ForRentPosts { get; set; } = new List<ForRentPost>();
    }
}
