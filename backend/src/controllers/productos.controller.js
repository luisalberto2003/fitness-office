const { Producto, CategoriaProducto } = require('../models');

// GET /api/productos  (público - catálogo)
async function listar(req, res) {
  const { categoria_id } = req.query;
  const where = { activo: true };
  if (categoria_id) where.categoria_id = categoria_id;

  const productos = await Producto.findAll({
    where,
    include: [{ model: CategoriaProducto, as: 'categoria' }],
    order: [['nombre', 'ASC']],
  });
  res.json(productos);
}

// GET /api/productos/:id
async function obtener(req, res) {
  const producto = await Producto.findByPk(req.params.id, {
    include: [{ model: CategoriaProducto, as: 'categoria' }],
  });
  if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
  res.json(producto);
}

// POST /api/productos (admin)
async function crear(req, res) {
  try {
    const producto = await Producto.create(req.body);
    res.status(201).json(producto);
  } catch (error) {
    res.status(400).json({ mensaje: 'No se pudo crear el producto.', error: error.message });
  }
}

// PUT /api/productos/:id (admin)
async function actualizar(req, res) {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
  await producto.update(req.body);
  res.json(producto);
}

// DELETE /api/productos/:id (admin) - baja lógica
async function eliminar(req, res) {
  const producto = await Producto.findByPk(req.params.id);
  if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado.' });
  await producto.update({ activo: false });
  res.json({ mensaje: 'Producto dado de baja.' });
}

module.exports = { listar, obtener, crear, actualizar, eliminar };
