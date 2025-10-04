const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rutas protegidas - Usuario autenticado puede ver/editar su propio perfil
router.get('/me', authMiddleware, perfilController.getMyProfile);
router.put('/me', authMiddleware, perfilController.updateMyProfile);

// Rutas CRUD para perfil sin protección con token (legacy)
router.get('/', perfilController.getAllPerfiles);
router.get('/:id', perfilController.getPerfilById);
router.post('/', perfilController.createPerfil);
router.put('/:id', perfilController.updatePerfil);
router.delete('/:id', perfilController.deletePerfil);

module.exports = router;
