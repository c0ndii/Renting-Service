namespace RentingServiceBackend.Models
{
    public class CreateForSalePostDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string MainCategory { get; set; }
        public float Price { get; set; }
        //public string Image { get; set; }
        public string Lat { get; set; }
        public string Lng { get; set; }
    }
}
