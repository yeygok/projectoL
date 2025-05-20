const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');

// Rutas CRUD para perfil sin protección con token
router.get('/', perfilController.getAllPerfiles);
router.get('/:id', perfilController.getPerfilById);
router.post('/', perfilController.createPerfil);
router.put('/:id', perfilController.updatePerfil);
router.delete('/:id', perfilController.deletePerfil);

module.exports = router;
