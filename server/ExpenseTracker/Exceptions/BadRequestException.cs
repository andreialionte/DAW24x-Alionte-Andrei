namespace ExpenseTracker.Exceptions;

public class BadRequestException : Exception
{
    public BadRequestException(string message = "The request was invalid or malformed.")
        : base(message)
    {
    }

    public BadRequestException(object resource, string reason)
        : base($"The request for {resource} failed due to: {reason}.")
    {
    }
}
