const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Producto = sequelize.define(
  'Producto',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoria_id: { type: DataTypes.INTEGER, allowNull: true },
    nombre: { type: DataTypes.STRING(120), allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    imagen_url: { type: DataTypes.STRING(255) },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: 'productos',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
  }
);

module.exports = Producto;
