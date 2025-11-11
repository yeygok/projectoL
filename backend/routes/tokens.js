const express = require('express');
const router = express.Router();
const tokensController = require('../controllers/tokensController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// ============================================
// TODAS LAS RUTAS SON PRIVADAS (Solo Admin)
// ============================================

// Ver tokens activos
router.get('/activos', authMiddleware, isAdmin, tokensController.getTokensActivos);

// Estadísticas de tokens
router.get('/estadisticas', authMiddleware, isAdmin, tokensController.getEstadisticasTokens);

// Tokens de un usuario específico
router.get('/usuario/:usuarioId', authMiddleware, isAdmin, tokensController.getTokensByUsuario);

// Invalidar todos los tokens de un usuario
router.delete('/usuario/:usuarioId', authMiddleware, isAdmin, tokensController.invalidarTokensUsuario);

// Limpiar tokens expirados (Admin/Cron)
router.delete('/limpiar-expirados', authMiddleware, isAdmin, tokensController.limpiarTokensExpirados);

module.exports = router;
