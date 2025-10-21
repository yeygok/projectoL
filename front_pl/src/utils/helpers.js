/**
 * Funciones de utilidad y helpers reutilizables
 */

/**
 * Formatea un número de teléfono
 * @param {string} phone - Número de teléfono
 * @returns {string} Número formateado
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

/**
 * Formatea un valor monetario
 * @param {number} value - Valor a formatear
 * @param {string} currency - Moneda (default: COP)
 * @returns {string} Valor formateado
 */
export const formatCurrency = (value, currency = 'COP') => {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Formatea una fecha
 * @param {Date|string} date - Fecha a formatear
 * @param {string} format - Formato deseado
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, format = 'dd/MM/yyyy') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  switch (format) {
    case 'dd/MM/yyyy':
      return `${day}/${month}/${year}`;
    case 'yyyy-MM-dd':
      return `${year}-${month}-${day}`;
    case 'dd/MM/yyyy HH:mm':
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    default:
      return d.toLocaleDateString('es-CO');
  }
};

/**
 * Capitaliza la primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Capitaliza cada palabra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} String con cada palabra capitalizada
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(capitalize).join(' ');
};

/**
 * Trunca un texto a una longitud específica
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo (default: '...')
 * @returns {string} Texto truncado
 */
export const truncate = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + suffix;
};

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} Si el email es válido
 */
export const isValidEmail = (email) => {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
};

/**
 * Valida un teléfono
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} Si el teléfono es válido
 */
export const isValidPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10;
};

/**
 * Remueve acentos de un string
 * @param {string} str - String con acentos
 * @returns {string} String sin acentos
 */
export const removeAccents = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

/**
 * Busca en un array de objetos
 * @param {Array} array - Array a buscar
 * @param {string} searchTerm - Término de búsqueda
 * @param {Array<string>} fields - Campos donde buscar
 * @returns {Array} Array filtrado
 */
export const searchInArray = (array, searchTerm, fields) => {
  if (!searchTerm) return array;
  
  const term = removeAccents(searchTerm.toLowerCase());
  
  return array.filter((item) => {
    return fields.some((field) => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], item);
      if (!value) return false;
      return removeAccents(String(value).toLowerCase()).includes(term);
    });
  });
};

/**
 * Ordena un array de objetos
 * @param {Array} array - Array a ordenar
 * @param {string} field - Campo por el cual ordenar
 * @param {string} order - Orden ('asc' o 'desc')
 * @returns {Array} Array ordenado
 */
export const sortArray = (array, field, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aValue = field.split('.').reduce((obj, key) => obj?.[key], a);
    const bValue = field.split('.').reduce((obj, key) => obj?.[key], b);
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Agrupa un array de objetos por un campo
 * @param {Array} array - Array a agrupar
 * @param {string} field - Campo por el cual agrupar
 * @returns {Object} Objeto con los grupos
 */
export const groupBy = (array, field) => {
  return array.reduce((groups, item) => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], item);
    const group = value || 'undefined';
    groups[group] = groups[group] || [];
    groups[group].push(item);
    return groups;
  }, {});
};

/**
 * Retrasa la ejecución de una función
 * @param {number} ms - Milisegundos de retraso
 * @returns {Promise} Promesa que se resuelve después del retraso
 */
export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} Si se copió exitosamente
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Error al copiar al portapapeles:', err);
    return false;
  }
};

/**
 * Obtiene las iniciales de un nombre
 * @param {string} name - Nombre completo
 * @returns {string} Iniciales
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Genera un color aleatorio basado en un string
 * @param {string} str - String base
 * @returns {string} Color hexadecimal
 */
export const stringToColor = (str) => {
  if (!str) return '#667eea';
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  
  return color;
};

/**
 * Descarga un archivo
 * @param {Blob|string} data - Datos del archivo
 * @param {string} filename - Nombre del archivo
 * @param {string} mimeType - Tipo MIME
 */
export const downloadFile = (data, filename, mimeType) => {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Calcula el tiempo transcurrido desde una fecha
 * @param {Date|string} date - Fecha
 * @returns {string} Tiempo transcurrido en formato legible
 */
export const timeAgo = (date) => {
  if (!date) return '';
  
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60,
    segundo: 1,
  };
  
  for (const [name, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `hace ${interval} ${name}${interval > 1 ? (name === 'mes' ? 'es' : 's') : ''}`;
    }
  }
  
  return 'justo ahora';
};

/**
 * Valida el tamaño de un archivo
 * @param {File} file - Archivo a validar
 * @param {number} maxSize - Tamaño máximo en bytes
 * @returns {boolean} Si el archivo es válido
 */
export const isValidFileSize = (file, maxSize = 5 * 1024 * 1024) => {
  return file && file.size <= maxSize;
};

/**
 * Valida el tipo de un archivo
 * @param {File} file - Archivo a validar
 * @param {Array<string>} allowedTypes - Tipos permitidos
 * @returns {boolean} Si el archivo es válido
 */
export const isValidFileType = (file, allowedTypes) => {
  return file && allowedTypes.includes(file.type);
};

/**
 * Convierte un archivo a base64
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>} String base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export default {
  formatPhone,
  formatCurrency,
  formatDate,
  capitalize,
  capitalizeWords,
  truncate,
  generateId,
  isValidEmail,
  isValidPhone,
  removeAccents,
  searchInArray,
  sortArray,
  groupBy,
  sleep,
  copyToClipboard,
  getInitials,
  stringToColor,
  downloadFile,
  timeAgo,
  isValidFileSize,
  isValidFileType,
  fileToBase64,
};
