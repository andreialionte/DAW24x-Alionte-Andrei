using ExpenseTracker.DataLayer;
using ExpenseTracker.Interfaces.Repository;
using ExpenseTracker.Interfaces.Service;
using ExpenseTracker.Repository;
using ExpenseTracker.Services;
using ExpenseTracker.Uow;
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
        services.AddScoped<IBudgetRepository, BudgetRepository>();
        services.AddScoped<IExpenseRepository, ExpenseRepository>();

        services.AddScoped<IUnitOfWork, UnitOfWork>();

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

    //public static IServiceCollection RabbitMqServiceConfiguration(this IServiceCollection services, IConfiguration configuration)
    //{
    //    services.AddMassTransit(x =>
    //    {
    //        x.AddConsumer<ExpenseAddedConsumer>();
    //        x.AddConsumer<ExpenseUpdatedConsumer>();
    //        x.AddConsumer<ExpenseDeletedConsumer>();

    //        // Configurarea transportului RabbitMQ
    //        x.UsingRabbitMq((context, cfg) =>
    //        {
    //            // Configurare RabbitMQ - Hostul poate fi local sau la distanță
    //            cfg.Host("rabbitmq://localhost");

    //            // Configurare pentru adăugare
    //            cfg.ReceiveEndpoint("expense-add-queue", e =>
    //            {
    //                e.ConfigureConsumer<ExpenseAddedConsumer>(context);
    //            });

    //            // Configurare pentru actualizare
    //            cfg.ReceiveEndpoint("expense-update-queue", e =>
    //            {
    //                e.ConfigureConsumer<ExpenseUpdatedConsumer>(context);
    //            });

    //            // Configurare pentru ștergere
    //            cfg.ReceiveEndpoint("expense-delete-queue", e =>
    //            {
    //                e.ConfigureConsumer<ExpenseDeletedConsumer>(context);
    //            });
    //        });
    //    });

    //    return services;
    //}
}



