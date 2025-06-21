import { useState, useEffect } from 'react';

/**
 * Returns a debounced version of `value` that only updates
 * after `delay` milliseconds of no changes.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounced;
}
