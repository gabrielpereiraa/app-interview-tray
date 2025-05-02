export function formatCurrency(value: number, locale = 'pt-BR', currency = 'BRL'): string {
  if (isNaN(value)) return '-';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
}

export function formatDate(
  date: string | number | Date,
  locale = 'pt-BR',
  options: Intl.DateTimeFormatOptions = {}
): string {
  if (!date) return '-';

  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  };

  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return '-';

  return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(dateObj);
}
