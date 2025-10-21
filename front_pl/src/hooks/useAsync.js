import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para manejar operaciones asíncronas con estados de loading, error y data
 * @param {Function} asyncFunction - Función asíncrona a ejecutar
 * @param {boolean} immediate - Si debe ejecutarse inmediatamente (default: true)
 * @returns {Object} Estado de la operación asíncrona
 */
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // La función execute envuelve asyncFunction y maneja el estado
  const execute = useCallback(
    async (...params) => {
      setStatus('pending');
      setData(null);
      setError(null);

      try {
        const response = await asyncFunction(...params);
        setData(response);
        setStatus('success');
        return response;
      } catch (error) {
        setError(error);
        setStatus('error');
        throw error;
      }
    },
    [asyncFunction]
  );

  // Llamar execute si immediate es true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',
  };
};
