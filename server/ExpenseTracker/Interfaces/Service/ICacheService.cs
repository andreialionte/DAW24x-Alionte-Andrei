namespace ExpenseTracker.Interfaces.Service
{
    public interface ICacheService
    {
        public Task<T> GetCacheValueAsync<T>(string key);
        public Task<bool> SetCacheValueAsync<T>(string key, T value);
    }
}
