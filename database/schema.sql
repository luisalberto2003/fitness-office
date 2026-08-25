-- =====================================================================
-- SISTEMA WEB DE GESTIÓN DE CLIENTES Y E-COMMERCE DE SUPLEMENTOS
-- FITNESS OFFICE
-- Esquema de base de datos relacional (PostgreSQL)
-- Autor: Luis Alberto Velasco Ortiz
-- =====================================================================

CREATE TYPE rol_usuario AS ENUM ('administrador', 'cliente');
CREATE TYPE estado_socio AS ENUM ('activo', 'inactivo');
CREATE TYPE estado_membresia AS ENUM ('activo', 'vencido', 'suspendido');
CREATE TYPE metodo_pago AS ENUM ('efectivo', 'tarjeta', 'transferencia');
CREATE TYPE estado_pago AS ENUM ('pagado', 'pendiente', 'anulado');
CREATE TYPE estado_orden AS ENUM ('pendiente', 'pagado', 'enviado', 'entregado', 'cancelado');

-- ---------------------------------------------------------------------
-- Usuarios del sistema (autenticación y control de acceso por rol)
-- ---------------------------------------------------------------------
CREATE TABLE usuarios (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(120) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    rol             rol_usuario NOT NULL DEFAULT 'cliente',
    activo          BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_en  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Socios del gimnasio (clientes)
-- ---------------------------------------------------------------------
CREATE TABLE socios (
    id                  SERIAL PRIMARY KEY,
    usuario_id          INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
    nombres             VARCHAR(100) NOT NULL,
    apellidos           VARCHAR(100) NOT NULL,
    cedula              VARCHAR(20) NOT NULL UNIQUE,
    telefono            VARCHAR(20),
    email               VARCHAR(150),
    fecha_nacimiento    DATE,
    fecha_registro      DATE NOT NULL DEFAULT CURRENT_DATE,
    estado              estado_socio NOT NULL DEFAULT 'activo',
    creado_en           TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Catálogo de planes de membresía
-- ---------------------------------------------------------------------
CREATE TABLE membresias (
    id              SERIAL PRIMARY KEY,
    nombre          VARCHAR(80) NOT NULL,
    descripcion     VARCHAR(255),
    duracion_dias   INTEGER NOT NULL CHECK (duracion_dias > 0),
    precio          NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
    activo          BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_en  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Historial de membresías contratadas por cada socio
-- ---------------------------------------------------------------------
CREATE TABLE socio_membresias (
    id              SERIAL PRIMARY KEY,
    socio_id        INTEGER NOT NULL REFERENCES socios(id) ON DELETE CASCADE,
    membresia_id    INTEGER NOT NULL REFERENCES membresias(id),
    fecha_inicio    DATE NOT NULL,
    fecha_fin       DATE NOT NULL,
    estado          estado_membresia NOT NULL DEFAULT 'activo',
    creado_en       TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_en  TIMESTAMP NOT NULL DEFAULT NOW(),
    CHECK (fecha_fin >= fecha_inicio)
);

-- ---------------------------------------------------------------------
-- Pagos asociados a una membresía contratada
-- ---------------------------------------------------------------------
CREATE TABLE pagos (
    id                    SERIAL PRIMARY KEY,
    socio_membresia_id    INTEGER NOT NULL REFERENCES socio_membresias(id) ON DELETE CASCADE,
    monto                 NUMERIC(10,2) NOT NULL CHECK (monto >= 0),
    fecha_pago            DATE NOT NULL DEFAULT CURRENT_DATE,
    metodo_pago           metodo_pago NOT NULL DEFAULT 'efectivo',
    estado                estado_pago NOT NULL DEFAULT 'pagado',
    creado_en             TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_en        TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Control de asistencia (ingresos) de los socios al gimnasio
-- ---------------------------------------------------------------------
CREATE TABLE asistencias (
    id          SERIAL PRIMARY KEY,
    socio_id    INTEGER NOT NULL REFERENCES socios(id) ON DELETE CASCADE,
    fecha_hora  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Categorías de productos (suplementos)
-- ---------------------------------------------------------------------
CREATE TABLE categorias_producto (
    id      SERIAL PRIMARY KEY,
    nombre  VARCHAR(80) NOT NULL UNIQUE
);

-- ---------------------------------------------------------------------
-- Catálogo de productos (suplementos nutricionales)
-- ---------------------------------------------------------------------
CREATE TABLE productos (
    id              SERIAL PRIMARY KEY,
    categoria_id    INTEGER REFERENCES categorias_producto(id),
    nombre          VARCHAR(120) NOT NULL,
    descripcion     TEXT,
    precio          NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
    stock           INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    imagen_url      VARCHAR(255),
    activo          BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en       TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_en  TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Órdenes de compra (e-commerce)
-- ---------------------------------------------------------------------
CREATE TABLE ordenes (
    id                  SERIAL PRIMARY KEY,
    usuario_id          INTEGER NOT NULL REFERENCES usuarios(id),
    fecha               TIMESTAMP NOT NULL DEFAULT NOW(),
    estado              estado_orden NOT NULL DEFAULT 'pendiente',
    total               NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    direccion_entrega   VARCHAR(255),
    creado_en           TIMESTAMP NOT NULL DEFAULT NOW(),
    actualizado_en      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- Detalle de cada orden (líneas de pedido)
-- ---------------------------------------------------------------------
CREATE TABLE detalle_ordenes (
    id                  SERIAL PRIMARY KEY,
    orden_id            INTEGER NOT NULL REFERENCES ordenes(id) ON DELETE CASCADE,
    producto_id         INTEGER NOT NULL REFERENCES productos(id),
    cantidad            INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario     NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal            NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0)
);

-- ---------------------------------------------------------------------
-- Índices recomendados para mejorar el rendimiento de las consultas
-- ---------------------------------------------------------------------
CREATE INDEX idx_socios_cedula ON socios(cedula);
CREATE INDEX idx_socio_membresias_socio ON socio_membresias(socio_id);
CREATE INDEX idx_socio_membresias_estado ON socio_membresias(estado);
CREATE INDEX idx_pagos_socio_membresia ON pagos(socio_membresia_id);
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_ordenes_usuario ON ordenes(usuario_id);
CREATE INDEX idx_detalle_ordenes_orden ON detalle_ordenes(orden_id);
