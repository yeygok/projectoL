const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rutas públicas (sin autenticación)
router.get('/', serviceController.getAllServices);
router.get('/:id', serviceController.getServiceById);

// Rutas privadas (requieren autenticación - solo admin)
router.post('/', authMiddleware, serviceController.createService);
router.put('/:id', authMiddleware, serviceController.updateService);
router.delete('/:id', authMiddleware, serviceController.deleteService);

module.exports = router;
