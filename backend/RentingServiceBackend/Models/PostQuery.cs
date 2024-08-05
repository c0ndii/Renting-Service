namespace RentingServiceBackend.Models
{
    public enum SortDirection
    {
        ASC,
        DESC,
    }
    public class PostQuery
    {
        public string? SearchPhrase { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public string? SortBy { get; set; }
        public SortDirection? SortDirection { get; set; }
        //public string? DateFilter { get; set; }
        public string PostType { get; set; }
        public string? District { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public List<string>? FeatureFilters { get; set; }
    }
}
