using ExpenseTracker.DataLayer;
using ExpenseTracker.Dtos;
using ExpenseTracker.Exceptions;
using ExpenseTracker.Interfaces.Repository;
using ExpenseTracker.Interfaces.Service;
using ExpenseTracker.Mapper;
using ExpenseTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Repository
{
    public class ExpenseRepository : IExpenseRepository
    {
        private readonly DataContext _context;
        private readonly ICacheService _cacheService;
        public ExpenseRepository(DataContext context, ICacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
        }

        public async Task<Expense> CreateExpense(ExpenseDto expenseDto, Guid userId)
        {
            // Verifică dacă utilizatorul există
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new NotFoundException("The user was not found!");
            }

            // Mapează DTO-ul în entitate
            var fromExpenseDtoToExpense = Mapper.ConfigMapper.Mapper.Map<Expense>(expenseDto);
            fromExpenseDtoToExpense.UserId = userId; // Setează UserId pentru cheltuială

            // Verifică bugetul asociat
            var budget = await _context.Budgets
                .FirstOrDefaultAsync(b => b.Id == expenseDto.BudgetId && b.UserId == userId);
            if (budget == null)
            {
                throw new NotFoundException("The budget for the user was not found!");
            }

            // Adaugă cheltuiala în baza de date
            await _context.Expenses.AddAsync(fromExpenseDtoToExpense);

            // Actualizează sumele din buget
            budget.SpentAmount += expenseDto.Amount;
            budget.RemainingAmount = budget.TotalAmount - budget.SpentAmount;

            _context.Budgets.Update(budget);

            // Setează în cache cheltuiala și bugetul
            await _cacheService.SetCacheValue($"Expense:{fromExpenseDtoToExpense.Id}", fromExpenseDtoToExpense);
            await _cacheService.SetCacheValue($"Budget:{budget.Id}", budget);

            // Returnează cheltuiala creată
            return fromExpenseDtoToExpense;
        }


        public async Task<Expense> DeleteExpense(Guid Id)
        {
            var deleteExpense = await _context.Expenses.FirstOrDefaultAsync(k => k.Id == Id);
            if (deleteExpense == null)
            {
                throw new NotFoundException("The expense was not found! The expense does not exist");
            }

            var budget = await _context.Budgets.FirstOrDefaultAsync(k => k.Id == deleteExpense.BudgetId);
            if (budget == null)
            {
                throw new NotFoundException("Budget does not exist");
            }

            _context.Expenses.Remove(deleteExpense);

            budget.SpentAmount = budget.SpentAmount - deleteExpense.Amount;
            budget.RemainingAmount = budget.TotalAmount - budget.SpentAmount;

            _context.Budgets.Update(budget);
            //await _context.SaveChangesAsync();

            await _cacheService.SetCacheValue<Expense>($"Expense:{Id}", null);
            await _cacheService.SetCacheValue<Budget>($"Budget:{budget.Id}", null);

            return deleteExpense;
        }

        public async Task<Expense> GetExpenseByUser(Guid Id, Guid Userid)
        {
            var cacheKey = $"Expense:{Id}";
            var cachedExpense = await _cacheService.GetCacheValue<Expense>(cacheKey);

            if (cachedExpense != null)
            {
                return cachedExpense;
            }

            var expense = await _context.Expenses.AsNoTracking().FirstOrDefaultAsync(k => k.Id == Id && k.UserId == Userid);
            if (expense == null)
            {
                throw new NotFoundException("The expense was not found!");
            }

            // Cache the fetched expense
            await _cacheService.SetCacheValue(cacheKey, expense);

            return expense;
        }

        public async Task<IReadOnlyList<Expense>> GetExpensesByCategory(Guid userId)
        {
            var cacheKey = $"ExpensesByCategory:{userId}";

            // Try to get from cache first
            var cachedExpenses = await _cacheService.GetCacheValue<IReadOnlyList<Expense>>(cacheKey);
            if (cachedExpenses != null)
            {
                return cachedExpenses;
            }

            // If not in cache, fetch from database
            var expenses = await _context.Expenses
                .AsNoTracking()
                .Where(e => e.UserId == userId)
                .Include(k => k.Category)
                .OrderBy(e => e.Category)  // Added ordering for consistency
                .ThenBy(e => e.Date)      // Secondary ordering by date
                .ToListAsync();

            // Cache the results
            await _cacheService.SetCacheValue(cacheKey, expenses);

            return expenses;
        }




        public async Task<IReadOnlyList<Expense>> GetExpensesByUser(Guid UserId)
        {
            var cacheKey = $"ExpensesByUser:{UserId}";
            var cachedExpenses = await _cacheService.GetCacheValue<IReadOnlyList<Expense>>(cacheKey);

            if (cachedExpenses != null)
            {
                return cachedExpenses;
            }

            var expenses = await _context.Expenses.AsNoTracking().Where(k => k.UserId == UserId).ToListAsync();
            if (expenses == null || !expenses.Any())
            {
                throw new NotFoundException("No expenses found for the specified user.");
            }

            await _cacheService.SetCacheValue(cacheKey, expenses);

            return expenses;
        }

        public async Task<IReadOnlyList<Expense>> GetExpensesFromMonths(Guid userId)
        {
            var cacheKey = $"ExpensesFromMonths:{userId}";
            var expenses = await _context.Expenses
                .AsNoTracking()
                .Where(e => e.UserId == userId)
                .OrderBy(e => e.Date.Month)
                .ThenBy(e => e.Date.Year)
                .ToListAsync();
            await _cacheService.SetCacheValue(cacheKey, expenses);
            return expenses.AsReadOnly();
        }


        public async Task<IReadOnlyList<Expense>> GetLastFiveExpenses(Guid UserId)
        {
            var cacheKey = $"LastFiveExpenses:{UserId}";
            var getLastFiveExpenses = await _context.Expenses
                .AsNoTracking()
                .Where(u => u.UserId == UserId)
                .OrderByDescending(o => o.Id)
                .Take(5)
                .ToListAsync();

            if (getLastFiveExpenses == null)
            {
                throw new NotFoundException();
            }
            // Cache the result regardless of how many items were returned
            await _cacheService.SetCacheValue(cacheKey, getLastFiveExpenses);

            // Return the list - it will contain 0 to 5 items
            return getLastFiveExpenses;
        }

        public async Task<Expense> UpdateExpense(Guid Id, ExpenseDto expenseDto)
        {
            var expense = await _context.Expenses.FirstOrDefaultAsync(k => k.Id == Id);
            if (expense == null)
            {
                throw new NotFoundException("The expense does not exist! Add an existing expense");
            }

            var budget = await _context.Budgets.FirstOrDefaultAsync(k => k.Id == expense.BudgetId);
            if (budget == null)
            {
                throw new NotFoundException("Budget not found");
            }

            decimal calDiferentaNoauSumaSiVeche = expenseDto.Amount - expense.Amount;

            var updatedExpense = ConfigMapper.Mapper.Map<Expense>(expenseDto);
            _context.Expenses.Update(updatedExpense);


            budget.SpentAmount = budget.SpentAmount + calDiferentaNoauSumaSiVeche;

            budget.RemainingAmount = budget.TotalAmount - budget.SpentAmount;

            _context.Budgets.Update(budget);

            //await _context.SaveChangesAsync();

            await _cacheService.SetCacheValue($"Expense:{updatedExpense.Id}", updatedExpense);
            await _cacheService.SetCacheValue($"Budget:{budget.Id}", budget);

            return updatedExpense;
        }
    }
}
