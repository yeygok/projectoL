const express = require('express');
const router = express.Router();
const soporteController = require('../controllers/soporteController');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');

// ============================================
// TODAS LAS RUTAS SON PRIVADAS
// ============================================

// Listar tickets (Admin: todos / Usuario: sus tickets)
router.get('/', authMiddleware, soporteController.getAllTickets);

// Tickets por prioridad (Admin)
router.get('/por-prioridad/:prioridad', authMiddleware, isAdmin, soporteController.getTicketsByPrioridad);

// Obtener ticket por ID (Admin o usuario owner)
router.get('/:id', authMiddleware, soporteController.getTicketById);

// Crear ticket (Usuario autenticado)
router.post('/', authMiddleware, soporteController.createTicket);

// Actualizar ticket - resolver/cambiar estado (Admin)
router.put('/:id', authMiddleware, isAdmin, soporteController.updateTicket);

// Eliminar ticket (Admin)
router.delete('/:id', authMiddleware, isAdmin, soporteController.deleteTicket);

module.exports = router;
