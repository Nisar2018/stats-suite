/**
 * Format a number for display, trimming unnecessary trailing zeros.
 * Values are unchanged; only the string presentation is cleaned
 * (e.g. 5.0000 → "5", 12.5000 → "12.5").
 */
export function formatNum(n, decimals = 4) {
  if (n == null || !Number.isFinite(Number(n))) return '—';
  const num = Number(n);
  if (Number.isInteger(num)) return String(num);
  return String(parseFloat(num.toFixed(decimals)));
}
