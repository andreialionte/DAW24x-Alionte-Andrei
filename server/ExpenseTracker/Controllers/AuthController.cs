using ExpenseTracker.Dtos;
using ExpenseTracker.Models;
using ExpenseTracker.Uow;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Controllers
{
    /// <summary>
    /// Handles authentication-related operations such as user registration and login.
    /// </summary>
    public class AuthController : ApiController
    {
        private readonly IUnitOfWork _uow;
        public AuthController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        /// <summary>
        /// Registers a new user in the system.
        /// </summary>
        /// <param name="registerDto">The registration data transfer object containing user registration information.</param>
        /// <returns>A Created response with the user's ID if registration is successful, or a Bad Request response if there's an issue.</returns>
        [HttpPost("Register")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Auth))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            var reg = await _uow.authRepository.Register(registerDto);
            await _uow.Commit();
            return Created($"/auth/register/{reg.Id}", reg);
        }

        /// <summary>
        /// Logs in an existing user into the system.
        /// </summary>
        /// <param name="loginDto">The login data transfer object containing the user's credentials.</param>
        /// <returns>A 200 OK response with login details if successful, or a Bad Request response if the credentials are invalid.</returns>
        [HttpPost("Login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(string))]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var login = await _uow.authRepository.Login(loginDto);
            return Ok(login);
        }
    }
}
