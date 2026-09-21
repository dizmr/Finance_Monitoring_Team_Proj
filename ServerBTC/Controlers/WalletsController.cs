using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerBTC.DTOs;
using ServerBTC.Models;

namespace ServerBTC.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WalletsController : ControllerBase
{
    private readonly AppDbContext _context;

    public WalletsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/wallets         [[OLD VER]]
    // Получить список всех кошельков с их валютой и владельцем
    /*[HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var wallets = await _context.Wallets
            .Include(w => w.Currency) 
            .AsNoTracking()
            .ToListAsync();

        return Ok(wallets);
    }
    */
    // GET: api/wallets         [[NEW VER]]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var wallets = await _context.Wallets
            .Include(w => w.Currency)
            .AsNoTracking()
            .Select(w => new WalletResponseDto
            {
                Id = w.Id,
                Name = w.Name,
                Balance = w.Balance,
                CurrencyCode = w.Currency != null ? w.Currency.Code : string.Empty,
                CurrencyName = w.Currency != null ? w.Currency.Name : string.Empty,
                CreatedAt = w.CreatedAt
            })
            .ToListAsync();

        return Ok(wallets);
    }


    // POST: api/wallets            [[OLD]]
    // Создать новый кошелек
    /*[HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWalletDTO dto)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
        var currencyExists = await _context.Currencies.AnyAsync(c => c.Id == dto.CurrencyId);

        if (!userExists || !currencyExists)
        {
            return BadRequest("Пользователь или валюта не найдены.");
        }

        var wallet = new Wallet
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Balance = dto.InitialBalance,
            UserId = dto.UserId,
            CurrencyId = dto.CurrencyId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Wallets.Add(wallet);
        await _context.SaveChangesAsync(); 

        return CreatedAtAction(nameof(GetAll), new { id = wallet.Id }, wallet);
    }
    */


    // POST: api/wallets            [[NEW]]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateWalletDto dto)
    {
        var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
        if (!userExists)
        {
            return BadRequest("Пользователь не найден.");
        }

        // Ищем валюту по коду (USD, UAH и т.д.)
        var currency = await _context.Currencies
            .FirstOrDefaultAsync(c => c.Code.ToUpper() == dto.CurrencyCode.ToUpper());

        if (currency == null)
        {
            return BadRequest($"Валюта с кодом '{dto.CurrencyCode}' не найдена.");
        }

        var wallet = new Wallet
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Balance = dto.InitialBalance,
            UserId = dto.UserId,
            CurrencyId = currency.Id
        };

        _context.Wallets.Add(wallet);
        await _context.SaveChangesAsync();

        return Ok(wallet);
    }
}