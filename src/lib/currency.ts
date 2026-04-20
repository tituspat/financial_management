export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  if (currency === 'IDR') {
    return `Rp${amount.toLocaleString('id-ID')}`;
  }
  return `$${amount.toFixed(2)}`;
}

export function formatCurrencyCompact(amount: number, currency: string = 'IDR'): string {
  if (currency === 'IDR') {
    if (amount >= 1000000) {
      return `Rp${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `Rp${(amount / 1000).toFixed(1)}K`;
    }
  }
  return formatCurrency(amount, currency);
}
