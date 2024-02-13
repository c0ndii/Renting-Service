namespace RentingServiceBackend.Entities
{
    public class Feature
    {
        public int FeatureId { get; set; }
        public string FeatureName { get; set; }
        public virtual List<Post> Posts { get; set; }
    }
}
