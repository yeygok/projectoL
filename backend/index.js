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
app.use('/api/perfil', require('./routes/perfil'));
app.use('/api/service', require('./routes/service'));
app.use('/api/permiso', require('./routes/permiso'));
app.use('/api/rol', require('./routes/rol'));
app.use('/api/rol_permiso', require('./routes/rol_permiso'));
app.use('/api/tipo_servicio', require('./routes/tipo_servicio'));
app.use('/dashboard', require('./routes/dashboard'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
