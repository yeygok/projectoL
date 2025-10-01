const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Middleware de autenticación para todas las rutas del dashboard
router.use(authMiddleware);

// ============= DASHBOARD PRINCIPAL =============
router.get('/stats', dashboardController.getDashboardStats);
router.get('/recent-reservas', dashboardController.getRecentReservas);

// ============= GESTIÓN DE USUARIOS =============
router.get('/usuarios', dashboardController.getAllUsers);
router.post('/usuarios', dashboardController.createUser);
router.put('/usuarios/:id', dashboardController.updateUser);
router.delete('/usuarios/:id', dashboardController.deleteUser);

// ============= GESTIÓN DE SERVICIOS =============
router.get('/servicios', dashboardController.getAllServices);
router.post('/servicios', dashboardController.createService);
router.put('/servicios/:id', dashboardController.updateService);
router.delete('/servicios/:id', dashboardController.deleteService);

// ============= GESTIÓN DE UBICACIONES =============
router.get('/ubicaciones', dashboardController.getAllUbicaciones);
router.post('/ubicaciones', dashboardController.createUbicacion);
router.put('/ubicaciones/:id', dashboardController.updateUbicacion);
router.delete('/ubicaciones/:id', dashboardController.deleteUbicacion);

// ============= GESTIÓN DE VEHÍCULOS =============
router.get('/vehiculos', dashboardController.getAllVehiculos);
router.post('/vehiculos', dashboardController.createVehiculo);
router.put('/vehiculos/:id', dashboardController.updateVehiculo);
router.delete('/vehiculos/:id', dashboardController.deleteVehiculo);

// ============= DATOS AUXILIARES =============
router.get('/roles', dashboardController.getRoles);
router.get('/categorias', dashboardController.getCategorias);
router.get('/tipos-servicio', dashboardController.getTiposServicio);
router.get('/estados-reserva', dashboardController.getEstadosReserva);

module.exports = router;
