// US Currency and number formatting utilities

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatPercent = (number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number / 100);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(number);
};

// Validate currency input (allows numbers and decimals only)
export const validateCurrencyInput = (value) => {
  const regex = /^\d*\.?\d{0,2}$/;
  return regex.test(value);
};

// Convert annual interest rate to monthly rate
export const getMonthlyRate = (annualRate) => {
  return (annualRate / 100) / 12;
}; 