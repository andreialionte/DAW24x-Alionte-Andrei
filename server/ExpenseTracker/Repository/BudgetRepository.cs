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
    public class BudgetRepository : IBudgetRepository
    {
        private readonly DataContext _context;
        private readonly ICacheService _cacheService;
        public BudgetRepository(DataContext context, ICacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
        }

        public async Task<Budget> CreateBudget(BudgetDto budgetDto)
        {
            var budget = await _context.Budgets.FirstOrDefaultAsync(k => k.Name == budgetDto.Name
                && k.UserId == budgetDto.UserId);

            if (budget != null)
            {
                throw new FoundException(); //409 error code 
            }

            var fromDtoToBudget = ConfigMapper.Mapper.Map<Budget>(budgetDto);

            fromDtoToBudget.EndDate = fromDtoToBudget.StartDate.AddMonths(1);

            fromDtoToBudget.SpentAmount = 0;
            fromDtoToBudget.RemainingAmount = fromDtoToBudget.TotalAmount;

            // Setează data de procesare următoare
            fromDtoToBudget.NextProcessingDate = fromDtoToBudget.EndDate.AddDays(1);

            await _context.Budgets.AddAsync(fromDtoToBudget);
            //await _context.SaveChangesAsync();

            var cacheKey = $"Budget:{fromDtoToBudget.Id}:{fromDtoToBudget.UserId}";
            await _cacheService.SetCacheValue(cacheKey, fromDtoToBudget);

            return fromDtoToBudget;
        }


        public async Task<Budget> DeleteBudget(Guid Id)
        {
            var budget = await _context.Budgets.FirstOrDefaultAsync(k => k.Id == Id);
            if (budget == null)
            {
                throw new NotFoundException();
            }
            _context.Budgets.Remove(budget);

            var cacheKey = $"Budget:{budget.Id}:{budget.UserId}";
            await _cacheService.SetCacheValue<Budget>(cacheKey, null);

            return budget;
        }

        public async Task<Budget> GetBudgetByUser(Guid budgetId)
        {
            var cacheKey = $"Budget:{budgetId}";
            var cachedBudget = await _cacheService.GetCacheValue<Budget>(cacheKey);

            if (cachedBudget != null)
            {
                // Check if the budget needs to be refreshed
                if (cachedBudget.EndDate < DateTime.UtcNow && cachedBudget.NextProcessingDate <= DateTime.UtcNow)
                {
                    cachedBudget.SpentAmount = 0;
                    cachedBudget.RemainingAmount = cachedBudget.TotalAmount;
                    cachedBudget.LastProcessedDate = DateTime.UtcNow;
                    cachedBudget.NextProcessingDate = cachedBudget.EndDate.AddDays(1);

                    _context.Update(cachedBudget);
                    //await _context.SaveChangesAsync();

                    await _cacheService.SetCacheValue(cacheKey, cachedBudget);
                }

                return cachedBudget;
            }

            var budget = await _context.Budgets.AsNoTracking().FirstOrDefaultAsync(k => k.Id == budgetId);
            if (budget == null)
            {
                throw new NotFoundException();
            }

            // Check if the budget needs to be refreshed
            if (budget.EndDate < DateTime.UtcNow && budget.NextProcessingDate <= DateTime.UtcNow)
            {
                budget.SpentAmount = 0;
                budget.RemainingAmount = budget.TotalAmount;
                budget.LastProcessedDate = DateTime.UtcNow;
                budget.NextProcessingDate = budget.EndDate.AddDays(1);

                _context.Update(budget);
                //await _context.SaveChangesAsync();

                // Ensure the cache is updated with the most recent values
                await _cacheService.SetCacheValue(cacheKey, budget);
            }

            // Ensure the cache reflects the latest budget, including the TotalAmount and other properties
            await _cacheService.SetCacheValue(cacheKey, budget);

            return budget;
        }


        public async Task<IReadOnlyList<Budget>> GetBudgetsByUser(Guid userId)
        {
            if (userId == Guid.Empty)
            {
                throw new BadRequestException("User ID must be valid.");
            }

            var cacheKey = $"Budgets:{userId}";
            var cachedBudgets = await _cacheService.GetCacheValue<IReadOnlyList<Budget>>(cacheKey);

            if (cachedBudgets != null && cachedBudgets.Any())
            {
                return cachedBudgets;
            }

            var budgets = await _context.Budgets.AsNoTracking().Where(k => k.UserId == userId).ToListAsync();
            if (budgets == null || !budgets.Any())
            {
                throw new NotFoundException("No budgets found for the specified user.");
            }

            await _cacheService.SetCacheValue(cacheKey, budgets);
            return budgets;
        }

        public async Task<Budget> UpdateBudget(Guid Id, BudgetDto budgetDto)
        {
            var budget = await _context.Budgets.FirstOrDefaultAsync(b => b.Id == Id && budgetDto.UserId == b.UserId);
            if (budget == null)
            {
                throw new NotFoundException();
            }
            var fromDtoToBudget = ConfigMapper.Mapper.Map<Budget>(budgetDto);
            _context.Update(fromDtoToBudget);

            var cacheKey = $"Budget:{Id}:{budgetDto.UserId}";
            await _cacheService.SetCacheValue(cacheKey, fromDtoToBudget);


            return fromDtoToBudget;
        }
    }
}
