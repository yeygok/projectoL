const express = require('express');
const router = express.Router();
const estadoReservaController = require('../controllers/estadoReservaController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

/**
 * Rutas para gestión de Estados de Reserva
 * 
 * Rutas públicas (lectura):
 *   - GET /api/estados-reserva
 *   - GET /api/estados-reserva/:id
 *   - GET /api/estados-reserva/stats/resumen
 * 
 * Rutas protegidas (admin only):
 *   - POST /api/estados-reserva
 *   - PUT /api/estados-reserva/:id
 *   - DELETE /api/estados-reserva/:id
 */

// ============= RUTAS PÚBLICAS (Lectura) =============
// Cualquier usuario puede consultar estados (necesario para el flujo de reservas)
router.get('/stats/resumen', estadoReservaController.getEstadisticas);
router.get('/:id', estadoReservaController.getEstadoById);
router.get('/', estadoReservaController.getAllEstados);

// ============= RUTAS PROTEGIDAS (Admin Only) =============
// Solo administradores pueden crear, modificar o eliminar estados
router.post('/', authMiddleware, isAdmin, estadoReservaController.createEstado);
router.put('/:id', authMiddleware, isAdmin, estadoReservaController.updateEstado);
router.delete('/:id', authMiddleware, isAdmin, estadoReservaController.deleteEstado);

module.exports = router;
