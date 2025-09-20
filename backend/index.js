const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/agendamiento', require('./routes/agendamiento'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cliente', require('./routes/cliente'));
app.use('/api/direccion', require('./routes/direccion'));
app.use('/api/perfil', require('./routes/perfil'));
app.use('/api/product', require('./routes/product'));
app.use('/api/service', require('./routes/service'));
app.use('/api/user', require('./routes/user'));
app.use('/api/permiso', require('./routes/permiso'));
app.use('/api/rol', require('./routes/rol'));
app.use('/api/rol_modulo', require('./routes/rol_modulo'));
app.use('/api/rol_permiso', require('./routes/rol_permiso'));
app.use('/api/tipo_contrato', require('./routes/tipo_contrato'));
app.use('/api/tipo_documento', require('./routes/tipo_documento'));
app.use('/api/tipo_servicio', require('./routes/tipo_servicio'));
app.use('/api/tipo_servicio_producto', require('./routes/tipo_servicio_producto'));
app.use('/api/estado_orden', require('./routes/estado_orden'));
app.use('/api/estado_usuario', require('./routes/estado_usuario'));
app.use('/dashboard', require('./routes/dashboard'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
