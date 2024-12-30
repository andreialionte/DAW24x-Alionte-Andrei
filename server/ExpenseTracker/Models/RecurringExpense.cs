using ExpenseTracker.Enums;

namespace ExpenseTracker.Models
{
    //for subscription as exmeple monthly subscriptions to use this to make the logic
    public class RecurringExpense : BaseEntity
    {
        public Guid UserId { get; set; }
        public User User { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public Period Frequency { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Guid CategoryId { get; set; }
        public Category Category { get; set; }
        public DateTime LastProcessedDate { get; set; }
        public DateTime NextProcessingDate { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
