using ExpenseTracker.DataLayer;
using ExpenseTracker.Interfaces.Repository;
using ExpenseTracker.Interfaces.Service;
using ExpenseTracker.Repository;

namespace ExpenseTracker.Uow;

public class UnitOfWork : IUnitOfWork
{
    private readonly DataContext _context;
    private readonly ICacheService _cacheService;
    private readonly IConfiguration _configuration;
    private bool _disposed = false;

    private IAuthRepository _authRepository;
    private ICategoryRepository _categoryRepository;
    private IBudgetRepository _budgetRepository;
    private IUserRepository _userRepository;
    private IRecurringExpense _recurringRepository;
    private IExpenseRepository _expenseRepository;

    public UnitOfWork(DataContext context, IConfiguration configuration, ICacheService cacheService)
    {
        _context = context;
        _configuration = configuration;
        _cacheService = cacheService;
    }

    public IAuthRepository authRepository => _authRepository ??= new AuthRepository(_context, _configuration);
    public ICategoryRepository categoryRepository => _categoryRepository ??= new CategoryRepository(_context);
    public IBudgetRepository budgetRepository => _budgetRepository ??= new BudgetRepository(_context, _cacheService);
    public IExpenseRepository expenseRepository => _expenseRepository ??= new ExpenseRepository(_context, _cacheService);
    public IRecurringExpense recurringExpense => _recurringRepository ??= new RecurringExpense(_context);
    public IUserRepository userRepository => _userRepository ??= new UserRepository(_context, _cacheService);

    public async Task Commit()
    {
        await _context.SaveChangesAsync();
        //await _context.Database.CommitTransactionAsync();
    }

    public void Dispose()
    {
        // dispose(true) to dispose of resources
        Dispose(true);
        GC.SuppressFinalize(this); //// evita apelarea finalizatorului de GC
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!_disposed)
        {
            if (disposing)
            {
                // dispose of managed resources (repositories and dbcontext)
                _authRepository = null;
                _categoryRepository = null;
                _budgetRepository = null;
                _expenseRepository = null;
                _recurringRepository = null;
                _userRepository = null;


                _context.Dispose();
            }

            // resursele negestionate se elibereaza
            _disposed = true;
        }
    }

    // finalizatorul/destructor pentru curatarea resurselor negestionate
    ~UnitOfWork()
    {
        Dispose(false);
    }
}