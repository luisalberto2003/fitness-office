const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DetalleOrden = sequelize.define(
  'DetalleOrden',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    orden_id: { type: DataTypes.INTEGER, allowNull: false },
    producto_id: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    tableName: 'detalle_ordenes',
    timestamps: false,
  }
);

module.exports = DetalleOrden;
