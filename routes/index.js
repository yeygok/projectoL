const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middlewares/auth');
const { register, login } = require('../controllers/authController');
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService
} = require('../controllers/serviceController');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Rutas de autenticación
router.post('/register', register);
router.post('/login', login);

// Rutas de servicios
router.get('/services', getAllServices);
router.get('/services/:id', getServiceById);
router.post('/services', auth, adminAuth, createService);
router.put('/services/:id', auth, adminAuth, updateService);
router.delete('/services/:id', auth, adminAuth, deleteService);

// Rutas de productos
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', auth, adminAuth, createProduct);
router.put('/products/:id', auth, adminAuth, updateProduct);
router.delete('/products/:id', auth, adminAuth, deleteProduct);

module.exports = router;
