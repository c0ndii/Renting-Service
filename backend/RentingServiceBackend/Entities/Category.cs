namespace RentingServiceBackend.Entities
{
    public class Category
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public virtual List<ForRentPost> Posts {  get; set; } = new List<ForRentPost>();
    }
}
