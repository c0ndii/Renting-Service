using FluentValidation;

namespace RentingServiceBackend.Models.Validators
{
    public class CreateForSalePostDtoValidator : AbstractValidator<CreateForSalePostDto>
    {
        public CreateForSalePostDtoValidator()
        {
            RuleFor(x => x.Title)
                .MinimumLength(8)
                .MaximumLength(50);
            RuleFor(x => x.MainCategory)
                .NotEmpty();
            RuleFor(x => x.Description)
                .MinimumLength(20)
                .MaximumLength(500);
            RuleFor(x => x.Image)
                .NotEmpty();
            RuleFor(x => x.Location)
                .NotEmpty();
        }
    }
}
