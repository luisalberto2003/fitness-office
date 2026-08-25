const { Sequelize } = require('sequelize');
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'sqlite';

let sequelize;

if (dialect === 'postgres') {
  // Configuración para producción (PostgreSQL - Railway, Render, Supabase, etc.)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
      ssl:
        process.env.NODE_ENV === 'production'
          ? { require: true, rejectUnauthorized: false }
          : false,
    },
    logging: false,
  });
} else {
  // Configuración para desarrollo local (no requiere instalar un servidor de base de datos)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_PATH || './database.sqlite',
    logging: false,
  });
}

module.exports = sequelize;
