const express = require('express');
const router = express.Router();
const tipoDocumentoController = require('../controllers/tipoDocumentoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', tipoDocumentoController.getAllTipoDocumentos);
router.get('/:id', tipoDocumentoController.getTipoDocumentoById);
router.post('/', tipoDocumentoController.createTipoDocumento);
router.put('/:id', tipoDocumentoController.updateTipoDocumento);
router.delete('/:id', tipoDocumentoController.deleteTipoDocumento);

module.exports = router;
