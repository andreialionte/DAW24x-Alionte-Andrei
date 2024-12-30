namespace ExpenseTracker.Models
{
    public class Budget : BaseEntity
    {
        public Guid UserId { get; set; }
        public User User { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal TotalAmount { get; set; }  // Budget limit
        public decimal SpentAmount { get; set; }  // Current spending
        public decimal RemainingAmount { get; set; }  // TotalAmount - SpentAmount
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime LastProcessedDate { get; set; }
        public DateTime NextProcessingDate { get; set; }
        public bool IsActive { get; set; } = true;
        public ICollection<Expense> Expenses { get; set; }  // Track expenses for this budget
    }
}
