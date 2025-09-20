const express = require('express');
const router = express.Router();
const tipoServicioProductoController = require('../controllers/tipoServicioProductoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', tipoServicioProductoController.getAllTipoServicioProductos);
router.get('/:id', tipoServicioProductoController.getTipoServicioProductoById);
router.post('/', tipoServicioProductoController.createTipoServicioProducto);
router.put('/:id', tipoServicioProductoController.updateTipoServicioProducto);
router.delete('/:id', tipoServicioProductoController.deleteTipoServicioProducto);

module.exports = router;
