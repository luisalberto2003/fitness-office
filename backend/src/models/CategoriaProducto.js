const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CategoriaProducto = sequelize.define(
  'CategoriaProducto',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: { type: DataTypes.STRING(80), allowNull: false, unique: true },
  },
  {
    tableName: 'categorias_producto',
    timestamps: false,
  }
);

module.exports = CategoriaProducto;
