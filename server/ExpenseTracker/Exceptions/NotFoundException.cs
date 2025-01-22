namespace ExpenseTracker.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string message = "The requested source was not found.")
            : base(message)
        {
        }

        public NotFoundException(object source, Guid id)
            : base($"The {source} with ID {id} was not found.")
        {
        }
    }
}
