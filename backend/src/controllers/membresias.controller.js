const { Membresia } = require('../models');

async function listar(req, res) {
  const membresias = await Membresia.findAll({ order: [['precio', 'ASC']] });
  res.json(membresias);
}

async function crear(req, res) {
  try {
    const membresia = await Membresia.create(req.body);
    res.status(201).json(membresia);
  } catch (error) {
    res.status(400).json({ mensaje: 'No se pudo crear la membresía.', error: error.message });
  }
}

async function actualizar(req, res) {
  const membresia = await Membresia.findByPk(req.params.id);
  if (!membresia) return res.status(404).json({ mensaje: 'Membresía no encontrada.' });
  await membresia.update(req.body);
  res.json(membresia);
}

async function eliminar(req, res) {
  const membresia = await Membresia.findByPk(req.params.id);
  if (!membresia) return res.status(404).json({ mensaje: 'Membresía no encontrada.' });
  await membresia.update({ activo: false });
  res.json({ mensaje: 'Membresía desactivada.' });
}

module.exports = { listar, crear, actualizar, eliminar };
