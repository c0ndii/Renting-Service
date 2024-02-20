using FluentValidation;
using RentingServiceBackend.Entities;

namespace RentingServiceBackend.Models.Validators
{
    public class LoginUserDtoValidator : AbstractValidator<LoginUserDto>
    {
        public LoginUserDtoValidator()
        {
            RuleFor(x => x.Email)
                .EmailAddress()
                .NotEmpty();
            RuleFor(x => x.Password)
                .MinimumLength(8)
                .NotEmpty();
        }
    }
}
