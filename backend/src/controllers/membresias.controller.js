const { Membresia, SocioMembresia } = require('../models');

async function listar(req, res) {
  const membresias = await Membresia.findAll({ order: [['precio', 'ASC']] });

  // Para cada plan, indicamos si algún socio lo ha contratado alguna vez.
  // Esto le permite al panel decidir si puede borrarse por completo o solo desactivarse.
  const conHistorial = await Promise.all(
    membresias.map(async (m) => {
      const usos = await SocioMembresia.count({ where: { membresia_id: m.id } });
      return { ...m.toJSON(), tiene_historial: usos > 0 };
    })
  );

  res.json(conHistorial);
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

// DELETE /api/membresias/:id
// Si ningún socio ha contratado nunca este plan, se elimina por completo.
// Si ya tiene historial de socios asociados, se desactiva (borrado lógico)
// para no perder el registro de quién lo tuvo.
async function eliminar(req, res) {
  const membresia = await Membresia.findByPk(req.params.id);
  if (!membresia) return res.status(404).json({ mensaje: 'Membresía no encontrada.' });

  const usos = await SocioMembresia.count({ where: { membresia_id: membresia.id } });

  if (usos === 0) {
    await membresia.destroy();
    return res.json({ mensaje: 'Membresía eliminada definitivamente.', eliminada: true });
  }

  await membresia.update({ activo: false });
  res.json({ mensaje: 'Este plan ya tiene socios asociados, así que se desactivó en lugar de eliminarse (se conserva su historial).', eliminada: false });
}

module.exports = { listar, crear, actualizar, eliminar };
