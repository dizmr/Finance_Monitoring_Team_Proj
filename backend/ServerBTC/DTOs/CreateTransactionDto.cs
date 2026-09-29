using System.ComponentModel.DataAnnotations;
using ServerBTC.Models;

namespace ServerBTC.DTOs;

public class CreateTransactionDto
{
    [Required]
    public Guid WalletId { get; set; }

    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Сумма должна быть больше нуля.")]
    public decimal Amount { get; set; }

    [Required]
    public TransactionType Type { get; set; } // Берётся из Models

    public string Description { get; set; } = string.Empty;

    public Guid? CategoryId { get; set; }
    public Guid? IncomeSourceId { get; set; }
}