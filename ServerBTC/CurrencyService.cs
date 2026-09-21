using System.Text.Json;
using System.Text.Json.Serialization;

namespace ServerBTC.Services;

public interface ICurrencyService
{
    Task<decimal> GetExchangeRateAsync(string currencyCode);
}

public class CurrencyService : ICurrencyService
{
    private readonly HttpClient _httpClient;

    public CurrencyService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<decimal> GetExchangeRateAsync(string currencyCode)
    {
        var code = currencyCode.ToUpper();

        // Грыня
        if (code == "UAH") return 1.0m;

        try
        {
            // Запрос
            var response = await _httpClient.GetAsync($"https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode={code}&json");

            if (!response.IsSuccessStatusCode)
                return 1.0m;

            var json = await response.Content.ReadAsStringAsync();
            var rates = JsonSerializer.Deserialize<List<NbuRateDto>>(json);

            var rate = rates?.FirstOrDefault();
            return rate?.Rate ?? 1.0m;
        }
        catch
        {
            
            return 1.0m;
        }
    }

    private class NbuRateDto
    {
        [JsonPropertyName("rate")]
        public decimal Rate { get; set; }

        [JsonPropertyName("cc")]
        public string CurrencyCode { get; set; } = string.Empty;
    }
}