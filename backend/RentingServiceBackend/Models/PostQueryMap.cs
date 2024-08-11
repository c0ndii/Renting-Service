namespace RentingServiceBackend.Models
{
    public class PostQueryMap
    {
        public string? SearchPhrase { get; set; }
        public string PostType { get; set; }
        public double? MinPrice { get; set; }
        public double? MaxPrice { get; set; }
        public double? MinSquare { get; set; }
        public double? MaxSquare { get; set; }
        public int? MinSleepingCount { get; set; }
        public int? MaxSleepingCount { get; set; }
        public string? MainCategory { get; set; }
        public List<string>? FeatureFilters { get; set; }
        public string NorthEastLat { get; set; }
        public string NorthEastLng { get; set; }
        public string SouthWestLat { get; set; }
        public string SouthWestLng { get; set; }
    }
}
