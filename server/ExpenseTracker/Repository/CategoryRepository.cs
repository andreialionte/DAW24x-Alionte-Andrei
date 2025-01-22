using ExpenseTracker.DataLayer;
using ExpenseTracker.Dtos;
using ExpenseTracker.Exceptions;
using ExpenseTracker.Interfaces.Repository;
using ExpenseTracker.Mapper;
using ExpenseTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Repository
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly DataContext _context;

        public CategoryRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<Category> CreateCategory(Guid userId, CategoryDto categoryDto)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(k => k.Name == categoryDto.Name && k.UserId == userId);
            if (category != null)
            {
                throw new BadRequestException(categoryDto.Name, "Alreay Exists!");
            }

            var fromCategoryDtoToCategory = ConfigMapper.Mapper.Map<Category>(categoryDto);
            fromCategoryDtoToCategory.UserId = userId;
            await _context.Categories.AddAsync(fromCategoryDtoToCategory);
            await _context.SaveChangesAsync();

            return fromCategoryDtoToCategory;
        }

        public async Task<Category> DeleteCategory(Guid userId, Guid categoryId)
        {
            var checkIfCategoryExists = await _context.Categories
                .FirstOrDefaultAsync(k => k.Id == categoryId && k.UserId == userId);
            if (checkIfCategoryExists == null)
            {
                throw new NotFoundException("The category does not exist for this user.");
            }

            _context.Categories.Remove(checkIfCategoryExists);
            await _context.SaveChangesAsync();
            return checkIfCategoryExists;
        }

        public async Task<IReadOnlyList<Category>> GetCategories(Guid userId)
        {
            return await _context.Categories
                .AsNoTracking()
                .Where(k => k.UserId == userId)
                .ToListAsync();
        }

        public async Task<Category> GetCategory(Guid categoryId)
        {
            var category = await _context.Categories
                .AsNoTracking()
                .FirstOrDefaultAsync(k => k.Id == categoryId);
            if (category == null)
            {
                throw new NotFoundException("The category does not exist for this user.");
            }

            return category;
        }

        public async Task<Category> UpdateCategory(Guid userId, Guid categoryId, CategoryDto categoryDto)
        {
            var categoryExist = await _context.Categories
                .FirstOrDefaultAsync(k => k.Id == categoryId && k.UserId == userId);
            if (categoryExist == null)
            {
                throw new NotFoundException("The category does not exist for this user.");
            }

            var fromCategoryDtoToCategory = ConfigMapper.Mapper.Map<Category>(categoryDto);
            fromCategoryDtoToCategory.UserId = userId;
            _context.Categories.Update(fromCategoryDtoToCategory);
            await _context.SaveChangesAsync();

            return fromCategoryDtoToCategory;
        }
    }
}

