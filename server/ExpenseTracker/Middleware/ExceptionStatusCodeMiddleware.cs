using ExpenseTracker.Exceptions;
using System.Net;

namespace ExpenseTracker.Middleware
{
    public class ExceptionStatusCodeMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionStatusCodeMiddleware> _logger;

        public ExceptionStatusCodeMiddleware(RequestDelegate next, ILogger<ExceptionStatusCodeMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (NotFoundException ex)
            {
                await HandleException(context, HttpStatusCode.NotFound, ex.Message, ex);
            }
            catch (BadRequestException ex)
            {
                await HandleException(context, HttpStatusCode.BadRequest, ex.Message, ex);
            }
            catch (FoundException ex)
            {
                await HandleException(context, HttpStatusCode.Conflict, ex.Message, ex);
            }
            //catch (Exception ex)
            //{
            //    // Log unexpected errors
            //    _logger.LogError(ex, "Internal Server Error");
            //    await HandleException(context, HttpStatusCode.InternalServerError, "An unexpected error occurred.", ex);
            //}
        }

        private async Task HandleException(HttpContext context, HttpStatusCode statusCode, string message, Exception ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var errorDetails = new
            {
                status = statusCode.ToString(),
                message = message,
                errorCode = (int)statusCode,
                timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"),
                //StackTrace = ex.StackTrace,          
                //InnerException = ex.InnerException?.Message,
            };

            await context.Response.WriteAsJsonAsync(errorDetails);
        }
    }
}
