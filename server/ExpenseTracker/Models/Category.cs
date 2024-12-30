namespace ExpenseTracker.Models
{
    public class Category : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<Expense> Expenses { get; set; }
        public ICollection<RecurringExpense> RecurringExpenses { get; set; }
    }
}
