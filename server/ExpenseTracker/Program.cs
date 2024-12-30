using ExpenseTracker.DataLayer;
using ExpenseTracker.Interfaces.Service;
using ExpenseTracker.Services;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using StackExchange.Redis;

namespace ExpenseTracker
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            /*builder.Services.AddSwaggerGen();*/
            builder.Services.AddOpenApi();

            //builder.Services.AddScalarApi();

            builder.Services.AddDbContext<DataContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

            //Services from DependecyInjection.cs
            builder.Services.AddApplicationServices();
            builder.Services.ConnectionStrings(builder.Configuration);
            builder.Services.RestOfTheServices();
            

            var app = builder.Build();


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                /*app.UseSwagger();
                app.UseSwaggerUI();*/
                app.MapOpenApi();
                app.MapScalarApiReference();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
