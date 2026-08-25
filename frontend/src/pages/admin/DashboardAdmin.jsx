import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function DashboardAdmin() {
  const [resumen, setResumen] = useState(null);

  useEffect(() => {
    api.get('/reportes/resumen').then(({ data }) => setResumen(data));
  }, []);

  if (!resumen) return <p className="text-gray-400">Cargando indicadores...</p>;

  const tarjetas = [
    { label: 'Socios activos', valor: resumen.total_socios_activos },
    { label: 'Membresías activas', valor: resumen.membresias_activas },
    { label: 'Membresías vencidas', valor: resumen.membresias_vencidas, alerta: resumen.membresias_vencidas > 0 },
    { label: 'Ingresos por membresías', valor: `$${resumen.ingresos_membresias.toFixed(2)}` },
    { label: 'Ingresos e-commerce', valor: `$${resumen.ingresos_ecommerce.toFixed(2)}` },
    { label: 'Productos con stock bajo', valor: resumen.productos_stock_bajo, alerta: resumen.productos_stock_bajo > 0 },
    { label: 'Órdenes pendientes', valor: resumen.ordenes_pendientes },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Resumen general</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tarjetas.map((t) => (
          <div key={t.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-sm text-gray-500">{t.label}</p>
            <p className={`text-2xl font-extrabold mt-1 ${t.alerta ? 'text-red-500' : 'text-brand-black'}`}>
              {t.valor}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
