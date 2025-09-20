const express = require('express');
const router = express.Router();
const rolPermisoController = require('../controllers/rolPermisoController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', rolPermisoController.getAllRolPermisos);
router.get('/:id', rolPermisoController.getRolPermisoById);
router.post('/', rolPermisoController.createRolPermiso);
router.put('/:id', rolPermisoController.updateRolPermiso);
router.delete('/:id', rolPermisoController.deleteRolPermiso);

module.exports = router;
