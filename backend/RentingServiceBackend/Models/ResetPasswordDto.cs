﻿namespace RentingServiceBackend.Models
{
    public class ResetPasswordDto
    {
        public string ResetToken {  get; set; }
        public string Password { get; set; }
        public string PasswordConfirm { get; set; }
    }
}
