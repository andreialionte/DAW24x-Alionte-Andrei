using ExpenseTracker.Dtos;
using ExpenseTracker.Models;

namespace ExpenseTracker.Interfaces.Repository
{
    public interface IAuthRepository
    {
        Task<string> Login(LoginDto loginDto);
        Task<Auth> Register(RegisterDto registerDto);
    }
}
