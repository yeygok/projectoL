/**
 * Funciones de validación para formularios
 */

import { VALIDATION_PATTERNS, ERROR_MESSAGES } from './constants';

/**
 * Validador de campo requerido
 * @param {*} value - Valor a validar
 * @param {string} customMessage - Mensaje personalizado
 * @returns {string|null} Mensaje de error o null
 */
export const required = (value, customMessage) => {
  if (value === null || value === undefined || value === '' || 
      (Array.isArray(value) && value.length === 0)) {
    return customMessage || ERROR_MESSAGES.REQUIRED;
  }
  return null;
};

/**
 * Validador de email
 * @param {string} value - Email a validar
 * @param {string} customMessage - Mensaje personalizado
 * @returns {string|null} Mensaje de error o null
 */
export const email = (value, customMessage) => {
  if (!value) return null;
  if (!VALIDATION_PATTERNS.EMAIL.test(value)) {
    return customMessage || ERROR_MESSAGES.EMAIL_INVALID;
  }
  return null;
};

/**
 * Validador de teléfono
 * @param {string} value - Teléfono a validar
 * @param {string} customMessage - Mensaje personalizado
 * @returns {string|null} Mensaje de error o null
 */
export const phone = (value, customMessage) => {
  if (!value) return null;
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length < 10) {
    return customMessage || ERROR_MESSAGES.PHONE_INVALID;
  }
  return null;
};

/**
 * Validador de contraseña fuerte
 * @param {string} value - Contraseña a validar
 * @param {string} customMessage - Mensaje personalizado
 * @returns {string|null} Mensaje de error o null
 */
export const strongPassword = (value, customMessage) => {
  if (!value) return null;
  if (!VALIDATION_PATTERNS.PASSWORD.test(value)) {
    return customMessage || ERROR_MESSAGES.PASSWORD_WEAK;
  }
  return null;
};

/**
 * Validador de longitud mínima
 * @param {number} min - Longitud mínima
 * @returns {Function} Función validadora
 */
export const minLength = (min) => (value, customMessage) => {
  if (!value) return null;
  if (value.length < min) {
    return customMessage || `Debe tener al menos ${min} caracteres`;
  }
  return null;
};

/**
 * Validador de longitud máxima
 * @param {number} max - Longitud máxima
 * @returns {Function} Función validadora
 */
export const maxLength = (max) => (value, customMessage) => {
  if (!value) return null;
  if (value.length > max) {
    return customMessage || `No puede tener más de ${max} caracteres`;
  }
  return null;
};

/**
 * Validador de coincidencia con otro campo
 * @param {string} fieldName - Nombre del campo a comparar
 * @param {*} compareValue - Valor a comparar
 * @returns {Function} Función validadora
 */
export const matches = (fieldName, compareValue) => (value, customMessage) => {
  if (!value) return null;
  if (value !== compareValue) {
    return customMessage || `No coincide con ${fieldName}`;
  }
  return null;
};

/**
 * Validador de valor mínimo numérico
 * @param {number} min - Valor mínimo
 * @returns {Function} Función validadora
 */
export const minValue = (min) => (value, customMessage) => {
  if (value === null || value === undefined) return null;
  if (Number(value) < min) {
    return customMessage || `El valor debe ser al menos ${min}`;
  }
  return null;
};

/**
 * Validador de valor máximo numérico
 * @param {number} max - Valor máximo
 * @returns {Function} Función validadora
 */
export const maxValue = (max) => (value, customMessage) => {
  if (value === null || value === undefined) return null;
  if (Number(value) > max) {
    return customMessage || `El valor no puede ser mayor que ${max}`;
  }
  return null;
};

/**
 * Validador de patrón regex
 * @param {RegExp} pattern - Patrón regex
 * @param {string} errorMessage - Mensaje de error
 * @returns {Function} Función validadora
 */
export const pattern = (patternRegex, errorMessage) => (value) => {
  if (!value) return null;
  if (!patternRegex.test(value)) {
    return errorMessage || 'El formato no es válido';
  }
  return null;
};

/**
 * Validador de solo letras
 * @param {string} value - Valor a validar
 * @param {string} customMessage - Mensaje personalizado
 * @returns {string|null} Mensaje de error o null
 */
export const onlyLetters = (value, customMessage) => {
  if (!value) return null;
  if (!VALIDATION_PATTERNS.ONLY_LETTERS.test(value)) {
    return customMessage || 'Solo se permiten letras';
  }
  return null;
};

/**
 * Validador de solo números
 * @param {string} value - Valor a validar
 * @param {string} customMessage - Mensaje personalizado
 * @returns {string|null} Mensaje de error o null
 */
export const onlyNumbers = (value, customMessage) => {
  if (!value) return null;
  if (!VALIDATION_PATTERNS.ONLY_NUMBERS.test(value)) {
    return customMessage || 'Solo se permiten números';
  }
  return null;
};

/**
 * Validador de URL
 * @param {string} value - URL a validar
 * @param {string} customMessage - Mensaje personalizado
 * @returns {string|null} Mensaje de error o null
 */
export const url = (value, customMessage) => {
  if (!value) return null;
  try {
    new URL(value);
    return null;
  } catch {
    return customMessage || 'Ingrese una URL válida';
  }
};

/**
 * Validador de fecha en el futuro
 * @param {Date|string} value - Fecha a validar
 * @param {string} customMessage - Mensaje personalizado
 * @returns {string|null} Mensaje de error o null
 */
export const futureDate = (value, customMessage) => {
  if (!value) return null;
  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date < today) {
    return customMessage || 'La fecha debe ser en el futuro';
  }
  return null;
};

/**
 * Validador de fecha en el pasado
 * @param {Date|string} value - Fecha a validar
 * @param {string} customMessage - Mensaje personalizado
 * @returns {string|null} Mensaje de error o null
 */
export const pastDate = (value, customMessage) => {
  if (!value) return null;
  const date = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date > today) {
    return customMessage || 'La fecha debe ser en el pasado';
  }
  return null;
};

/**
 * Composición de validadores
 * @param {...Function} validators - Funciones validadoras
 * @returns {Function} Función validadora compuesta
 */
export const composeValidators = (...validators) => (value, allValues) => {
  for (const validator of validators) {
    const error = validator(value, allValues);
    if (error) return error;
  }
  return null;
};

/**
 * Crea un objeto de reglas de validación para un formulario
 * @param {Object} rules - Reglas por campo
 * @returns {Object} Objeto de validación
 */
export const createValidationSchema = (rules) => {
  return Object.keys(rules).reduce((schema, field) => {
    schema[field] = (value, allValues) => {
      const fieldRules = rules[field];
      
      if (Array.isArray(fieldRules)) {
        return composeValidators(...fieldRules)(value, allValues);
      }
      
      return fieldRules(value, allValues);
    };
    
    return schema;
  }, {});
};

export default {
  required,
  email,
  phone,
  strongPassword,
  minLength,
  maxLength,
  matches,
  minValue,
  maxValue,
  pattern,
  onlyLetters,
  onlyNumbers,
  url,
  futureDate,
  pastDate,
  composeValidators,
  createValidationSchema,
};
