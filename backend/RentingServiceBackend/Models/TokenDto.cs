namespace RentingServiceBackend.Models
{
    public class TokenDto
    {
        public required string JwtToken { get; set; }
        public DateTime Expiration {  get; set; }
        public required string RefreshToken { get; set; }
    }
}
