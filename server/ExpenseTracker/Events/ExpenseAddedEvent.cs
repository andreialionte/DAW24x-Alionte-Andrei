namespace ExpenseTracker.Events
{
    public class ExpenseAddedEvent
    {
        public Guid ExpenseId { get; set; }
        public Guid UserId { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public Guid BudgetId { get; set; }
        public Guid CategoryId { get; set; }
    }
}
