require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const sequelize = require('./config/db');
require('./models'); // registra asociaciones

const authRoutes = require('./routes/auth.routes');
const sociosRoutes = require('./routes/socios.routes');
const membresiasRoutes = require('./routes/membresias.routes');
const pagosRoutes = require('./routes/pagos.routes');
const productosRoutes = require('./routes/productos.routes');
const ordenesRoutes = require('./routes/ordenes.routes');
const reportesRoutes = require('./routes/reportes.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok', servicio: 'Fitness Office API', hora: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/socios', sociosRoutes);
app.use('/api/membresias', membresiasRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/reportes', reportesRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

const PORT = process.env.PORT || 4000;

async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log(`Conexión a base de datos (${process.env.DB_DIALECT}) establecida correctamente.`);

    // En desarrollo se sincroniza el esquema automáticamente.
    // En producción se recomienda usar migraciones (ver database/schema.sql).
    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Servidor Fitness Office API escuchando en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error('No se pudo iniciar el servidor:', error);
    process.exit(1);
  }
}

iniciar();

module.exports = app;
