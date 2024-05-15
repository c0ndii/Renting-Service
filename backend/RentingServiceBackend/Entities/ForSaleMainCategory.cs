namespace RentingServiceBackend.Entities
{
    public class ForSaleMainCategory : MainCategory
    {
        public virtual List<ForSalePost> ForSalePosts { get; set; } = new List<ForSalePost>();
    }
}
