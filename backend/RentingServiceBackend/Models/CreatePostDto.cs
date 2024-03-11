using RentingServiceBackend.Entities;

namespace RentingServiceBackend.Models
{
    public class CreatePostDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string Location { get; set; }
        public virtual List<string> Features { get; set; }
        public virtual List<string> Categories { get; set; }
    }
}
