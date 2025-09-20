const express = require('express');
const router = express.Router();
const tipoContratoController = require('../controllers/tipoContratoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', tipoContratoController.getAllTipoContratos);
router.get('/:id', tipoContratoController.getTipoContratoById);
router.post('/', tipoContratoController.createTipoContrato);
router.put('/:id', tipoContratoController.updateTipoContrato);
router.delete('/:id', tipoContratoController.deleteTipoContrato);

module.exports = router;
