const express = require('express');
const router = express.Router();
const estadoOrdenController = require('../controllers/estadoOrdenController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', estadoOrdenController.getAllEstadoOrdenes);
router.get('/:id', estadoOrdenController.getEstadoOrdenById);
router.post('/', estadoOrdenController.createEstadoOrden);
router.put('/:id', estadoOrdenController.updateEstadoOrden);
router.delete('/:id', estadoOrdenController.deleteEstadoOrden);

module.exports = router;
