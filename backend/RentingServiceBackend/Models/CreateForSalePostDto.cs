namespace RentingServiceBackend.Models
{
    public class CreateForSalePostDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string MainCategory { get; set; }
        public float Price { get; set; }
        public string Lat { get; set; }
        public string Lng { get; set; }
        public string BuildingNumber { get; set; }
        public string Street { get; set; }
        public string District { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
    }
}
