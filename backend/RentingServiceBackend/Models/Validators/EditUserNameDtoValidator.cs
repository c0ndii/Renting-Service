using FluentValidation;

namespace RentingServiceBackend.Models.Validators
{
    public class EditUserNameDtoValidator : AbstractValidator<EditUserNameDto>
    {
        public EditUserNameDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty();
        }
    }
}
