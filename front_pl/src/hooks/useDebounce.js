import { useState, useEffect } from 'react';

/**
 * Hook para debouncing de valores (útil para búsquedas, inputs, etc.)
 * @param {*} value - Valor a hacer debounce
 * @param {number} delay - Delay en milisegundos (default: 500ms)
 * @returns {*} Valor con debounce aplicado
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Establecer timeout para actualizar el valor después del delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancelar el timeout si el valor cambia antes del delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
