const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Orden = sequelize.define(
  'Orden',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'),
      defaultValue: 'pendiente',
    },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    direccion_entrega: { type: DataTypes.STRING(255) },
  },
  {
    tableName: 'ordenes',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
  }
);

module.exports = Orden;
