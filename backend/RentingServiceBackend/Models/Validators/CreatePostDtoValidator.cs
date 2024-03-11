using FluentValidation;

namespace RentingServiceBackend.Models.Validators
{
    public class CreatePostDtoValidator : AbstractValidator<CreatePostDto>
    {
        public CreatePostDtoValidator()
        {
            RuleFor(x => x.Title)
                .MinimumLength(8)
                .MaximumLength(50);
            RuleFor(x => x.Description)
                .MinimumLength(20)
                .MaximumLength(500);
            RuleFor(x => x.Image)
                .NotEmpty();
            RuleFor(x => x.Location)
                .NotEmpty();
            RuleFor(x => x.Features)
                .NotEmpty();
            RuleFor(x => x.Categories)
                .NotEmpty();
        }
    }
}
