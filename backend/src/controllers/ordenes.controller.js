const { sequelize, Orden, DetalleOrden, Producto } = require('../models');

// POST /api/ordenes
// body: { direccion_entrega, items: [{ producto_id, cantidad }] }
async function crear(req, res) {
  const { direccion_entrega, items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ mensaje: 'La orden debe incluir al menos un producto.' });
  }

  const t = await sequelize.transaction();
  try {
    let total = 0;
    const detalles = [];

    // Se valida stock y se calcula el total dentro de la transacción
    // para evitar condiciones de carrera que generen sobreventa.
    for (const item of items) {
      const producto = await Producto.findByPk(item.producto_id, { transaction: t, lock: t.LOCK.UPDATE });

      if (!producto || !producto.activo) {
        throw new Error(`El producto ${item.producto_id} no está disponible.`);
      }
      if (producto.stock < item.cantidad) {
        throw new Error(`Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stock}.`);
      }

      const subtotal = Number(producto.precio) * item.cantidad;
      total += subtotal;

      detalles.push({
        producto_id: producto.id,
        cantidad: item.cantidad,
        precio_unitario: producto.precio,
        subtotal,
      });

      await producto.decrement('stock', { by: item.cantidad, transaction: t });
    }

    const orden = await Orden.create(
      {
        usuario_id: req.usuario.id,
        estado: 'pendiente',
        total,
        direccion_entrega,
      },
      { transaction: t }
    );

    for (const detalle of detalles) {
      await DetalleOrden.create({ ...detalle, orden_id: orden.id }, { transaction: t });
    }

    await t.commit();

    const ordenCompleta = await Orden.findByPk(orden.id, {
      include: [{ model: DetalleOrden, as: 'detalles', include: [{ model: Producto, as: 'producto' }] }],
    });

    res.status(201).json(ordenCompleta);
  } catch (error) {
    await t.rollback();
    res.status(400).json({ mensaje: error.message });
  }
}

// GET /api/ordenes/mis-pedidos (cliente autenticado)
async function misPedidos(req, res) {
  const ordenes = await Orden.findAll({
    where: { usuario_id: req.usuario.id },
    include: [{ model: DetalleOrden, as: 'detalles', include: [{ model: Producto, as: 'producto' }] }],
    order: [['fecha', 'DESC']],
  });
  res.json(ordenes);
}

// GET /api/ordenes (admin - todas las órdenes)
async function listarTodas(req, res) {
  const ordenes = await Orden.findAll({
    include: [{ model: DetalleOrden, as: 'detalles', include: [{ model: Producto, as: 'producto' }] }],
    order: [['fecha', 'DESC']],
  });
  res.json(ordenes);
}

// PUT /api/ordenes/:id/estado (admin)
async function actualizarEstado(req, res) {
  const orden = await Orden.findByPk(req.params.id);
  if (!orden) return res.status(404).json({ mensaje: 'Orden no encontrada.' });
  await orden.update({ estado: req.body.estado });
  res.json(orden);
}

module.exports = { crear, misPedidos, listarTodas, actualizarEstado };
