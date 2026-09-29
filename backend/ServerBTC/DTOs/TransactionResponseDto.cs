namespace ServerBTC.DTOs;

public class TransactionResponseDto
{
    public Guid Id { get; set; }
    public Guid WalletId { get; set; }
    public string WalletName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? CategoryName { get; set; }
    public string? IncomeSourceName { get; set; }
    public DateTime CreatedAt { get; set; }
}