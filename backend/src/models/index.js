const sequelize = require('../config/db');

const Usuario = require('./Usuario');
const Socio = require('./Socio');
const Membresia = require('./Membresia');
const SocioMembresia = require('./SocioMembresia');
const Pago = require('./Pago');
const Asistencia = require('./Asistencia');
const CategoriaProducto = require('./CategoriaProducto');
const Producto = require('./Producto');
const Orden = require('./Orden');
const DetalleOrden = require('./DetalleOrden');

// Usuario 1:1 Socio (un usuario del portal puede tener un perfil de socio)
Usuario.hasOne(Socio, { foreignKey: 'usuario_id' });
Socio.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Socio 1:N SocioMembresia (historial de membresías contratadas)
Socio.hasMany(SocioMembresia, { foreignKey: 'socio_id', as: 'membresias' });
SocioMembresia.belongsTo(Socio, { foreignKey: 'socio_id' });

// Membresia 1:N SocioMembresia
Membresia.hasMany(SocioMembresia, { foreignKey: 'membresia_id' });
SocioMembresia.belongsTo(Membresia, { foreignKey: 'membresia_id' });

// SocioMembresia 1:N Pago
SocioMembresia.hasMany(Pago, { foreignKey: 'socio_membresia_id', as: 'pagos' });
Pago.belongsTo(SocioMembresia, { foreignKey: 'socio_membresia_id' });

// Socio 1:N Asistencia
Socio.hasMany(Asistencia, { foreignKey: 'socio_id', as: 'asistencias' });
Asistencia.belongsTo(Socio, { foreignKey: 'socio_id' });

// CategoriaProducto 1:N Producto
CategoriaProducto.hasMany(Producto, { foreignKey: 'categoria_id' });
Producto.belongsTo(CategoriaProducto, { foreignKey: 'categoria_id', as: 'categoria' });

// Usuario 1:N Orden
Usuario.hasMany(Orden, { foreignKey: 'usuario_id' });
Orden.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Orden 1:N DetalleOrden
Orden.hasMany(DetalleOrden, { foreignKey: 'orden_id', as: 'detalles' });
DetalleOrden.belongsTo(Orden, { foreignKey: 'orden_id' });

// Producto 1:N DetalleOrden
Producto.hasMany(DetalleOrden, { foreignKey: 'producto_id' });
DetalleOrden.belongsTo(Producto, { foreignKey: 'producto_id', as: 'producto' });

module.exports = {
  sequelize,
  Usuario,
  Socio,
  Membresia,
  SocioMembresia,
  Pago,
  Asistencia,
  CategoriaProducto,
  Producto,
  Orden,
  DetalleOrden,
};
