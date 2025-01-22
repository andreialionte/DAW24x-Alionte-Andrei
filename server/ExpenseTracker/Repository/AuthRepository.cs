using ExpenseTracker.DataLayer;
using ExpenseTracker.Dtos;
using ExpenseTracker.Exceptions;
using ExpenseTracker.Interfaces.Repository;
using ExpenseTracker.Mapper;
using ExpenseTracker.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ExpenseTracker.Repository
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        public AuthRepository(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        public async Task<string> Login(LoginDto loginDto)
        {
            var userExists = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            var userInAuthExists = await _context.Auths.FirstOrDefaultAsync(u => u.Email == loginDto.Email);
            if (userExists == null || userInAuthExists == null)
            {
                throw new NotFoundException();
            }

            var dehashPassword = BCrypt.Net.BCrypt.EnhancedVerify(loginDto.Password, userInAuthExists.PasswordHash);
            if (dehashPassword == false)
            {
                throw new BadRequestException(dehashPassword, "Invalid password");
            }

            var token = GenerateToken(userExists);

            return token;
        }

        public async Task<Auth> Register(RegisterDto registerDto)
        {
            var userExists = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerDto.Email);
            var authExists = await _context.Auths.FirstOrDefaultAsync(u => u.Email == registerDto.Email);

            //Corrected the logic: Check if either user or auth already exists, then throw exception
            if (userExists != null || authExists != null)
            {
                // Throw FoundException if any of them already exist
                throw new FoundException("User or Auth already exists with this email.");
            }

            // Validate password confirmation
            if (!string.Equals(registerDto.ConfirmPassword, registerDto.Password))
            {
                throw new BadRequestException(registerDto.Password, "The password must match!");
            }

            // Hash the password before storing
            var hashPassword = BCrypt.Net.BCrypt.EnhancedHashPassword(registerDto.Password);

            // Map RegisterDto to User and Auth entities
            User mapRegisterDtoToUser = ConfigMapper.Mapper.Map<User>(registerDto);
            Auth mapRegisterDtoToAuth = ConfigMapper.Mapper.Map<Auth>(registerDto);
            mapRegisterDtoToAuth.PasswordHash = hashPassword;

            Console.WriteLine("Mapped Email: " + mapRegisterDtoToAuth.Email);

            // Add User and Auth entities to context
            await _context.Users.AddAsync(mapRegisterDtoToUser);
            await _context.Auths.AddAsync(mapRegisterDtoToAuth);

            // Save the changes to the database
            await _context.SaveChangesAsync();

            // Return the mapped Auth object (with hashed password and other details)
            return mapRegisterDtoToAuth;
        }

        private string GenerateToken(User user)
        {
            var claims = new List<Claim>
    {
        new Claim("userId", user.Id.ToString()),
        new Claim(ClaimTypes.Email, user.Email),
        new Claim(ClaimTypes.Name, user.FirstName + " " + user.LastName)
    };

            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration.GetSection("Key").Value));

            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha512);

            var jwtSecurityToken = new JwtSecurityToken(
                issuer: "https://localhost:4200",
                audience: "https://localhost:4200",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(6),
                signingCredentials: signingCredentials
            );

            // Return the JWT token as a string
            return new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
        }
    }
}
