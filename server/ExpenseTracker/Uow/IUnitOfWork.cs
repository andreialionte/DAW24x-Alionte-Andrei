using ExpenseTracker.Interfaces.Repository;

namespace ExpenseTracker.Uow;

public interface IUnitOfWork : IDisposable
{
    IAuthRepository authRepository { get; }
    IBudgetRepository budgetRepository { get; }
    ICategoryRepository categoryRepository { get; }
    IExpenseRepository expenseRepository { get; }
    IRecurringExpense recurringExpense { get; }
    IUserRepository userRepository { get; }

    Task Commit();
}