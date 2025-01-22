using ExpenseTracker.Interfaces.Service;
using StackExchange.Redis;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ExpenseTracker.Services
{
    public class CacheService : ICacheService
    {
        private readonly IConnectionMultiplexer _connectionMultiplexer;
        private readonly JsonSerializerOptions _jsonOptions;

        public CacheService(IConnectionMultiplexer connectionMultiplexer)
        {
            _connectionMultiplexer = connectionMultiplexer;
            _jsonOptions = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.IgnoreCycles,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };
        }

        public async Task<T> GetCacheValue<T>(string key)
        {
            var db = _connectionMultiplexer.GetDatabase();
            string value = await db.StringGetAsync(key);
            return string.IsNullOrEmpty(value) ? default(T) :
                JsonSerializer.Deserialize<T>(value, _jsonOptions);
        }

        public async Task<bool> SetCacheValue<T>(string key, T value)
        {
            var db = _connectionMultiplexer.GetDatabase();
            string serializedValue = JsonSerializer.Serialize(value, _jsonOptions);
            return await db.StringSetAsync(key, serializedValue, TimeSpan.FromMinutes(15));
        }
    }
}