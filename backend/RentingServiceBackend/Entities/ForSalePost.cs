namespace RentingServiceBackend.Entities
{
    public class ForSalePost : Post
    {
        public int MainCategoryId { get; set; }
        public virtual ForSaleMainCategory MainCategory { get; set; }
    }
}
