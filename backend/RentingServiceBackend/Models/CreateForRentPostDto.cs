using RentingServiceBackend.Entities;

namespace RentingServiceBackend.Models
{
    public class CreateForRentPostDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string MainCategory { get; set; }
        public int SleepingPlaceCount { get; set; }
        public float Price { get; set; }
        public string Image { get; set; }
        public string Lat { get; set; }
        public string Lng { get; set; }
        public virtual List<string> Features { get; set; }
        public virtual List<string> Categories { get; set; }
    }
}
