const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configuración de rutas
const apiRoutes = require('./routes');
app.use('/api', apiRoutes);

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
