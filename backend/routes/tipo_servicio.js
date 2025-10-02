const express = require('express');
const router = express.Router();
const tipoServicioController = require('../controllers/tipoServicioController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

/**
 * Rutas para gestión de Tipos de Servicio
 * 
 * Rutas públicas (lectura):
 *   - GET /api/tipos-servicio
 *   - GET /api/tipos-servicio/:id
 * 
 * Rutas protegidas (admin only):
 *   - POST /api/tipos-servicio
 *   - PUT /api/tipos-servicio/:id
 *   - DELETE /api/tipos-servicio/:id
 */

// ============= RUTAS PÚBLICAS (Lectura) =============
router.get('/', tipoServicioController.getAllTipos);
router.get('/:id', tipoServicioController.getTipoById);

// ============= RUTAS PROTEGIDAS (Admin Only) =============
router.post('/', authMiddleware, isAdmin, tipoServicioController.createTipo);
router.put('/:id', authMiddleware, isAdmin, tipoServicioController.updateTipo);
router.delete('/:id', authMiddleware, isAdmin, tipoServicioController.deleteTipo);

module.exports = router;
