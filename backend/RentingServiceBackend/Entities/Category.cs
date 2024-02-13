namespace RentingServiceBackend.Entities
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public virtual List<Post> Posts {  get; set; }
    }
}
