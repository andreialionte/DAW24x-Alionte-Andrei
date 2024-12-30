namespace ExpenseTracker.Models
{
    public class Expense : BaseEntity
    {
        public Guid UserId { get; set; }
        public User User { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public Guid CategoryId { get; set; }
        public Category Category { get; set; }
        public string? Notes { get; set; }
        public string? AttachmentUrl { get; set; }
    }
}
