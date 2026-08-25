const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Pago = sequelize.define(
  'Pago',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    socio_membresia_id: { type: DataTypes.INTEGER, allowNull: false },
    monto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    fecha_pago: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    metodo_pago: {
      type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia'),
      defaultValue: 'efectivo',
    },
    estado: {
      type: DataTypes.ENUM('pagado', 'pendiente', 'anulado'),
      defaultValue: 'pagado',
    },
  },
  {
    tableName: 'pagos',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
  }
);

module.exports = Pago;
