import { useEffect, useState } from 'react';
import api from '../../api/client';

const estadoColor = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  pagado: 'bg-green-100 text-green-700',
  enviado: 'bg-blue-100 text-blue-700',
  entregado: 'bg-gray-100 text-gray-700',
  cancelado: 'bg-red-100 text-red-700',
};

export default function MisPedidos() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api
      .get('/ordenes/mis-pedidos')
      .then(({ data }) => setOrdenes(data))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold mb-6">Mis pedidos</h1>

      {cargando ? (
        <p className="text-gray-400">Cargando...</p>
      ) : ordenes.length === 0 ? (
        <p className="text-gray-400">Todavía no has realizado pedidos.</p>
      ) : (
        <div className="space-y-4">
          {ordenes.map((orden) => (
            <div key={orden.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold">Pedido #{orden.id}</p>
                  <p className="text-xs text-gray-400">{new Date(orden.fecha).toLocaleString('es-EC')}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estadoColor[orden.estado] || ''}`}>
                  {orden.estado}
                </span>
              </div>

              <div className="divide-y">
                {orden.detalles.map((d) => (
                  <div key={d.id} className="flex justify-between py-2 text-sm">
                    <span>{d.producto?.nombre} x{d.cantidad}</span>
                    <span className="font-medium">${Number(d.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between font-bold pt-3 border-t mt-2">
                <span>Total</span>
                <span>${Number(orden.total).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
