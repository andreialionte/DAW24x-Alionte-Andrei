namespace ExpenseTracker.Models
{
    public class Auth : BaseEntity
    {
        public string? Email { get; set; }
        //public string? PasswordSalt { get; set; }
        public string? PasswordHash { get; set; }
    }
}
