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
    cedula: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      validate: {
        isNumeric: { msg: 'La cédula debe contener solo números.' },
        len: { args: [10, 10], msg: 'La cédula debe tener exactamente 10 dígitos.' },
      },
    },
    telefono: {
      type: DataTypes.STRING(10),
      validate: {
        isNumeric: { msg: 'El teléfono debe contener solo números.' },
        len: { args: [7, 10], msg: 'El teléfono debe tener entre 7 y 10 dígitos.' },
      },
    },
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
