using AutoMapper;
using ExpenseTracker.Dtos;
using ExpenseTracker.Models;

namespace ExpenseTracker.Mapper;

public class MapperProfiles : Profile
{
    public MapperProfiles()
    {
        CreateMap<Expense, ExpenseDto>().ReverseMap();

        CreateMap<Auth, RegisterDto>().ReverseMap();
        CreateMap<Auth, LoginDto>().ReverseMap();
        CreateMap<RegisterDto, User>().ReverseMap();
        CreateMap<RegisterDto, Auth>().ReverseMap();
        CreateMap<Budget, BudgetDto>().ReverseMap();
        CreateMap<Category, CategoryDto>().ReverseMap();
    }
}