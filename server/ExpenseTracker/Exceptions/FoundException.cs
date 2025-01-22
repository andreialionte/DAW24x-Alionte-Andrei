namespace ExpenseTracker.Exceptions
{
    public class FoundException : Exception
    {
        public FoundException(string message = "The requested source already exist.")
    : base(message)
        {
        }

        public FoundException(string source, int id)
         : base($"The {source} with ID {id} already exist.")
        {
        }
    }
}
