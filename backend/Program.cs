using Microsoft.EntityFrameworkCore;
using FinanceMonitoring.Api.Data;
using FinanceMonitoring.Api.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();

// Створюємо схему БД автоматично при старті (без окремих EF-міграцій — простіше для навчального проєкту)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

// ==================== Currencies ====================
app.MapGet("/api/currencies", async (AppDbContext db) =>
    await db.Currencies.ToListAsync());

app.MapPost("/api/currencies", async (AppDbContext db, Currency currency) =>
{
    db.Currencies.Add(currency);
    await db.SaveChangesAsync();
    return Results.Created($"/api/currencies/{currency.Id}", currency);
});

app.MapDelete("/api/currencies/{id:int}", async (AppDbContext db, int id) =>
{
    var currency = await db.Currencies.FindAsync(id);
    if (currency is null) return Results.NotFound();
    db.Currencies.Remove(currency);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ==================== Wallets ====================
app.MapGet("/api/wallets", async (AppDbContext db) =>
    await db.Wallets.Include(w => w.Currency).ToListAsync());

app.MapPost("/api/wallets", async (AppDbContext db, Wallet wallet) =>
{
    db.Wallets.Add(wallet);
    await db.SaveChangesAsync();
    return Results.Created($"/api/wallets/{wallet.Id}", wallet);
});

app.MapPut("/api/wallets/{id:int}", async (AppDbContext db, int id, Wallet input) =>
{
    var wallet = await db.Wallets.FindAsync(id);
    if (wallet is null) return Results.NotFound();
    wallet.Name = input.Name;
    wallet.CurrencyId = input.CurrencyId;
    await db.SaveChangesAsync();
    return Results.Ok(wallet);
});

app.MapDelete("/api/wallets/{id:int}", async (AppDbContext db, int id) =>
{
    var wallet = await db.Wallets.FindAsync(id);
    if (wallet is null) return Results.NotFound();
    db.Wallets.Remove(wallet);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ==================== Expense categories ====================
app.MapGet("/api/categories", async (AppDbContext db) =>
    await db.ExpenseCategories.ToListAsync());

app.MapPost("/api/categories", async (AppDbContext db, ExpenseCategory category) =>
{
    db.ExpenseCategories.Add(category);
    await db.SaveChangesAsync();
    return Results.Created($"/api/categories/{category.Id}", category);
});

app.MapDelete("/api/categories/{id:int}", async (AppDbContext db, int id) =>
{
    var category = await db.ExpenseCategories.FindAsync(id);
    if (category is null) return Results.NotFound();
    db.ExpenseCategories.Remove(category);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ==================== Income sources ====================
app.MapGet("/api/income-sources", async (AppDbContext db) =>
    await db.IncomeSources.ToListAsync());

app.MapPost("/api/income-sources", async (AppDbContext db, IncomeSource source) =>
{
    db.IncomeSources.Add(source);
    await db.SaveChangesAsync();
    return Results.Created($"/api/income-sources/{source.Id}", source);
});

app.MapDelete("/api/income-sources/{id:int}", async (AppDbContext db, int id) =>
{
    var source = await db.IncomeSources.FindAsync(id);
    if (source is null) return Results.NotFound();
    db.IncomeSources.Remove(source);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ==================== Transactions ====================
app.MapGet("/api/transactions", async (AppDbContext db, int? walletId, DateTime? from, DateTime? to, string? type) =>
{
    var query = db.Transactions
        .Include(t => t.Wallet).ThenInclude(w => w!.Currency)
        .Include(t => t.Category)
        .Include(t => t.IncomeSource)
        .AsQueryable();

    if (walletId.HasValue) query = query.Where(t => t.WalletId == walletId.Value);
    if (from.HasValue) query = query.Where(t => t.Date >= from.Value);
    if (to.HasValue) query = query.Where(t => t.Date <= to.Value);
    if (!string.IsNullOrEmpty(type) && Enum.TryParse<TransactionType>(type, true, out var parsedType))
        query = query.Where(t => t.Type == parsedType);

    return await query.OrderByDescending(t => t.Date).ToListAsync();
});

app.MapPost("/api/transactions", async (AppDbContext db, Transaction tx) =>
{
    var wallet = await db.Wallets.FindAsync(tx.WalletId);
    if (wallet is null) return Results.BadRequest(new { error = "Гаманець не знайдено" });

    db.Transactions.Add(tx);
    wallet.Balance += tx.Type == TransactionType.Income ? tx.Amount : -tx.Amount;

    await db.SaveChangesAsync();
    return Results.Created($"/api/transactions/{tx.Id}", tx);
});

app.MapDelete("/api/transactions/{id:int}", async (AppDbContext db, int id) =>
{
    var tx = await db.Transactions.FindAsync(id);
    if (tx is null) return Results.NotFound();

    var wallet = await db.Wallets.FindAsync(tx.WalletId);
    if (wallet is not null)
        wallet.Balance -= tx.Type == TransactionType.Income ? tx.Amount : -tx.Amount;

    db.Transactions.Remove(tx);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

// ==================== Reports (дані для графіків) ====================
app.MapGet("/api/reports/summary", async (AppDbContext db, DateTime? from, DateTime? to, int? walletId) =>
{
    var query = db.Transactions
        .Include(t => t.Category)
        .Include(t => t.IncomeSource)
        .AsQueryable();

    if (from.HasValue) query = query.Where(t => t.Date >= from.Value);
    if (to.HasValue) query = query.Where(t => t.Date <= to.Value);
    if (walletId.HasValue) query = query.Where(t => t.WalletId == walletId.Value);

    var transactions = await query.ToListAsync();

    var totalIncome = transactions.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount);
    var totalExpense = transactions.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount);

    var byDay = transactions
        .GroupBy(t => t.Date.Date)
        .OrderBy(g => g.Key)
        .Select(g => new
        {
            date = g.Key.ToString("yyyy-MM-dd"),
            income = g.Where(t => t.Type == TransactionType.Income).Sum(t => t.Amount),
            expense = g.Where(t => t.Type == TransactionType.Expense).Sum(t => t.Amount)
        });

    var byCategory = transactions
        .Where(t => t.Type == TransactionType.Expense)
        .GroupBy(t => t.Category != null ? t.Category.Name : "Без категорії")
        .Select(g => new { category = g.Key, total = g.Sum(t => t.Amount) });

    var bySource = transactions
        .Where(t => t.Type == TransactionType.Income)
        .GroupBy(t => t.IncomeSource != null ? t.IncomeSource.Name : "Без джерела")
        .Select(g => new { source = g.Key, total = g.Sum(t => t.Amount) });

    return Results.Ok(new { totalIncome, totalExpense, byDay, byCategory, bySource });
});

app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }));

app.Run();
