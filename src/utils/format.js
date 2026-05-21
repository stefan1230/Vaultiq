export function formatLKR(amount) {
  const n = Number(amount);
  if (isNaN(n)) return 'LKR 0';
  const hasDecimals = Math.abs(n % 1) > 1e-9;
  return `LKR ${n.toLocaleString('en-US', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

/** Format a raw digit string for display (commas + optional decimals while typing). */
export function formatAmountInput(value) {
  if (value === '' || value === undefined || value === null) return '';

  const str = String(value).replace(/,/g, '');
  if (str === '.') return '0.';

  const hasDot = str.includes('.');
  const [intPart = '', decPart] = hasDot ? str.split('.') : [str.replace(/\D/g, '')];
  const intDigits = intPart.replace(/\D/g, '');
  const decDigits = decPart !== undefined ? decPart.replace(/\D/g, '').slice(0, 2) : undefined;

  const formattedInt = intDigits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (hasDot) {
    const base = formattedInt || '0';
    if (decDigits !== undefined) return `${base}.${decDigits}`;
    return `${base}.`;
  }

  return formattedInt;
}

/** Parse formatted input string to a number (NaN if empty/invalid). */
export function parseAmountInput(value) {
  if (value === '' || value === undefined || value === null) return NaN;
  const cleaned = String(value).replace(/,/g, '').trim();
  if (cleaned === '' || cleaned === '.') return NaN;
  const num = parseFloat(cleaned);
  return isNaN(num) ? NaN : num;
}

/** Sanitize user keystrokes to digits + one optional decimal (max 2 places). */
export function sanitizeAmountInput(raw) {
  const stripped = String(raw).replace(/,/g, '');
  if (stripped === '') return '';
  if (!/^\d*\.?\d{0,2}$/.test(stripped)) return null;
  return stripped;
}

export function formatMonthLabel(monthStr) {
  const [year, month] = monthStr.split('-');
  return new Date(year, parseInt(month) - 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export function pct(value, total) {
  if (!total) return 0;
  return Math.min(100, Math.max(0, (value / total) * 100));
}
