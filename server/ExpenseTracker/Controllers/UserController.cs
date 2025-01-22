using ExpenseTracker.Models;
using ExpenseTracker.Uow;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Controllers
{
    public class UserController : ApiController
    {
        private readonly IUnitOfWork _unitOfWork;

        public UserController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        // GET: api/User
        [HttpGet("GetUsers")]
        public async Task<ActionResult<IReadOnlyList<User>>> GetUser()
        {
            var users = await _unitOfWork.userRepository.GetAllUsersAsync();
            return Ok(users);
        }

        // GET: api/User/{id}
        [HttpGet("GetUser/{id}")]
        public async Task<ActionResult<User>> GetUser(Guid id)
        {
            var user = await _unitOfWork.userRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        // POST: api/User
        [HttpPost]
        public async Task<ActionResult> CreateUser(User user)
        {
            await _unitOfWork.userRepository.AddUserAsync(user);
            await _unitOfWork.Commit();
            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, user);
        }

        // PUT: api/User/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(Guid id, User updatedUser)
        {
            if (id != updatedUser.Id)
            {
                return BadRequest("User ID mismatch");
            }

            var existingUser = await _unitOfWork.userRepository.GetUserByIdAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            await _unitOfWork.userRepository.UpdateUserAsync(updatedUser);
            await _unitOfWork.Commit();
            return NoContent();
        }

        // DELETE: api/User/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(Guid id)
        {
            var user = await _unitOfWork.userRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            await _unitOfWork.userRepository.DeleteUserAsync(id);
            await _unitOfWork.Commit();
            return NoContent();
        }
    }
}
