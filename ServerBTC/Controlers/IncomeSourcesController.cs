using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerBTC.Models;

namespace ServerBTC.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IncomeSourcesController : ControllerBase
{
    private readonly AppDbContext _context;

    public IncomeSourcesController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/incomesources
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var sources = await _context.IncomeSources
            .AsNoTracking()
            .ToListAsync();

        return Ok(sources);
    }

    // POST: api/incomesources
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateIncomeSourceDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
        {
            return BadRequest("Название источника дохода не может быть пустым.");
        }

        // Проверяем существование пользователя
        var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
        if (!userExists)
        {
            return BadRequest("Пользователь не найден.");
        }

        var source = new IncomeSource
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            UserId = dto.UserId
        };

        _context.IncomeSources.Add(source);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = source.Id }, source);
    }
}

public class CreateIncomeSourceDto
{
    public string Name { get; set; } = string.Empty;
    public Guid UserId { get; set; }
}