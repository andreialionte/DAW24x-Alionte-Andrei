using AutoMapper;
using ExpenseTracker.Dtos;
using ExpenseTracker.Models;

namespace ExpenseTracker.Mapper;

public class ConfigMapper
{
    private static readonly Lazy<IMapper> LazyMapper = new Lazy<IMapper>(() =>
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<MapperProfiles>();

        });
        var mapper = config.CreateMapper();
        return mapper;
    });

    public static IMapper Mapper => LazyMapper.Value;
}