using FluentValidation;

namespace RentingServiceBackend.Models.Validators
{
    public class CreateReservationDtoValidator : AbstractValidator<CreateReservationDto>
    {
        public CreateReservationDtoValidator()
        {
            RuleFor(x => x.FromDate)
                .NotEmpty()
                .GreaterThanOrEqualTo(DateTime.Now);
            RuleFor(x => x.ToDate)
                .NotEmpty()
                .GreaterThan(x => x.FromDate);
        }
    }
}
