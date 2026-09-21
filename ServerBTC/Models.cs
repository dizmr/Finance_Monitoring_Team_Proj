using System.Transactions;

namespace ServerBTC.Models;


public enum TransactionType
{
    Expense = 0,
    Income = 1
}


public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    public List<Wallet> Wallets { get; set; } = new();
    public List<Category> Categories { get; set; } = new();
    public List<IncomeSource> IncomeSources { get; set; } = new();
}

public class Currency
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
}

public class Wallet
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public decimal Balance { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid CurrencyId { get; set; }
    public Currency Currency { get; set; } = null!;

    public List<Transaction> Transactions { get; set; } = new();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Category
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;


    public Guid? UserId { get; set; }
    public User? User { get; set; }
}


public class IncomeSource
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
}



public class Transaction
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string? Comment { get; set; }



    public decimal ExchangeRate { get; set; } = 1.0m;

    public Guid WalletId { get; set; }
    public Wallet Wallet { get; set; } = null!;

    public Guid CurrencyId { get; set; }
    public Currency Currency { get; set; } = null!;

    public Guid? CategoryId { get; set; }
    public Category? Category { get; set; }

    public Guid? IncomeSourceId { get; set; }
    public IncomeSource? IncomeSource { get; set; }
}