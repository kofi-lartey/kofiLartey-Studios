export const formatCurrency = (value, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(Number(value || 0));
};

export const formatDate = (value, options = {}) => {
  if (!value) return '—';

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options
  }).format(date);
};

export const formatNumber = (value, options = {}) => {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    ...options
  }).format(Number(value || 0));
};

export const formatPercent = (value, digits = 0) => {
  return `${formatNumber(value, { maximumFractionDigits: digits })}%`;
};
