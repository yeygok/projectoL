/**
 * Constantes centralizadas de la aplicación
 * Mejor práctica: mantener todos los valores constantes en un solo lugar
 */

// Roles del sistema
export const ROLES = {
  ADMIN: 'admin',
  CLIENTE: 'cliente',
  TECNICO: 'tecnico',
  SOPORTE: 'soporte',
};

// Estados de reservas
export const ESTADO_RESERVA = {
  PENDIENTE: 'pendiente',
  CONFIRMADA: 'confirmada',
  EN_PROCESO: 'en_proceso',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada',
};

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CLIENTE: {
    BASE: '/cliente',
    DASHBOARD: '/cliente',
    PERFIL: '/cliente/perfil',
    RESERVAR: '/cliente/reservar',
    RESERVAS: '/cliente/reservas',
  },
  ADMIN: {
    BASE: '/dashboard',
    USUARIOS: '/dashboard/usuarios',
    SERVICIOS: '/dashboard/servicios',
    RESERVAS: '/dashboard/reservas',
    REPORTES: '/dashboard/reportes',
  },
};

// Configuración de la API
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
};

// Configuración de WhatsApp
export const WHATSAPP_CONFIG = {
  PHONE: '573001234567',
  DEFAULT_MESSAGE: 'Hola! Quiero información sobre Mega Lavado',
  getUrl: (message = '') => {
    const msg = message || WHATSAPP_CONFIG.DEFAULT_MESSAGE;
    return `https://wa.me/${WHATSAPP_CONFIG.PHONE}?text=${encodeURIComponent(msg)}`;
  },
};

// Validaciones de formularios
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\d\s\-\+\(\)]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  ONLY_LETTERS: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
  ONLY_NUMBERS: /^\d+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  REQUIRED: 'Este campo es requerido',
  EMAIL_INVALID: 'Ingrese un correo electrónico válido',
  PHONE_INVALID: 'Ingrese un número de teléfono válido',
  PASSWORD_WEAK: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  PASSWORD_MISMATCH: 'Las contraseñas no coinciden',
  GENERIC_ERROR: 'Ocurrió un error inesperado',
  NETWORK_ERROR: 'Error de conexión. Verifique su internet',
  UNAUTHORIZED: 'No tiene permisos para realizar esta acción',
  SESSION_EXPIRED: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente',
};

// Mensajes de éxito comunes
export const SUCCESS_MESSAGES = {
  SAVE: 'Guardado exitosamente',
  UPDATE: 'Actualizado exitosamente',
  DELETE: 'Eliminado exitosamente',
  LOGIN: 'Inicio de sesión exitoso',
  REGISTER: 'Registro exitoso',
  LOGOUT: 'Sesión cerrada exitosamente',
  BOOKING: 'Reserva creada exitosamente',
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
};

// Configuración de animaciones
export const ANIMATIONS = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    EASE_OUT: 'cubic-bezier(0.0, 0, 0.2, 1)',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
  },
};

// Breakpoints de Material-UI
export const BREAKPOINTS = {
  XS: 0,
  SM: 600,
  MD: 960,
  LG: 1280,
  XL: 1920,
};

// Storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Colores del tema
export const THEME_COLORS = {
  PRIMARY: '#667eea',
  SECONDARY: '#764ba2',
  SUCCESS: '#43e97b',
  WARNING: '#ffd700',
  ERROR: '#f44336',
  INFO: '#4facfe',
};

// Límites de archivos
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
};

// Configuración de fechas
export const DATE_CONFIG = {
  FORMAT: {
    DISPLAY: 'dd/MM/yyyy',
    API: 'yyyy-MM-dd',
    DATETIME: 'dd/MM/yyyy HH:mm',
  },
  LOCALE: 'es',
};

export default {
  ROLES,
  ESTADO_RESERVA,
  ROUTES,
  API_CONFIG,
  WHATSAPP_CONFIG,
  VALIDATION_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  ANIMATIONS,
  BREAKPOINTS,
  STORAGE_KEYS,
  THEME_COLORS,
  FILE_LIMITS,
  DATE_CONFIG,
};
