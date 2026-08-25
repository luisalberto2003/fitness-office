const { sequelize, Socio, SocioMembresia, Pago, Orden, Producto } = require('../models');
const { Op } = require('sequelize');

// GET /api/reportes/resumen  (admin)
async function resumen(req, res) {
  const totalSocios = await Socio.count({ where: { estado: 'activo' } });
  const membresiasActivas = await SocioMembresia.count({ where: { estado: 'activo' } });
  const membresiasVencidas = await SocioMembresia.count({ where: { estado: 'vencido' } });

  const ingresosMembresias = await Pago.sum('monto', { where: { estado: 'pagado' } });
  const ingresosEcommerce = await Orden.sum('total', { where: { estado: { [Op.ne]: 'cancelado' } } });

  const productosStockBajo = await Producto.count({ where: { stock: { [Op.lte]: 5 }, activo: true } });
  const ordenesPendientes = await Orden.count({ where: { estado: 'pendiente' } });

  res.json({
    total_socios_activos: totalSocios,
    membresias_activas: membresiasActivas,
    membresias_vencidas: membresiasVencidas,
    ingresos_membresias: Number(ingresosMembresias || 0),
    ingresos_ecommerce: Number(ingresosEcommerce || 0),
    productos_stock_bajo: productosStockBajo,
    ordenes_pendientes: ordenesPendientes,
  });
}

module.exports = { resumen };
