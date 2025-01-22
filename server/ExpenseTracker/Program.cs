using ExpenseTracker.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;

namespace ExpenseTracker
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
                options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            });


            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            //builder.Services.AddOpenApi();


            //        builder.Services.AddDbContext<DataContext>(options =>
            //options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));


            //Services from DependecyInjection.cs
            builder.Services.AddApplicationServices();
            builder.Services.ConnectionStrings(builder.Configuration);
            /*
            builder.Services.RabbitMqServiceConfiguration(builder.Configuration);
            */
            builder.Services.RestOfTheServices();


            //Pt a merge [Authorize] Corect (Validare)
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "https://localhost:4200",
                    ValidAudience = "https://localhost:4200",
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration.GetSection("Key").Value))
                };
            });



            builder.Services.AddCors(c =>
            {
                c.AddPolicy("DefCors", c =>
                {
                    c.AllowAnyHeader();
                    c.AllowCredentials();
                    c.WithOrigins("http://localhost:3000");
                    c.AllowAnyMethod();
                });
            });

            var app = builder.Build();


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseCors("DefCors");
                //app.MapOpenApi();
                //app.MapScalarApiReference();
            }
            app.UseCors("DefCors");
            app.UseHttpsRedirection();

            app.UseMiddleware<ExceptionStatusCodeMiddleware>(); //

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
