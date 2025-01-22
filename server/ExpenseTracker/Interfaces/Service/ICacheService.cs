namespace ExpenseTracker.Interfaces.Service
{
    public interface ICacheService
    {
        public Task<T> GetCacheValue<T>(string key);
        public Task<bool> SetCacheValue<T>(string key, T value);
    }
}
