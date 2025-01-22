using ExpenseTracker.Dtos;
using ExpenseTracker.Models;
using ExpenseTracker.Uow;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Controllers
{
    public class CategoryController : ApiController
    {
        private readonly IUnitOfWork _uow;
        public CategoryController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpGet("GetCategories/{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IReadOnlyList<Category>))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCategories(Guid userId)
        {
            var categories = await _uow.categoryRepository.GetCategories(userId);
            return Ok(categories);
        }

        [HttpGet("GetCategory/{categoryId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Category))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCategory(Guid categoryId)
        {
            var category = await _uow.categoryRepository.GetCategory(categoryId);
            return Ok(category);
        }


        [HttpPost("CreateCategory/{userId}")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Category))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateCategory(Guid userId, CategoryDto categoryDto)
        {
            var category = await _uow.categoryRepository.CreateCategory(userId, categoryDto);
            await _uow.Commit();
            return CreatedAtAction(nameof(GetCategory), new { userId = userId, categoryId = category.Id }, category);
        }

        [HttpPut("UpdateCategory/{userId}/{categoryId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Category))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateCategory(Guid userId, Guid categoryId, CategoryDto categoryDto)
        {
            var category = await _uow.categoryRepository.UpdateCategory(userId, categoryId, categoryDto);
            await _uow.Commit();
            return Ok(category);
        }

        [HttpDelete("DeleteCategory/{userId}/{categoryId}")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Category))]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteCategory(Guid userId, Guid categoryId)
        {
            var category = await _uow.categoryRepository.DeleteCategory(userId, categoryId);
            await _uow.Commit();
            return Ok(category);
        }
    }
}
