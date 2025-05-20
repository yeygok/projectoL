const express = require('express');
const router = express.Router();
const agendamientoController = require('../controllers/agendamientoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', agendamientoController.getAllAgendamientos);
router.get('/:id', agendamientoController.getAgendamientoById);
router.post('/', agendamientoController.createAgendamiento);
router.put('/:id', agendamientoController.updateAgendamiento);
router.delete('/:id', agendamientoController.deleteAgendamiento);

module.exports = router;
