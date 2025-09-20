const express = require('express');
const router = express.Router();

const dashboardView = require('../viewsApi/dashboardView');
const usersView = require('../viewsApi/usersView');
const clientesView = require('../viewsApi/clientesView');
const productosView = require('../viewsApi/productosView');
const serviciosView = require('../viewsApi/serviciosView');
const agendamientosView = require('../viewsApi/agendamientosView');
const rolesView = require('../viewsApi/rolesView');
const permisosView = require('../viewsApi/permisosView');
const tiposView = require('../viewsApi/tiposView');
const perfilView = require('../viewsApi/perfilView');

router.get('/', dashboardView);
router.get('/usuarios', usersView);
router.get('/clientes', clientesView);
router.get('/productos', productosView);
router.get('/servicios', serviciosView);
router.get('/agendamientos', agendamientosView);
router.get('/roles', rolesView);
router.get('/permisos', permisosView);
router.get('/tipos', tiposView);
router.get('/perfil', perfilView);

module.exports = router;
