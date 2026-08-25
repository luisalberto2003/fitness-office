const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SocioMembresia = sequelize.define(
  'SocioMembresia',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    socio_id: { type: DataTypes.INTEGER, allowNull: false },
    membresia_id: { type: DataTypes.INTEGER, allowNull: false },
    fecha_inicio: { type: DataTypes.DATEONLY, allowNull: false },
    fecha_fin: { type: DataTypes.DATEONLY, allowNull: false },
    estado: {
      type: DataTypes.ENUM('activo', 'vencido', 'suspendido'),
      defaultValue: 'activo',
    },
  },
  {
    tableName: 'socio_membresias',
    timestamps: true,
    createdAt: 'creado_en',
    updatedAt: 'actualizado_en',
  }
);

module.exports = SocioMembresia;
