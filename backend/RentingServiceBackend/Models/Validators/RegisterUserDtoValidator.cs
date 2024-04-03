using FluentValidation;
using RentingServiceBackend.Entities;
using RentingServiceBackend.Exceptions;

namespace RentingServiceBackend.Models.Validators
{
    public class RegisterUserDtoValidator : AbstractValidator<RegisterUserDto>
    {
        public RegisterUserDtoValidator(AppDbContext dbContext)
        {
            RuleFor(x => x.Email)
                .EmailAddress()
                .NotEmpty();
            RuleFor(x => x.Email)
                .Custom((value, context) =>
                {
                    var usedEmail = dbContext.Users.Any(x => x.Email == value);
                    if (usedEmail)
                    {
                        context.AddFailure("Email", "This email is already taken");
                        throw new ConflictException("This email is already taken");
                    }
                });

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(8);

            RuleFor(x => x.ConfirmPassword)
                .Equal(y => y.Password);
        }
    }
}
