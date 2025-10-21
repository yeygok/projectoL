import { useEffect, useRef } from 'react';

/**
 * Hook para detectar clicks fuera de un elemento
 * @param {Function} handler - Función a ejecutar cuando se hace click fuera
 * @returns {React.RefObject} Ref para asignar al elemento
 */
export const useClickOutside = (handler) => {
  const ref = useRef(null);

  useEffect(() => {
    const listener = (event) => {
      // No hacer nada si se hace click en el elemento o sus hijos
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
};
