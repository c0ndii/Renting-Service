using FluentValidation;

namespace RentingServiceBackend.Models.Validators
{
    public class EditPostPicturesDtoValidator : AbstractValidator<EditPostPicturesDto>
    {
        public EditPostPicturesDtoValidator()
        {
            RuleFor(x => x.Pictures)
                .NotEmpty()
                .Must(x => x.Count <= 6 && x.Count > 0);
        }
    }
}
