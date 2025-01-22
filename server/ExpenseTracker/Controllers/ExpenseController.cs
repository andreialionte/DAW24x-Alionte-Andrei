using ExpenseTracker.Controllers;
using ExpenseTracker.Dtos;
using ExpenseTracker.Uow;
using Microsoft.AspNetCore.Mvc;

public class ExpenseController : ApiController
{
    private readonly IUnitOfWork _uow;

    public ExpenseController(IUnitOfWork uow)
    {
        _uow = uow;
    }

    [HttpGet("GetExpenses/{userId}")]
    public async Task<IActionResult> GetExpenses(Guid userId)
    {
        var expenses = await _uow.expenseRepository.GetExpensesByUser(userId);
        return Ok(expenses);
    }

    [HttpGet("GetExpense/{expenseId}/{userId}")]
    public async Task<IActionResult> GetExpense(Guid expenseId, Guid userId)
    {
        var expenses = await _uow.expenseRepository.GetExpenseByUser(expenseId, userId);
        return Ok(expenses);
    }

    [HttpPost("CreateExpense/{userId}")]
    public async Task<IActionResult> CreateExpense(ExpenseDto expenseDto, Guid userId)
    {
        try
        {
            var expense = await _uow.expenseRepository.CreateExpense(expenseDto, userId);
            await _uow.Commit();
            return Ok(expense);
        }
        catch (Exception ex)
        {
            // Log the exception if needed
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("UpdateExpense/{expenseId}")]
    public async Task<IActionResult> UpdateExpense(Guid expenseId, ExpenseDto expenseDto)
    {
        try
        {
            var expense = await _uow.expenseRepository.UpdateExpense(expenseId, expenseDto);
            await _uow.Commit();
            return Ok(expense);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("DeleteExpense/{Id}")]
    public async Task<IActionResult> DeleteExpense(Guid Id)
    {
        try
        {
            var expense = await _uow.expenseRepository.DeleteExpense(Id);
            await _uow.Commit();
            return Ok(expense);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetLastFiveExpenses/{UserId}")]
    public async Task<IActionResult> GetLastFiveExpenses(Guid UserId)
    {
        var expenses = await _uow.expenseRepository.GetLastFiveExpenses(UserId);
        await _uow.Commit();
        return Ok(expenses);
    }

    [HttpGet("GetExpensesFromMonths/{UserId}")]
    public async Task<IActionResult> GetExpensesFromMonths(Guid UserId)
    {
        var expenses = await _uow.expenseRepository.GetExpensesFromMonths(UserId);
        await _uow.Commit();
        return Ok(expenses);
    }

    [HttpGet("GetExpensesByCategory/{UserId}")]
    public async Task<IActionResult> GetExpensesByCategory(Guid UserId)
    {
        var expenses = await _uow.expenseRepository.GetExpensesByCategory(UserId);
        await _uow.Commit();
        return Ok(expenses);
    }
}