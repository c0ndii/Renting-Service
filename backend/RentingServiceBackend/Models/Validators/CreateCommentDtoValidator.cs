using FluentValidation;

namespace RentingServiceBackend.Models.Validators
{
    public class CreateCommentDtoValidator : AbstractValidator<CreateCommentDto>
    {
        public CreateCommentDtoValidator()
        {
            RuleFor(x => x.CommentText)
                .NotEmpty();
        }
    }
}
