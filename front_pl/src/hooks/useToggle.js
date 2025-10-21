import { useState, useCallback } from 'react';

/**
 * Hook para manejar estados booleanos con toggle
 * @param {boolean} initialValue - Valor inicial (default: false)
 * @returns {[boolean, Function, Function, Function]} [value, toggle, setTrue, setFalse]
 */
export const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse];
};
