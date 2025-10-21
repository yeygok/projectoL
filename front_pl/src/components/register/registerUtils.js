/**
 * Utilidades para el proceso de registro.
 * Contiene funciones de validación y constantes.
 */

/**
 * Constantes de validación para el formulario de registro.
 */
export const VALIDATION_RULES = {
  nombre: {
    required: true,
    minLength: 2,
    message: 'Este campo es requerido',
    minMessage: 'Debe tener al menos 2 caracteres',
  },
  apellido: {
    required: true,
    minLength: 2,
    message: 'Este campo es requerido',
    minMessage: 'Debe tener al menos 2 caracteres',
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'El email es requerido',
    invalidMessage: 'Email inválido',
  },
  telefono: {
    required: true,
    pattern: /^\d{10}$/,
    message: 'El teléfono es requerido',
    invalidMessage: 'Debe ser 10 dígitos',
  },
  password: {
    required: true,
    minLength: 6,
    message: 'La contraseña es requerida',
    minMessage: 'Mínimo 6 caracteres',
  },
  confirmPassword: {
    required: true,
    message: 'Confirma tu contraseña',
    mismatchMessage: 'Las contraseñas no coinciden',
  },
};

/**
 * Valida un campo individual según las reglas definidas.
 * @param {string} field - Nombre del campo
 * @param {string} value - Valor del campo
 * @param {Object} formData - Datos completos del formulario
 * @returns {Object} Resultado de validación { isValid, error }
 */
export function validateField(field, value, formData = {}) {
  const rules = VALIDATION_RULES[field];
  if (!rules) return { isValid: true, error: null };

  // Campo requerido
  if (rules.required && !value.trim()) {
    return { isValid: false, error: rules.message };
  }

  // Longitud mínima
  if (rules.minLength && value.length < rules.minLength) {
    return { isValid: false, error: rules.minMessage || `Mínimo ${rules.minLength} caracteres` };
  }

  // Patrón regex
  if (rules.pattern && !rules.pattern.test(value.replace(/\s/g, ''))) {
    return { isValid: false, error: rules.invalidMessage };
  }

  // Validación especial para confirmPassword
  if (field === 'confirmPassword' && value !== formData.password) {
    return { isValid: false, error: rules.mismatchMessage };
  }

  return { isValid: true, error: null };
}

/**
 * Valida todo el formulario.
 * @param {Object} formData - Datos del formulario
 * @param {boolean} acceptTerms - Si aceptó términos
 * @returns {Object} Resultado de validación { isValid, errors, generalError }
 */
export function validateForm(formData, acceptTerms) {
  const errors = {};
  let isValid = true;

  // Validar cada campo
  Object.keys(VALIDATION_RULES).forEach(field => {
    const result = validateField(field, formData[field], formData);
    if (!result.isValid) {
      errors[field] = result.error;
      isValid = false;
    }
  });

  // Validar términos y condiciones
  if (!acceptTerms) {
    return {
      isValid: false,
      errors,
      generalError: 'Debes aceptar los términos y condiciones'
    };
  }

  return { isValid, errors, generalError: null };
}