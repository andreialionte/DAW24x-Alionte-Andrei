namespace ExpenseTracker.Dtos
{
    public class ExpenseDto
    {
        public Guid UserId { get; set; }
        public string Title { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public Guid CategoryId { get; set; }
        public string? Notes { get; set; }
        public Guid BudgetId { get; set; }

        // Remove navigation properties from DTO
    }
}