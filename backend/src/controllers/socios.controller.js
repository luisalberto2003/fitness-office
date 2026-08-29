const { Socio, SocioMembresia, Membresia, Asistencia } = require('../models');

// GET /api/socios/me  (cliente autenticado consulta su propio perfil de socio)
async function obtenerPropio(req, res) {
  const socio = await Socio.findOne({
    where: { usuario_id: req.usuario.id },
    include: [{ model: SocioMembresia, as: 'membresias', include: [Membresia] }],
  });

  if (!socio) {
    // El usuario existe pero todavía no tiene un perfil de socio asociado
    // (por ejemplo, se registró sin indicar su cédula).
    return res.status(404).json({ mensaje: 'Todavía no tienes un perfil de socio registrado. Acércate al gimnasio para completar tu inscripción.' });
  }

  res.json(socio);
}

// GET /api/socios
async function listar(req, res) {
  const { busqueda } = req.query;
  const { Op } = require('sequelize');

  const where = busqueda
    ? {
        [Op.or]: [
          { nombres: { [Op.like]: `%${busqueda}%` } },
          { apellidos: { [Op.like]: `%${busqueda}%` } },
          { cedula: { [Op.like]: `%${busqueda}%` } },
        ],
      }
    : {};

  const socios = await Socio.findAll({
    where,
    include: [{ model: SocioMembresia, as: 'membresias', include: [Membresia] }],
    order: [['creado_en', 'DESC']],
  });
  res.json(socios);
}

// GET /api/socios/:id
async function obtener(req, res) {
  const socio = await Socio.findByPk(req.params.id, {
    include: [
      { model: SocioMembresia, as: 'membresias', include: [Membresia] },
      { model: Asistencia, as: 'asistencias' },
    ],
  });
  if (!socio) return res.status(404).json({ mensaje: 'Socio no encontrado.' });
  res.json(socio);
}

// POST /api/socios
// El teléfono es opcional: si llega vacío, se guarda como null para que
// las validaciones de formato (isNumeric/len) no se apliquen sobre "".
function normalizar(datos) {
  const copia = { ...datos };
  if (copia.telefono === '') copia.telefono = null;
  return copia;
}

async function crear(req, res) {
  try {
    const socio = await Socio.create(normalizar(req.body));
    res.status(201).json(socio);
  } catch (error) {
    res.status(400).json({ mensaje: 'No se pudo crear el socio.', error: error.message });
  }
}

// PUT /api/socios/:id
async function actualizar(req, res) {
  const socio = await Socio.findByPk(req.params.id);
  if (!socio) return res.status(404).json({ mensaje: 'Socio no encontrado.' });
  try {
    await socio.update(normalizar(req.body));
    res.json(socio);
  } catch (error) {
    res.status(400).json({ mensaje: 'No se pudo actualizar el socio.', error: error.message });
  }
}

// DELETE /api/socios/:id
async function eliminar(req, res) {
  const socio = await Socio.findByPk(req.params.id);
  if (!socio) return res.status(404).json({ mensaje: 'Socio no encontrado.' });
  await socio.update({ estado: 'inactivo' });
  res.json({ mensaje: 'Socio dado de baja correctamente.' });
}

// POST /api/socios/:id/membresias  -> asigna/renueva una membresía a un socio
async function asignarMembresia(req, res) {
  try {
    const { membresia_id, fecha_inicio } = req.body;
    const socio = await Socio.findByPk(req.params.id);
    if (!socio) return res.status(404).json({ mensaje: 'Socio no encontrado.' });

    const membresia = await Membresia.findByPk(membresia_id);
    if (!membresia) return res.status(404).json({ mensaje: 'Membresía no encontrada.' });

    const inicio = fecha_inicio ? new Date(fecha_inicio) : new Date();
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + membresia.duracion_dias);

    const socioMembresia = await SocioMembresia.create({
      socio_id: socio.id,
      membresia_id: membresia.id,
      fecha_inicio: inicio.toISOString().slice(0, 10),
      fecha_fin: fin.toISOString().slice(0, 10),
      estado: 'activo',
    });

    res.status(201).json(socioMembresia);
  } catch (error) {
    res.status(400).json({ mensaje: 'No se pudo asignar la membresía.', error: error.message });
  }
}

// POST /api/socios/:id/asistencias -> registra el ingreso de un socio
async function registrarAsistencia(req, res) {
  const socio = await Socio.findByPk(req.params.id);
  if (!socio) return res.status(404).json({ mensaje: 'Socio no encontrado.' });
  const asistencia = await Asistencia.create({ socio_id: socio.id });
  res.status(201).json(asistencia);
}

module.exports = {
  obtenerPropio,
  listar,
  obtener,
  crear,
  actualizar,
  eliminar,
  asignarMembresia,
  registrarAsistencia,
};
