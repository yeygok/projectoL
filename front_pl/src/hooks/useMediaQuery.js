import { useState, useEffect } from 'react';

/**
 * Hook personalizado para media queries
 * @param {string} query - Media query string (ej: '(min-width: 768px)')
 * @returns {boolean} Si la media query coincide
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia(query);
    
    // Handler para cambios
    const handler = (event) => setMatches(event.matches);
    
    // Establecer el valor inicial
    setMatches(mediaQuery.matches);
    
    // Listener moderno
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback para navegadores antiguos
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
};

// Hooks de utilidad específicos
export const useIsMobile = () => useMediaQuery('(max-width: 600px)');
export const useIsTablet = () => useMediaQuery('(min-width: 601px) and (max-width: 960px)');
export const useIsDesktop = () => useMediaQuery('(min-width: 961px)');
