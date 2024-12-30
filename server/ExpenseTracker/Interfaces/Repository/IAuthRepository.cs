using ExpenseTracker.Dtos;

namespace ExpenseTracker.Interfaces.Repository
{
    public interface IAuthRepository
    {
        Task<string> Login(LoginDto loginDto);
        Task Register(RegisterDto registerDto);
    }
}
           