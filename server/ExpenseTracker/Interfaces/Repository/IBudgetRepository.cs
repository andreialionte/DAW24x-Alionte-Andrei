using ExpenseTracker.Dtos;
using ExpenseTracker.Models;

namespace ExpenseTracker.Interfaces.Repository
{
    public interface IBudgetRepository
    {
        Task<Budget> GetBudgetByUser(Guid budgetId);
        Task<IReadOnlyList<Budget>> GetBudgetsByUser(Guid userId);
        Task<Budget> CreateBudget(BudgetDto budgetDto);
        Task<Budget> UpdateBudget(Guid Id, BudgetDto budgetDto);
        Task<Budget> DeleteBudget(Guid Id);
    }
}
