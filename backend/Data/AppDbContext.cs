using Microsoft.EntityFrameworkCore;
using FinanceMonitoring.Api.Models;

namespace FinanceMonitoring.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Currency> Currencies => Set<Currency>();
    public DbSet<Wallet> Wallets => Set<Wallet>();
    public DbSet<ExpenseCategory> ExpenseCategories => Set<ExpenseCategory>();
    public DbSet<IncomeSource> IncomeSources => Set<IncomeSource>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Transaction>().Property(t => t.Amount).HasColumnType("numeric(18,2)");
        modelBuilder.Entity<Wallet>().Property(w => w.Balance).HasColumnType("numeric(18,2)");
        modelBuilder.Entity<Currency>().Property(c => c.RateToBase).HasColumnType("numeric(18,6)");

        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Wallet)
            .WithMany(w => w.Transactions)
            .HasForeignKey(t => t.WalletId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.Category)
            .WithMany()
            .HasForeignKey(t => t.CategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Transaction>()
            .HasOne(t => t.IncomeSource)
            .WithMany()
            .HasForeignKey(t => t.IncomeSourceId)
            .OnDelete(DeleteBehavior.SetNull);

        // Початкові дані, щоб застосунок був одразу зручний для тестування
        modelBuilder.Entity<Currency>().HasData(
            new Currency { Id = 1, Code = "UAH", Name = "Українська гривня", Symbol = "₴", RateToBase = 1 },
            new Currency { Id = 2, Code = "USD", Name = "Долар США", Symbol = "$", RateToBase = 41 },
            new Currency { Id = 3, Code = "EUR", Name = "Євро", Symbol = "€", RateToBase = 44 }
        );

        modelBuilder.Entity<ExpenseCategory>().HasData(
            new ExpenseCategory { Id = 1, Name = "Продукти", Icon = "🛒" },
            new ExpenseCategory { Id = 2, Name = "Транспорт", Icon = "🚌" },
            new ExpenseCategory { Id = 3, Name = "Житло", Icon = "🏠" },
            new ExpenseCategory { Id = 4, Name = "Розваги", Icon = "🎮" },
            new ExpenseCategory { Id = 5, Name = "Здоров'я", Icon = "💊" }
        );

        modelBuilder.Entity<IncomeSource>().HasData(
            new IncomeSource { Id = 1, Name = "Зарплата", Icon = "💼" },
            new IncomeSource { Id = 2, Name = "Фріланс", Icon = "💻" },
            new IncomeSource { Id = 3, Name = "Подарунки", Icon = "🎁" }
        );
    }
}
