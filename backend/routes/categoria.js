const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

/**
 * Rutas para gestión de Categorías de Servicios
 * 
 * Rutas públicas (lectura):
 *   - GET /api/categorias
 *   - GET /api/categorias/:id
 * 
 * Rutas protegidas (admin only):
 *   - POST /api/categorias
 *   - PUT /api/categorias/:id
 *   - DELETE /api/categorias/:id
 *   - PUT /api/categorias/:id/reactivar
 */

// ============= RUTAS PÚBLICAS (Lectura) =============
// Cualquier usuario puede consultar categorías (sin autenticación para el frontend)
router.get('/', categoriaController.getAllCategorias);
router.get('/:id', categoriaController.getCategoriaById);

// ============= RUTAS PROTEGIDAS (Admin Only) =============
// Solo administradores pueden crear, modificar o eliminar
router.post('/', authMiddleware, isAdmin, categoriaController.createCategoria);
router.put('/:id', authMiddleware, isAdmin, categoriaController.updateCategoria);
router.delete('/:id', authMiddleware, isAdmin, categoriaController.deleteCategoria);
router.put('/:id/reactivar', authMiddleware, isAdmin, categoriaController.reactivarCategoria);

module.exports = router;
