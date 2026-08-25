const { Pago, SocioMembresia, Socio, Membresia } = require('../models');

// GET /api/pagos
async function listar(req, res) {
  const pagos = await Pago.findAll({
    include: [
      {
        model: SocioMembresia,
        include: [{ model: Socio }, { model: Membresia }],
      },
    ],
    order: [['fecha_pago', 'DESC']],
  });
  res.json(pagos);
}

// POST /api/pagos
async function crear(req, res) {
  try {
    const { socio_membresia_id, monto, metodo_pago } = req.body;

    const socioMembresia = await SocioMembresia.findByPk(socio_membresia_id);
    if (!socioMembresia) {
      return res.status(404).json({ mensaje: 'La membresía del socio indicada no existe.' });
    }

    const pago = await Pago.create({
      socio_membresia_id,
      monto,
      metodo_pago,
      estado: 'pagado',
    });

    // Al registrar el pago, se reactiva la membresía si estaba suspendida.
    if (socioMembresia.estado === 'suspendido') {
      await socioMembresia.update({ estado: 'activo' });
    }

    res.status(201).json(pago);
  } catch (error) {
    res.status(400).json({ mensaje: 'No se pudo registrar el pago.', error: error.message });
  }
}

// GET /api/pagos/vencimientos -> tarea de verificación de membresías vencidas
async function verificarVencimientos(req, res) {
  const hoy = new Date().toISOString().slice(0, 10);
  const vencidas = await SocioMembresia.findAll({
    where: { estado: 'activo' },
  });

  const actualizadas = [];
  for (const sm of vencidas) {
    if (sm.fecha_fin < hoy) {
      await sm.update({ estado: 'vencido' });
      actualizadas.push(sm.id);
    }
  }

  res.json({ mensaje: 'Verificación completada.', membresias_vencidas: actualizadas });
}

module.exports = { listar, crear, verificarVencimientos };
