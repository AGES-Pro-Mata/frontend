import { useEffect, useState } from "react";

/**
 * Hook genérico para debounce de valores
 * @param value - O valor a ser debounced
 * @param delay - O delay em milissegundos (padrão: 500ms)
 * @returns O valor debounced
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}
