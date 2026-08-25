# Sistema Web de Gestión de Clientes y E-commerce de Suplementos — Fitness Office

Proyecto de titulación — Tecnología Superior en Desarrollo de Software (PUCE TEC)
Autor: Luis Alberto Velasco Ortiz

Sistema web full-stack para la gestión de socios/membresías de un gimnasio y la venta en
línea (e-commerce) de suplementos nutricionales, con control de inventario transaccional.

## Estructura del proyecto

```
proyecto/
├── backend/          API RESTful (Node.js + Express + Sequelize)
├── frontend/         Aplicación web (React + Vite + Tailwind CSS)
└── database/         schema.sql (PostgreSQL) — esquema de referencia para producción
```

## Tecnologías utilizadas

- **Frontend:** React 19, React Router, Axios, Tailwind CSS, Vite
- **Backend:** Node.js, Express, Sequelize ORM, JWT (jsonwebtoken), bcryptjs
- **Base de datos:** PostgreSQL en producción / SQLite en desarrollo local (mismo código, se
  cambia solo con una variable de entorno)

## 1. Requisitos previos

- Node.js 18 o superior
- npm

## 2. Cómo correr el backend (modo desarrollo, sin instalar nada de base de datos)

```bash
cd backend
npm install
cp .env.example .env
# .env ya viene configurado con DB_DIALECT=sqlite por defecto para desarrollo
npm run seed     # crea las tablas y datos de prueba
npm run dev      # levanta el servidor en http://localhost:4000
```

Cuentas creadas por el seed:

| Rol            | Email                     | Password     |
|----------------|---------------------------|--------------|
| Administrador  | admin@fitnessoffice.com   | Admin1234    |
| Cliente        | cliente@demo.com          | Cliente1234  |

## 3. Cómo correr el frontend

```bash
cd frontend
npm install
npm run dev      # levanta la app en http://localhost:5173
```

El frontend ya viene configurado (archivo `.env`) para apuntar a `http://localhost:4000/api`.

## 4. Despliegue en producción (PostgreSQL)

1. Crear una base de datos PostgreSQL (Railway, Render, Supabase, etc.).
2. En `backend/.env`, configurar:
   ```
   DB_DIALECT=postgres
   DATABASE_URL=postgres://usuario:password@host:5432/nombre_bd
   ```
3. Ejecutar `database/schema.sql` contra esa base de datos (o dejar que Sequelize la
   sincronice automáticamente al iniciar el servidor).
4. Desplegar `backend/` como servicio Node.js (Railway/Render).
5. Desplegar `frontend/` como sitio estático (Vercel/Netlify) ejecutando `npm run build` y
   configurando `VITE_API_URL` apuntando a la URL pública del backend.

## 5. Funcionalidades principales

- Autenticación JWT con dos roles: administrador y cliente.
- CRUD de socios, asignación y renovación de membresías, verificación automática de
  vencimientos.
- Registro de pagos por membresía.
- Catálogo público de productos (suplementos) con categorías.
- Carrito de compras y checkout con **control transaccional de inventario** (bloqueo de fila)
  para evitar sobreventas ante compras simultáneas.
- Panel administrativo con reportes de ingresos, stock bajo, membresías vencidas, etc.

## 6. Lo que falta para producción real

Este proyecto está pensado como una base sólida y funcional para el sustento de la tesis.
Antes de usarlo con clientes reales del gimnasio, se recomienda:

- Conectar una pasarela de pago real (Stripe, PayPhone, etc.) en lugar del registro manual de pagos.
- Configurar HTTPS y variables de entorno seguras (JWT_SECRET distinto al de ejemplo).
- Agregar pruebas automatizadas (Jest / React Testing Library).
- Configurar backups automáticos de la base de datos.
