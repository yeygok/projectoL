const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Ruta temporal para prueba de conexión y consulta simple
router.get('/test-users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuario LIMIT 5');
    res.json(rows);
  } catch (error) {
    console.error('Error en ruta test-users:', error.message);
    res.status(500).json({ error: 'Error en prueba de usuarios' });
  }
});

const userRoutes = require('./user');
const productRoutes = require('./product');
const serviceRoutes = require('./service');
const authRoutes = require('./auth');
const perfilRoutes = require('./perfil');
const clienteRoutes = require('./cliente');
const direccionRoutes = require('./direccion');
const agendamientoRoutes = require('./agendamiento');

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/services', serviceRoutes);
router.use('/auth', authRoutes);
router.use('/perfiles', perfilRoutes);
router.use('/cliente', clienteRoutes);
router.use('/direccion', direccionRoutes);
router.use('/agendamiento', agendamientoRoutes);

module.exports = router;
