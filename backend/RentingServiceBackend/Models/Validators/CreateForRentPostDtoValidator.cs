using FluentValidation;

namespace RentingServiceBackend.Models.Validators
{
    public class CreateForRentPostDtoValidator : AbstractValidator<CreateForRentPostDto>
    {
        public CreateForRentPostDtoValidator()
        {
            RuleFor(x => x.Title)
                .MinimumLength(8)
                .MaximumLength(50);
            RuleFor(x => x.MainCategory)
                .NotEmpty();
            RuleFor(x => x.SleepingPlaceCount)
                .NotEmpty();
            RuleFor(x => x.Description)
                .MinimumLength(20)
                .MaximumLength(500);
            RuleFor(x => x.Image)
                .NotEmpty();
            RuleFor(x => x.Lat)
                .NotEmpty();
            RuleFor(x => x.Lng)
                .NotEmpty();
            RuleFor(x => x.Features)
                .NotEmpty();
            RuleFor(x => x.Categories)
                .NotEmpty();
        }
    }
}
