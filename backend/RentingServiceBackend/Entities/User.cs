﻿using Microsoft.Extensions.Hosting;

namespace RentingServiceBackend.Entities
{
    public class User
    {
        public int UserId { get; set; }
        public string Name {  get; set; }
        public string Email { get; set; }
        public string? Picture {  get; set; }
        public string PasswordHash { get; set; }
        public string? VerificationToken { get; set; }
        public string? PasswordResetToken { get; set; }
        public DateTime? ResetPasswordTimeExpires { get; set; }
        public string? RefreshToken {  get; set; }
        public DateTime RefreshTokenTimeExpires { get; set; }
        public virtual List<Post> OwnedPosts { get; set; } = new List<Post>();
        public virtual List<Post> FollowedPosts { get; set; } = new List<Post>();
        public virtual List<Reservation> Reservations { get; set; } = new List<Reservation>();
        public virtual List<Comment> Comments { get; set; } = new List<Comment>();
        public int RoleId { get; set; }
        public virtual Role Role { get; set; }
        public bool isDeleted { get; set; } = false;
    }
}
