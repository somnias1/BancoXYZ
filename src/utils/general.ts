export const formatCurrency = (value: number, currency: string) => {
  try {
    const formatted = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
    }).format(value);
    return formatted;
  } catch (_) {
    const formatted = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
    }).format(value);
    return formatted;
  }
};

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(iso));
