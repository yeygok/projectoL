/**
 * Utilidades para el proceso de booking.
 * Contiene funciones auxiliares para formateo, cálculos y lógica compartida.
 */

// Importar imágenes
import colchonImg from '../../assets/img/colchon.jpg';
import sofaImg from '../../assets/img/sofa.png';
import tapeteImg from '../../assets/img/tapete.jpg';
import vehiculoImg from '../../assets/img/vehiculo.jpg';

/**
 * Obtiene la imagen correspondiente a una categoría de servicio.
 * @param {string} nombreCategoria - Nombre de la categoría
 * @returns {string} Ruta de la imagen
 */
export function getCategoriaImage(nombreCategoria) {
  const nombre = nombreCategoria.toLowerCase();
  if (nombre.includes('colchon')) return colchonImg;
  if (nombre.includes('mueble') || nombre.includes('sofá') || nombre.includes('sofa')) return sofaImg;
  if (nombre.includes('alfombra') || nombre.includes('tapete')) return tapeteImg;
  if (nombre.includes('vehículo') || nombre.includes('vehiculo') || nombre.includes('auto')) return vehiculoImg;
  return sofaImg; // Imagen por defecto
}

/**
 * Formatea un precio en formato colombiano (COP).
 * @param {number} price - Precio a formatear
 * @returns {string} Precio formateado
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
}

/**
 * Obtiene la categoría seleccionada desde la lista.
 * @param {Array} categorias - Lista de categorías
 * @param {number} categoriaId - ID de la categoría seleccionada
 * @returns {Object|null} Categoría encontrada o null
 */
export function getSelectedCategoria(categorias, categoriaId) {
  return categorias.find(c => c.id === categoriaId) || null;
}

/**
 * Obtiene el tipo de servicio seleccionado desde la lista.
 * @param {Array} tiposServicio - Lista de tipos de servicio
 * @param {number} tipoId - ID del tipo seleccionado
 * @returns {Object|null} Tipo encontrado o null
 */
export function getSelectedTipo(tiposServicio, tipoId) {
  return tiposServicio.find(t => t.id === tipoId) || null;
}

/**
 * Constantes para los pasos del stepper.
 * Facilita la referencia y evita hardcodear números.
 */
export const STEPS = [
  'Seleccionar Servicio',
  'Tipo de Servicio',
  'Fecha y Hora',
  'Datos de Ubicación',
  'Confirmar',
];

/**
 * Verifica si una fecha es futura (mayor a la actual).
 * @param {Date} date - Fecha a verificar
 * @returns {boolean} True si es futura
 */
export function isFutureDate(date) {
  return date > new Date();
}