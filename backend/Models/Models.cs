namespace FinanceMonitoring.Api.Models;

public class Currency
{
    public int Id { get; set; }
    public string Code { get; set; } = "";       // USD, EUR, UAH...
    public string Name { get; set; } = "";
    public string Symbol { get; set; } = "";
    public decimal RateToBase { get; set; } = 1; // курс до базової валюти (UAH)

    public ICollection<Wallet> Wallets { get; set; } = new List<Wallet>();
}

public class Wallet
{
    public int Id { get; set; }
    public string Name { get; set; } = "";

    public int CurrencyId { get; set; }
    public Currency? Currency { get; set; }

    public decimal Balance { get; set; }

    public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
}

public class ExpenseCategory
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Icon { get; set; } = "💸";
}

public class IncomeSource
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Icon { get; set; } = "💰";
}

public enum TransactionType { Income, Expense }

public class Transaction
{
    public int Id { get; set; }
    public TransactionType Type { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public string? Description { get; set; }

    public int WalletId { get; set; }
    public Wallet? Wallet { get; set; }

    public int? CategoryId { get; set; }        // заповнюється для Expense
    public ExpenseCategory? Category { get; set; }

    public int? IncomeSourceId { get; set; }     // заповнюється для Income
    public IncomeSource? IncomeSource { get; set; }
}
