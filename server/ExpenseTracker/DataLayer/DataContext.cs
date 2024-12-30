using ExpenseTracker.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.DataLayer
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Expense> Expenses { get; set; }
        public DbSet<RecurringExpense> RecurringExpenses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Budget> Budgets { get; set; }
        public DbSet<Auth> Auths { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure the Auth model
            modelBuilder.Entity<Auth>(entity =>
            {
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Email).HasMaxLength(200).IsRequired();
                entity.Property(a => a.PasswordHash).IsRequired();
            });

            // Configure the User model
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Username).IsRequired().HasMaxLength(100);
                entity.Property(u => u.Email).IsRequired().HasMaxLength(200);
                entity.Property(u => u.PasswordHash).IsRequired();
                entity.Property(u => u.Salt).IsRequired();

                // Relationships
                entity.HasMany(u => u.Expenses)
                    .WithOne(e => e.User)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(u => u.RecurringExpenses)
                    .WithOne(re => re.User)
                    .HasForeignKey(re => re.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasMany(u => u.Budgets)
                    .WithOne(b => b.User)
                    .HasForeignKey(b => b.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure the Category model
            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Name).IsRequired().HasMaxLength(100);
                entity.Property(c => c.Description).HasMaxLength(500);

                // Relationships
                entity.HasMany(c => c.Expenses)
                            .WithOne(e => e.Category)
                            .HasForeignKey(e => e.CategoryId)
                            .OnDelete(DeleteBehavior.Restrict);

                entity.HasMany(c => c.RecurringExpenses)
                            .WithOne(re => re.Category)
                            .HasForeignKey(re => re.CategoryId)
                            .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure the Expense model
            modelBuilder.Entity<Expense>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Description).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Amount).IsRequired();
                entity.Property(e => e.Date).IsRequired();
                entity.Property(e => e.Notes).HasMaxLength(500);
                entity.Property(e => e.AttachmentUrl).HasMaxLength(500);

                // Relationships
                entity.HasOne(e => e.User)
                                .WithMany(u => u.Expenses)
                                .HasForeignKey(e => e.UserId)
                                .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Category)
                                .WithMany(c => c.Expenses)
                                .HasForeignKey(e => e.CategoryId)
                                .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure the RecurringExpense model
            modelBuilder.Entity<RecurringExpense>(entity =>
            {
                entity.HasKey(re => re.Id);
                entity.Property(re => re.Description).IsRequired().HasMaxLength(200);
                entity.Property(re => re.Amount).IsRequired();
                entity.Property(re => re.StartDate).IsRequired();
                entity.Property(re => re.EndDate);
                entity.Property(re => re.LastProcessedDate);
                entity.Property(re => re.NextProcessingDate);
                entity.Property(re => re.IsActive).IsRequired();

                // Relationships
                entity.HasOne(re => re.User)
                    .WithMany(u => u.RecurringExpenses)
                    .HasForeignKey(re => re.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(re => re.Category)
                    .WithMany(c => c.RecurringExpenses)
                    .HasForeignKey(re => re.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure the Budget model
            modelBuilder.Entity<Budget>(entity =>
            {
                entity.HasKey(b => b.Id);
                entity.Property(b => b.Name).IsRequired().HasMaxLength(100);
                entity.Property(b => b.TotalAmount).IsRequired();
                entity.Property(b => b.SpentAmount).IsRequired();
                entity.Property(b => b.RemainingAmount).IsRequired();
                entity.Property(b => b.StartDate).IsRequired();
                entity.Property(b => b.EndDate).IsRequired();
                entity.Property(b => b.LastProcessedDate).IsRequired();
                entity.Property(b => b.NextProcessingDate).IsRequired();
                entity.Property(b => b.IsActive).IsRequired();


                //create relatioship betwen auth and user
            });
        }
    }
}
