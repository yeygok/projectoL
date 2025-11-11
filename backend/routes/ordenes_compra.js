const express = require('express');
const router = express.Router();
const ordenesCompraController = require('../controllers/ordenesCompraController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// ============================================
// TODAS LAS RUTAS SON PRIVADAS
// ============================================

// Listar órdenes (Admin: todas, Cliente: solo sus órdenes)
router.get('/', authMiddleware, ordenesCompraController.getAllOrdenes);

// Obtener orden por ID
router.get('/:id', authMiddleware, ordenesCompraController.getOrdenById);

// Obtener orden por reserva
router.get('/reserva/:reservaId', authMiddleware, ordenesCompraController.getOrdenByReserva);

// Crear orden (solo admin)
router.post('/', authMiddleware, isAdmin, ordenesCompraController.createOrden);

// Actualizar orden (solo admin)
router.put('/:id', authMiddleware, isAdmin, ordenesCompraController.updateOrden);

// Eliminar orden (solo admin)
router.delete('/:id', authMiddleware, isAdmin, ordenesCompraController.deleteOrden);

module.exports = router;
