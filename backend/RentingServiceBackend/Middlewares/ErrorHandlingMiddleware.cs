using RentingServiceBackend.Exceptions;

namespace RentingServiceBackend.Middlewares
{
    public class ErrorHandlingMiddleware : IMiddleware
    {
        private readonly ILogger<ErrorHandlingMiddleware> _logger;
        public ErrorHandlingMiddleware(ILogger<ErrorHandlingMiddleware> logger)
        {
            _logger = logger;
        }
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next.Invoke(context);
            }
            catch (BadRequestException badRequest)
            {
                context.Response.StatusCode = 400;
                await context.Response.WriteAsync(badRequest.Message);
            }
            catch (NotFoundException notFoundException)
            {
                context.Response.StatusCode = 404;
                await context.Response.WriteAsync(notFoundException.Message);
            }
            catch(ConflictException conflictException)
            {
                context.Response.StatusCode = 409;
                await context.Response.WriteAsync(conflictException.Message);
            }
            catch(UnauthorizedException unauthorizedException)
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync(unauthorizedException.Message);
            }
            catch(ForbidException forbidException)
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync(forbidException.Message);
            }
            catch (UnprocessableEntityException unprocessableEntityException)
            {
                context.Response.StatusCode = 422;
                await context.Response.WriteAsync(unprocessableEntityException.Message);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);

                context.Response.StatusCode = 500;
                await context.Response.WriteAsync("Something went wrong");
            }
        }
    }
}
