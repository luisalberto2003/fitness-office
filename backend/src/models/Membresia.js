const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Membresia = sequelize.define(
  'Membresia',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: { type: DataTypes.STRING(80), allowNull: false },
    descripcion: { type: DataTypes.STRING(255) },
    duracion_dias: { type: DataTypes.INTEGER, allowNull: false },
    precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: 'membresias',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
  }
);

module.exports = Membresia;
