const express = require('express');
const router = express.Router();
const rolModuloController = require('../controllers/rolModuloController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', rolModuloController.getAllRolModulos);
router.get('/:id', rolModuloController.getRolModuloById);
router.post('/', rolModuloController.createRolModulo);
router.put('/:id', rolModuloController.updateRolModulo);
router.delete('/:id', rolModuloController.deleteRolModulo);

module.exports = router;
