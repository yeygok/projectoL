const express = require('express');
const router = express.Router();
const tipoServicioController = require('../controllers/tipoServicioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', tipoServicioController.getAllTipoServicios);
router.get('/:id', tipoServicioController.getTipoServicioById);
router.post('/', tipoServicioController.createTipoServicio);
router.put('/:id', tipoServicioController.updateTipoServicio);
router.delete('/:id', tipoServicioController.deleteTipoServicio);

module.exports = router;
