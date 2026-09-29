using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerBTC.Models;
using ServerBTC.Services;

namespace ServerBTC.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ICurrencyService _currencyService;

    public AnalyticsController(AppDbContext context, ICurrencyService currencyService)
    {
        _context = context;
        _currencyService = currencyService;
    }

    // GET: api/analytics/user/{userId}/total-balance?targetCurrency=USD
    [HttpGet("user/{userId}/total-balance")]
    public async Task<IActionResult> GetTotalBalance(Guid userId, [FromQuery] string targetCurrency = "UAH")
    {
        var userWallets = await _context.Wallets
            .Include(w => w.Currency)
            .Where(w => w.UserId == userId)
            .AsNoTracking()
            .ToListAsync();

        if (!userWallets.Any())
        {
            return NotFound("Кошельки для данного пользователя не найдены.");
        }

        // ЭТО ИЗ НБУ 100% НОРМ БАЗА
        decimal targetRateToUah = await _currencyService.GetExchangeRateAsync(targetCurrency);

        decimal totalInUah = 0m;

        foreach (var wallet in userWallets)
        {
            var walletCode = wallet.Currency?.Code ?? "UAH";

            // Курс валюты кошелька к грыням
            decimal walletRateToUah = await _currencyService.GetExchangeRateAsync(walletCode);

            // Уэээууэуээъъуээуъ
            totalInUah += wallet.Balance * walletRateToUah;
        }

        // Из грыни в что то другое
        decimal totalInTargetCurrency = totalInUah / targetRateToUah;

        return Ok(new
        {
            UserId = userId,
            TargetCurrency = targetCurrency.ToUpper(),
            TotalBalance = Math.Round(totalInTargetCurrency, 2),
            WalletsCount = userWallets.Count
        });
    }

    // GET: api/analytics/user/{userId}/expenses-by-category
    [HttpGet("user/{userId}/expenses-by-category")]
    public async Task<IActionResult> GetExpensesByCategory(Guid userId)
    {
        var expenses = await _context.Transactions
            .Include(t => t.Category)
            .Where(t => t.Wallet.UserId == userId && (int)t.Type == 2) // Type 2 = Expense
            .AsNoTracking()
            .ToListAsync();

        var grouped = expenses
            .GroupBy(t => t.Category != null ? t.Category.Name : "Без категории")
            .Select(g => new
            {
                Category = g.Key,
                TotalAmount = g.Sum(t => t.Amount),
                Count = g.Count()
            })
            .OrderByDescending(x => x.TotalAmount)
            .ToList();

        return Ok(new
        {
            UserId = userId,
            Expenses = grouped
        });
    }
}