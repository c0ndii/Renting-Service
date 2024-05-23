using FluentValidation;

namespace RentingServiceBackend.Models.Validators
{
    public class EditUserPictureDtoValidator : AbstractValidator<EditUserPictureDto>
    {
        public EditUserPictureDtoValidator()
        {
            RuleFor(x => x.Picture)
                .NotEmpty();
        }
    }
}
