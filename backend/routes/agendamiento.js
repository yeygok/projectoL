const express = require('express');
const router = express.Router();
const agendamientoController = require('../controllers/agendamientoController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas específicas primero (sin parámetros)
router.get('/disponibilidad', agendamientoController.checkDisponibilidad);

// Rutas con parámetros después
router.get('/:id/detalle', agendamientoController.getAgendamientoDetalle);
router.get('/:id', agendamientoController.getAgendamientoById);

// Rutas CRUD principales
router.get('/', agendamientoController.getAllAgendamientos);
router.post('/', agendamientoController.createAgendamiento);
router.put('/:id', agendamientoController.updateAgendamiento);
router.delete('/:id', agendamientoController.deleteAgendamiento);

module.exports = router;
