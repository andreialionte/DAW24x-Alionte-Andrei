using ExpenseTracker.Dtos;
using ExpenseTracker.Models;

namespace ExpenseTracker.Interfaces.Repository
{
    public interface IExpenseRepository
    {
        Task<IReadOnlyList<Expense>> GetExpensesByUser(Guid UserId);
        Task<Expense> GetExpenseByUser(Guid Id, Guid Userid);
        Task<Expense> CreateExpense(ExpenseDto expenseDto, Guid userId);
        Task<Expense> UpdateExpense(Guid Id, ExpenseDto expenseDto);
        Task<Expense> DeleteExpense(Guid Id);
        Task<IReadOnlyList<Expense>> GetExpensesByCategory(Guid UserId);
        Task<IReadOnlyList<Expense>> GetLastFiveExpenses(Guid UserId);
        //Task<IReadOnlyList<Expense>> GetExpensesFromDays(Guid UserId);
        //Task<IReadOnlyList<Expense>> GetExpensesFromWeeks(Guid UserId);
        Task<IReadOnlyList<Expense>> GetExpensesFromMonths(Guid UserId);
    }
}
