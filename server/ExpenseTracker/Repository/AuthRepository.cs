using AutoMapper;
using ExpenseTracker.DataLayer;
using ExpenseTracker.Dtos;
using ExpenseTracker.Interfaces.Repository;
using ExpenseTracker.Mapper;
using ExpenseTracker.Models;
using Konscious.Security.Cryptography;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        public AuthRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<string> Login(LoginDto loginDto)
        {
            var userExists = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            var userInAuthExists = await _context.Auths.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (userExists == null || userInAuthExists == null)
            {
                throw new Exception("The user does not exist");
            }

            var dehashPassword = BCrypt.Net.BCrypt.EnhancedVerify(loginDto.Password, userInAuthExists.PasswordHash);
            if (dehashPassword == false)
            {
                throw new Exception("Invalid password");
            }

            return "the token";
        }

        public async Task Register(RegisterDto registerDto)
        {
            var userExists = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerDto.Email);
            var authExists = await _context.Auths.FirstOrDefaultAsync(u => u.Email == registerDto.Email);

            if (authExists != null || userExists != null)
            {
                throw new Exception("The users already exists");
            }

            if (!string.Equals(registerDto.ConfirmPassword, registerDto.Password))
            {
                throw new Exception("The password must match!");
            }

            var hashPassword = BCrypt.Net.BCrypt.EnhancedHashPassword(registerDto.Password);
            
            User mapRegisterDtoToUser = ConfigMapper.Mapper.Map<User>(registerDto);
            Auth mapRegisterDtoToAuth = ConfigMapper.Mapper.Map<Auth>(registerDto);
            mapRegisterDtoToAuth.PasswordHash = hashPassword;
            
            await _context.Users.AddAsync(mapRegisterDtoToUser);
            await _context.Auths.AddAsync(mapRegisterDtoToAuth);
            await _context.SaveChangesAsync();
        }
    }
}
