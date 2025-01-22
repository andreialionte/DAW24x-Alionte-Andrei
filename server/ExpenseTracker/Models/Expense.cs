namespace ExpenseTracker.Models
{
    public class Expense : BaseEntity
    {
        public Guid UserId { get; set; } //fk
        public User? User { get; set; } //navigation proepty One
        public string? Title { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public Guid CategoryId { get; set; }
        public Category? Category { get; set; }
        public string? Notes { get; set; }
        //public string? AttachmentUrl { get; set; }
        public Guid BudgetId { get; set; }
        public Budget? Budget { get; set; }
    }
}
