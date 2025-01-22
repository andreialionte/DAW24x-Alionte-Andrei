using ExpenseTracker.Models;

namespace ExpenseTracker.Interfaces.Repository
{
    public interface IUserRepository
    {
        Task AddUserAsync(User user);
        Task<User> GetUserByIdAsync(Guid id);
        Task<IReadOnlyList<User>> GetAllUsersAsync();
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(Guid id);
    }
}
