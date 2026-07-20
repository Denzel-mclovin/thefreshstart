export function formatAmount(amount: number, currency: string): string {
  const noDecimals = ["jpy", "krw"]; 
  const normalized = noDecimals.includes(currency.toLowerCase())
    ? amount
    : amount / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(normalized);
}