using ExpenseTracker.Dtos;
using ExpenseTracker.Models;

namespace ExpenseTracker.Interfaces.Repository
{
    public interface ICategoryRepository
    {
        Task<IReadOnlyList<Category>> GetCategories(Guid userId);
        Task<Category> GetCategory(Guid categoryId);
        Task<Category> CreateCategory(Guid userId, CategoryDto categoryDto);
        Task<Category> UpdateCategory(Guid userId, Guid categoryId, CategoryDto categoryDto);
        Task<Category> DeleteCategory(Guid userId, Guid categoryId);
    }
}
