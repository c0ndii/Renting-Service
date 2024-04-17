using FluentValidation;

namespace RentingServiceBackend.Models.Validators
{
    public class EditUserDtoValidator : AbstractValidator<EditUserDto>
    {
        public EditUserDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotNull()
                .MaximumLength(20);
        }
    }
}
