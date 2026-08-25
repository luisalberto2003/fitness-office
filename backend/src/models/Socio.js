const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Socio = sequelize.define(
  'Socio',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // permite crear socios sin cuenta de acceso al portal
    },
    nombres: { type: DataTypes.STRING(100), allowNull: false },
    apellidos: { type: DataTypes.STRING(100), allowNull: false },
    cedula: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    telefono: { type: DataTypes.STRING(20) },
    email: { type: DataTypes.STRING(150) },
    fecha_nacimiento: { type: DataTypes.DATEONLY },
    fecha_registro: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    estado: {
      type: DataTypes.ENUM('activo', 'inactivo'),
      defaultValue: 'activo',
    },
  },
  {
    tableName: 'socios',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
  }
);

module.exports = Socio;
