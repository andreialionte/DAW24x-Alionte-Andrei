using AutoMapper;
using ExpenseTracker.Dtos;
using ExpenseTracker.Models;

namespace ExpenseTracker.Mapper;

public class MapperProfiles : Profile
{
    public MapperProfiles()
    {
        CreateMap<User, RegisterDto>().ReverseMap();
    }
}