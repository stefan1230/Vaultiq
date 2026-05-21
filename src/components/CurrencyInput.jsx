import React, { useState, useEffect, useRef } from 'react';
import { formatAmountInput, parseAmountInput, sanitizeAmountInput } from '../utils/format';

/**
 * Text input with thousand separators and optional decimals (max 2).
 * onChange receives a number, or null when empty.
 */
export default function CurrencyInput({ value, onChange, placeholder, style, className }) {
  const [display, setDisplay] = useState('');
  const focused = useRef(false);

  useEffect(() => {
    if (focused.current) return;
    if (value === null || value === undefined || value === '') {
      setDisplay('');
    } else if (!isNaN(Number(value))) {
      setDisplay(formatAmountInput(String(value)));
    }
  }, [value]);

  const handleChange = (e) => {
    const sanitized = sanitizeAmountInput(e.target.value);
    if (sanitized === null) return;

    const formatted = formatAmountInput(sanitized);
    setDisplay(formatted);

    const parsed = parseAmountInput(formatted);
    onChange(isNaN(parsed) ? null : parsed);
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={display}
      onChange={handleChange}
      onFocus={() => { focused.current = true; }}
      onBlur={() => {
        focused.current = false;
        if (value !== null && value !== undefined && value !== '' && !isNaN(Number(value))) {
          setDisplay(formatAmountInput(String(value)));
        }
      }}
      placeholder={placeholder}
      style={style}
      className={`tabular${className ? ` ${className}` : ''}`}
    />
  );
}
