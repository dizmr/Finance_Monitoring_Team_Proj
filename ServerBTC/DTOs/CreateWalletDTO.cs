namespace ServerBTC.DTOs
{
    /*public class CreateWalletDTO
    {
        public string Name { get; set; } = string.Empty;
        public decimal InitialBalance { get; set; } = 0;
        public Guid UserId { get; set; }
        public Guid CurrencyId { get; set; }
    }*/
    public class CreateWalletDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal InitialBalance { get; set; }
        public Guid UserId { get; set; }
        public string CurrencyCode { get; set; } = "USD"; // Передаем "USD" или "UAH"
    }
}
