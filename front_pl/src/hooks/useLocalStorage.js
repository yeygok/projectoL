import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personalizado para manejar localStorage de forma reactiva y segura
 * @param {string} key - Clave del localStorage
 * @param {*} initialValue - Valor inicial si no existe la clave
 * @returns {[value, setValue, removeValue]} Array con valor, setter y remover
 */
export const useLocalStorage = (key, initialValue) => {
  // State para almacenar nuestro valor
  // Pasamos una función inicial a useState para que la lógica se ejecute solo una vez
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error al leer localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Devolver una versión envuelta de la función setter de useState que...
  // ...persiste el nuevo valor en localStorage
  const setValue = useCallback(
    (value) => {
      try {
        // Permitir que value sea una función para tener la misma API que useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        setStoredValue(valueToStore);
        
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error al guardar en localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Función para remover el valor
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error al eliminar de localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Escuchar cambios en localStorage de otras pestañas/ventanas
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error al parsear valor de storage para key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
};
