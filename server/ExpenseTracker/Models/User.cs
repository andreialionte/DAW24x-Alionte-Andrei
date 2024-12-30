namespace ExpenseTracker.Models
{
    public class User : BaseEntity
    {
        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Salt { get; set; }
        public ICollection<Expense> Expenses { get; set; }
        public ICollection<RecurringExpense> RecurringExpenses { get; set; }
        public ICollection<Budget> Budgets { get; set; }
    }
}
