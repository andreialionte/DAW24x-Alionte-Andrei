using ExpenseTracker.Models;

namespace ExpenseTracker.Interfaces.Repository
{
    public interface IRecurringExpense
    {
        Task<IList<RecurringExpense>> GetRecurringExpenses();
        Task<RecurringExpense> GetRecurringExpense();
        Task<RecurringExpense> CreateRecurringExpense();
        Task<RecurringExpense> UpdateRecurringExpense();
        Task<RecurringExpense> DeleteRecurringExpense();
    }
}
