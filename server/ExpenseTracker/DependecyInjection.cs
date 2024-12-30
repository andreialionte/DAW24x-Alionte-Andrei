using ExpenseTracker.DataLayer;
using ExpenseTracker.Interfaces.Repository;
using ExpenseTracker.Interfaces.Service;
using ExpenseTracker.Repository;
using ExpenseTracker.Services;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

namespace ExpenseTracker;

public static class DependecyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Register your repositories, services, and other dependencies here
        services.AddScoped<IAuthRepository, AuthRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        // Register other services like logging, caching, etc.
        services.AddSingleton<ICacheService, CacheService>();
        services.AddSingleton<ICacheService, CacheService>();
        
        return services;
    }
    
    public static IServiceCollection RestOfTheServices(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(Program));

        return services;
    }
    
    public static IServiceCollection ConnectionStrings(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<DataContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));
        
        services.AddSingleton<IConnectionMultiplexer>(x =>
            ConnectionMultiplexer.Connect(configuration.GetConnectionString("Valkey")));

        return services;
    }
    
    
    
}