const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Ruta temporal para prueba de conexión y consulta simple
router.get('/test-users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Usuarios LIMIT 5');
    res.json(rows);
  } catch (error) {
    console.error('Error en ruta test-users:', error.message);
    res.status(500).json({ error: 'Error en prueba de usuarios' });
  }
});



// Importar solo rutas que existen
const authRoutes = require('./auth');
const serviceRoutes = require('./service');
const perfilRoutes = require('./perfil');
const clienteRoutes = require('./cliente');
const agendamientoRoutes = require('./agendamiento');
const dashboardRoutes = require('./dashboard');
const rolRoutes = require('./rol');
const permisoRoutes = require('./permiso');
const rolPermisoRoutes = require('./rol_permiso');
const tipoServicioRoutes = require('./tipo_servicio');
const categoriaRoutes = require('./categoria');
const estadoReservaRoutes = require('./estado_reserva');

// GRUPO 1 - Nuevas rutas
const calificacionesRoutes = require('./calificaciones');
const historialServiciosRoutes = require('./historial_servicios');
const notificacionesRoutes = require('./notificaciones');
const soporteRoutes = require('./soporte');

// GRUPO 2 - Nuevas rutas
const ordenesCompraRoutes = require('./ordenes_compra');
const estadosSoporteRoutes = require('./estados_soporte');
const tokensRoutes = require('./tokens');

// Configurar rutas
router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/perfil', perfilRoutes); // Cambiar de /perfiles a /perfil para que coincida con el frontend
router.use('/clientes', clienteRoutes);
router.use('/agendamiento', agendamientoRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/roles', rolRoutes);
router.use('/permisos', permisoRoutes);
router.use('/rol-permisos', rolPermisoRoutes);
router.use('/tipos-servicio', tipoServicioRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/categorias-servicio', categoriaRoutes); // Alias para compatibilidad con frontend
router.use('/estados-reserva', estadoReservaRoutes);

// GRUPO 1 - Configurar nuevas rutas
router.use('/calificaciones', calificacionesRoutes);
router.use('/historial-servicios', historialServiciosRoutes);
router.use('/notificaciones', notificacionesRoutes);
router.use('/soporte', soporteRoutes);

// GRUPO 2 - Configurar nuevas rutas
router.use('/ordenes-compra', ordenesCompraRoutes);
router.use('/estados-soporte', estadosSoporteRoutes);
router.use('/tokens', tokensRoutes);

module.exports = router;
