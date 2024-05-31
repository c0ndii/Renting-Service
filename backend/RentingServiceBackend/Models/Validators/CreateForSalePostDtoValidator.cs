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
            RuleFor(x => x.Lat)
                .NotEmpty();
            RuleFor(x => x.Lng)
                .NotEmpty();
            RuleFor(x => x.BuildingNumber)
                .NotEmpty();
            RuleFor(x => x.Street)
                .NotEmpty();
            RuleFor(x => x.District)
                .NotEmpty();
            RuleFor(x => x.City)
                .NotEmpty();
            RuleFor(x => x.Country)
                .NotEmpty();
        }
    }
}
