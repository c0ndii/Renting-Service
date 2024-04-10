using FluentValidation;

namespace RentingServiceBackend.Models.Validators
{
    public class RefreshTokenDtoValidator : AbstractValidator<RefreshTokenDto>
    {
        public RefreshTokenDtoValidator()
        {
            RuleFor(x => x.AccessToken)
                .NotNull();
            RuleFor(x => x.RefreshToken)
                .NotNull();
        }
    }
}
