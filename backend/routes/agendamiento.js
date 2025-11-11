const express = require('express');
const router = express.Router();
const agendamientoController = require('../controllers/agendamientoController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rutas PÚBLICAS (sin autenticación)
router.get('/disponibilidad', agendamientoController.checkDisponibilidad);

// Rutas PRIVADAS (requieren autenticación)
// Rutas de testing
router.get('/test-email', authMiddleware, agendamientoController.testEmail);

// Rutas específicas primero (sin parámetros)
router.get('/cliente/:clienteId', authMiddleware, agendamientoController.getReservasByCliente);

// Rutas con parámetros después
router.get('/:id/detalle', authMiddleware, agendamientoController.getAgendamientoDetalle);
router.get('/:id', authMiddleware, agendamientoController.getAgendamientoById);

// Rutas CRUD principales
router.get('/', authMiddleware, agendamientoController.getAllAgendamientos);
router.post('/', authMiddleware, agendamientoController.createAgendamiento);
router.put('/:id', authMiddleware, agendamientoController.updateAgendamiento);
router.delete('/:id', authMiddleware, agendamientoController.deleteAgendamiento);

module.exports = router;
