using ExpenseTracker.DataLayer;
using ExpenseTracker.Interfaces.Repository;
using ExpenseTracker.Interfaces.Service;
using ExpenseTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Repository
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly ICacheService _cacheService;

        public UserRepository(DataContext context, ICacheService cacheService)
        {
            _context = context;
            _cacheService = cacheService;
        }

        // Create a new user
        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User> GetUserByIdAsync(Guid id)
        {
            var cacheKey = $"GetUserByIdAsync:{id}";
            var getUserByIdCached = await _cacheService.GetCacheValue<User>(cacheKey);

            if (getUserByIdCached != null)
            {
                return getUserByIdCached;
            }

            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(k => k.Id == id);

            if (user != null)
            {
                await _cacheService.SetCacheValue(cacheKey, user);
            }

            return user;
        }

        // Get all users
        public async Task<IReadOnlyList<User>> GetAllUsersAsync()
        {
            return await _context.Users.ToListAsync();
        }

        // Update an existing user
        public async Task UpdateUserAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        // Delete a user
        public async Task DeleteUserAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }
    }
}
