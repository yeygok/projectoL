const express = require('express');
const router = express.Router();
const estadoUsuarioController = require('../controllers/estadoUsuarioController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', estadoUsuarioController.getAllEstadoUsuarios);
router.get('/:id', estadoUsuarioController.getEstadoUsuarioById);
router.post('/', estadoUsuarioController.createEstadoUsuario);
router.put('/:id', estadoUsuarioController.updateEstadoUsuario);
router.delete('/:id', estadoUsuarioController.deleteEstadoUsuario);

module.exports = router;
