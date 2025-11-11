const express = require('express');
const router = express.Router();
const historialController = require('../controllers/historialServicioController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// ============================================
// TODAS LAS RUTAS SON PRIVADAS
// ============================================

// Listar todos los historiales (Admin/Tecnico)
router.get('/', authMiddleware, historialController.getAllHistoriales);

// Obtener historial por ID (Admin/Tecnico/Cliente owner)
router.get('/:id', authMiddleware, historialController.getHistorialById);

// Historial por reserva (Admin/Tecnico/Cliente owner)
router.get('/reserva/:reservaId', authMiddleware, historialController.getHistorialByReserva);

// Crear historial (Tecnico asignado)
router.post('/', authMiddleware, historialController.createHistorial);

// Actualizar historial (Tecnico owner/Admin)
router.put('/:id', authMiddleware, historialController.updateHistorial);

// Eliminar historial (Admin)
router.delete('/:id', authMiddleware, isAdmin, historialController.deleteHistorial);

module.exports = router;
