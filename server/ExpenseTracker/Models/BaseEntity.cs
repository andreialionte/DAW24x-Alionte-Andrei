namespace ExpenseTracker.Models
{
    public class BaseEntity
    {
        public Guid Id { get; set; }

        public BaseEntity()
        {
            Id = Guid.CreateVersion7();
        }
    }
}
