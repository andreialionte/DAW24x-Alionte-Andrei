using ExpenseTracker.Dtos;
using ExpenseTracker.Uow;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace ExpenseTracker.Controllers
{
    public class BudgetController : ApiController
    {
        private readonly IUnitOfWork _uow;
        public BudgetController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpGet("GetBudgets/{userId}")]
        public async Task<IActionResult> GetBudgets([Required] Guid userId)
        {
            var budgets = await _uow.budgetRepository.GetBudgetsByUser(userId);
            return Ok(budgets);
        }

        [HttpGet("GetBudget/{id}")]
        public async Task<IActionResult> GetBudget(Guid id)
        {

            var budget = await _uow.budgetRepository.GetBudgetByUser(id);
            return Ok(budget);
        }

        [HttpPost("CreateBudget")]
        public async Task<IActionResult> CreateBudget([FromBody] BudgetDto budgetDto)
        {


            var budget = await _uow.budgetRepository.CreateBudget(budgetDto);
            await _uow.Commit();
            return CreatedAtAction(nameof(GetBudget), new { id = budget.Id }, budget);
        }

        [HttpPut("UpdateBudget/{id}")]
        public async Task<IActionResult> UpdateBudget(Guid id, [FromBody] BudgetDto budgetDto)
        {
            var updatedBudget = await _uow.budgetRepository.UpdateBudget(id, budgetDto);
            await _uow.Commit();
            return Ok(updatedBudget);
        }

        [HttpDelete("DeleteBudget/{id}")]
        public async Task<IActionResult> DeleteBudget(Guid id)
        {
            var deletedBudget = await _uow.budgetRepository.DeleteBudget(id);
            await _uow.Commit();
            return Ok(deletedBudget);
        }
    }
}
