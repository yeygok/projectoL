const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// ============================================
// TODAS LAS RUTAS SON PRIVADAS
// ============================================

// Obtener mis notificaciones
router.get('/', authMiddleware, notificacionController.getMyNotificaciones);

// Obtener notificaciones no leídas
router.get('/no-leidas', authMiddleware, notificacionController.getNotificacionesNoLeidas);

// Marcar todas como leídas
router.put('/leer-todas', authMiddleware, notificacionController.marcarTodasComoLeidas);

// Obtener notificación por ID
router.get('/:id', authMiddleware, notificacionController.getNotificacionById);

// Marcar como leída
router.put('/:id/leer', authMiddleware, notificacionController.marcarComoLeida);

// Enviar notificación (Admin)
router.post('/', authMiddleware, isAdmin, notificacionController.enviarNotificacion);

// Enviar notificación masiva (Admin)
router.post('/broadcast', authMiddleware, isAdmin, notificacionController.enviarBroadcast);

// Eliminar notificación (Usuario owner o Admin)
router.delete('/:id', authMiddleware, notificacionController.deleteNotificacion);

module.exports = router;
