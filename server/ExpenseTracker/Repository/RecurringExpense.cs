using ExpenseTracker.DataLayer;
using ExpenseTracker.Interfaces.Repository;

namespace ExpenseTracker.Repository
{
    public class RecurringExpense : IRecurringExpense
    {
        private readonly DataContext _context;
        public RecurringExpense(DataContext context)
        {
            _context = context;
        }

        public Task<Models.RecurringExpense> CreateRecurringExpense()
        {
            throw new NotImplementedException();
        }

        public Task<Models.RecurringExpense> DeleteRecurringExpense()
        {
            throw new NotImplementedException();
        }

        public Task<Models.RecurringExpense> GetRecurringExpense()
        {
            throw new NotImplementedException();
        }

        public Task<IList<Models.RecurringExpense>> GetRecurringExpenses()
        {
            throw new NotImplementedException();
        }

        public Task<Models.RecurringExpense> UpdateRecurringExpense()
        {
            throw new NotImplementedException();
        }
    }
}
