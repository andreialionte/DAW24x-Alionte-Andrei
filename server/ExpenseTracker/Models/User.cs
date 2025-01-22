namespace ExpenseTracker.Models
{
    public class User : BaseEntity
    {
        //public string Username { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        //public string PasswordHash { get; set; }
        //public string Salt { get; set; }
        public ICollection<Expense> Expenses { get; set; } //MANY
        public ICollection<Category> Categories { get; set; }
        public ICollection<RecurringExpense> RecurringExpenses { get; set; }
        public ICollection<Budget> Budgets { get; set; }
    }
}
