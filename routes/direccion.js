const express = require('express');
const router = express.Router();
const direccionController = require('../controllers/direccionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', direccionController.getAllDirecciones);
router.get('/:id', direccionController.getDireccionById);
router.post('/', direccionController.createDireccion);
router.put('/:id', direccionController.updateDireccion);
router.delete('/:id', direccionController.deleteDireccion);

module.exports = router;
