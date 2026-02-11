/**
 * Formats a number as INR currency with proper Indian locale formatting
 * @param amount - The numeric amount to format
 * @returns Formatted INR string with ₹ symbol
 */
export function formatInr(amount: number): string {
  if (!isFinite(amount)) {
    return '₹0.00';
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
