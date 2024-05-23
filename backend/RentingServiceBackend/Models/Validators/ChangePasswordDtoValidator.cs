using FluentValidation;

namespace RentingServiceBackend.Models.Validators
{
    public class ChangePasswordDtoValidator : AbstractValidator<ChangePasswordDto>
    {
        public ChangePasswordDtoValidator()
        {
            RuleFor(x => x.OldPassword)
                .NotNull();
            RuleFor(x => x.NewPassword)
                .MinimumLength(8)
                .NotNull();
            RuleFor(x => x.ConfirmNewPassword)
                .Equal(x => x.NewPassword);
        }
    }
}
