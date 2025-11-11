const express = require('express');
const router = express.Router();
const calificacionController = require('../controllers/calificacionController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================

// Listar todas las calificaciones
router.get('/', calificacionController.getAllCalificaciones);

// Calificaciones por servicio
router.get('/servicio/:servicioId', calificacionController.getCalificacionesByServicio);

// Calificaciones por técnico
router.get('/tecnico/:tecnicoId', calificacionController.getCalificacionesByTecnico);

// ============================================
// RUTAS PRIVADAS (requieren autenticación)
// ============================================

// Obtener calificación por ID (privado)
router.get('/:id', authMiddleware, calificacionController.getCalificacionById);

// Crear calificación (cliente autenticado)
router.post('/', authMiddleware, calificacionController.createCalificacion);

// Actualizar calificación (solo owner)
router.put('/:id', authMiddleware, calificacionController.updateCalificacion);

// Eliminar calificación (solo admin)
router.delete('/:id', authMiddleware, isAdmin, calificacionController.deleteCalificacion);

module.exports = router;
