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

// Configurar rutas
router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/perfiles', perfilRoutes);
router.use('/clientes', clienteRoutes);
router.use('/agendamiento', agendamientoRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/roles', rolRoutes);
router.use('/permisos', permisoRoutes);
router.use('/rol-permisos', rolPermisoRoutes);
router.use('/tipos-servicio', tipoServicioRoutes);

module.exports = router;
