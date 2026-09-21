using ServerBTC.Models;

namespace ServerBTC;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        // Убеждаемся, что база данных создана
        context.Database.EnsureCreated();

        // Проверяем, есть ли уже пользователи
        if (context.Users.Any())
        {
            return; // База уже заполнена
        }

        var defaultUserId = Guid.Parse("11111111-1111-1111-1111-111111111111");
        var usdCurrencyId = Guid.Parse("22222222-2222-2222-2222-222222222222");
        var uahCurrencyId = Guid.Parse("33333333-3333-3333-3333-333333333333");

        // Добавляем тестового пользователя
        var user = new User
        {
            Id = defaultUserId,
            Username = "TestUser",
            Email = "test@example.com"
        };

        // Добавляем валюты
        var usd = new Currency { Id = usdCurrencyId, Code = "USD", Name = "US Dollar" };
        var uah = new Currency { Id = uahCurrencyId, Code = "UAH", Name = "Ukrainian Hryvnia" };

        context.Users.Add(user);
        context.Currencies.AddRange(usd, uah);

        context.SaveChanges(); // Фиксируем записи в БД
    }
}