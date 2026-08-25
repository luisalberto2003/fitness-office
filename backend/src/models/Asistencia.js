const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Asistencia = sequelize.define(
  'Asistencia',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    socio_id: { type: DataTypes.INTEGER, allowNull: false },
    fecha_hora: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'asistencias',
    timestamps: false,
  }
);

module.exports = Asistencia;
