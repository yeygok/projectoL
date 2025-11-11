const express = require('express');
const router = express.Router();
const estadosSoporteController = require('../controllers/estadosSoporteController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// ============================================
// RUTAS PÚBLICAS
// ============================================

// Listar todos los estados
router.get('/', estadosSoporteController.getAllEstados);

// Obtener estado por ID
router.get('/:id', estadosSoporteController.getEstadoById);

// ============================================
// RUTAS PRIVADAS (Solo admin)
// ============================================

// Crear estado
router.post('/', authMiddleware, isAdmin, estadosSoporteController.createEstado);

// Actualizar estado
router.put('/:id', authMiddleware, isAdmin, estadosSoporteController.updateEstado);

// Eliminar estado
router.delete('/:id', authMiddleware, isAdmin, estadosSoporteController.deleteEstado);

module.exports = router;
