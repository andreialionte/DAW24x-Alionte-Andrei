using ExpenseTracker.Interfaces.Service;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace ExpenseTracker.Services
{
    public class CacheService : ICacheService
    {
        private readonly IConnectionMultiplexer _connectionMultiplexer;

        public CacheService(IConnectionMultiplexer connectionMultiplexer)
        {
            _connectionMultiplexer = connectionMultiplexer;
        }

        public async Task<T> GetCacheValueAsync<T>(string key)
        {
            var db = _connectionMultiplexer.GetDatabase();
            string value = await db.StringGetAsync(key);

            // if value is Null, return default(T), otherwise deserialize it
            return string.IsNullOrEmpty(value) ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }

        public async Task<bool> SetCacheValueAsync<T>(string key, T value)
        {
            var db = _connectionMultiplexer.GetDatabase();
            string serializedValue = JsonConvert.SerializeObject(value);
            return await db.StringSetAsync(key, serializedValue, TimeSpan.FromMinutes(15));
        }
    }
}
