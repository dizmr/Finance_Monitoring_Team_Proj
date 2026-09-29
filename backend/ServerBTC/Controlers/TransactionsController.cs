using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerBTC.DTOs;
using ServerBTC.Models;

namespace ServerBTC.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TransactionsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/transactions?walletId=...
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] Guid? walletId)
    {
        var query = _context.Transactions
            .Include(t => t.Wallet)
            .Include(t => t.Category)
            .Include(t => t.IncomeSource)
            .AsNoTracking();

        if (walletId.HasValue)
        {
            query = query.Where(t => t.WalletId == walletId.Value);
        }

        var result = await query
            .OrderByDescending(t => t.Date)
            .Select(t => new TransactionResponseDto
            {
                Id = t.Id,
                WalletId = t.WalletId,
                WalletName = t.Wallet != null ? t.Wallet.Name : string.Empty,
                Amount = t.Amount,
                Type = t.Type.ToString(),
                Description = t.Comment ?? string.Empty,
                CategoryName = t.Category != null ? t.Category.Name : null,
                IncomeSourceName = t.IncomeSource != null ? t.IncomeSource.Name : null,
                CreatedAt = t.Date
            })
            .ToListAsync();

        return Ok(result);
    }


    // POST: api/transactions
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTransactionDto dto)
    {
        // 1. Ищем кошелек С ОТСЛЕЖИВАНИЕМ (без AsNoTracking!)
        var wallet = await _context.Wallets.FirstOrDefaultAsync(w => w.Id == dto.WalletId);
        if (wallet == null)
        {
            return BadRequest("Кошелек не найден.");
        }

        // 2. Проверяем баланс при расходе (Expense = 2)
        if ((int)dto.Type == 2 && wallet.Balance < dto.Amount)
        {
            return BadRequest("Недостаточно средств на кошельке.");
        }

        // 3. Обновляем баланс кошелька
        if ((int)dto.Type == 1) // Income
        {
            wallet.Balance += dto.Amount;
        }
        else if ((int)dto.Type == 2) // Expense
        {
            wallet.Balance -= dto.Amount;
        }

        // Явно указываем EF Core, что состояние кошелька изменилось!
        _context.Entry(wallet).State = EntityState.Modified;

        // 4. Создаем транзакцию
        var transaction = new Transaction
        {
            Id = Guid.NewGuid(),
            WalletId = dto.WalletId,
            CurrencyId = wallet.CurrencyId,
            Amount = dto.Amount,
            Type = dto.Type,
            Comment = dto.Description,
            CategoryId = dto.CategoryId,
            IncomeSourceId = dto.IncomeSourceId,
            Date = DateTime.UtcNow
        };

        _context.Transactions.Add(transaction);

        // 5. Сохраняем всё в БД
        await _context.SaveChangesAsync();

        var response = new TransactionResponseDto
        {
            Id = transaction.Id,
            WalletId = wallet.Id,
            WalletName = wallet.Name,
            Amount = transaction.Amount,
            Type = transaction.Type.ToString(),
            Description = transaction.Comment ?? string.Empty,
            CreatedAt = transaction.Date
        };
        /*
        return CreatedAtAction(nameof(GetAll), new { walletId = wallet.Id }, response);
        */
        return Ok(new
        {
            Message = "Транзакция успешно проведена!",
            NewWalletBalance = wallet.Balance, // <-- Посмотришь, поменялся ли он в памяти
            TransactionId = transaction.Id,
            Amount = transaction.Amount
        });
    }
}