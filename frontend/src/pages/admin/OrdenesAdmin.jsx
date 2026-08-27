import { useEffect, useState } from 'react';
import api from '../../api/client';

const estados = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];

export default function OrdenesAdmin() {
  const [ordenes, setOrdenes] = useState([]);

  async function cargar() {
    const { data } = await api.get('/ordenes');
    setOrdenes(data);
  }

  useEffect(() => { cargar(); }, []);

  async function cambiarEstado(id, estado) {
    await api.put(`/ordenes/${id}/estado`, { estado });
    cargar();
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Órdenes de e-commerce</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Productos</th>
              <th className="p-3">Total</th>
              <th className="p-3">Comentarios</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {ordenes.map((o) => (
              <tr key={o.id}>
                <td className="p-3 font-medium">{o.id}</td>
                <td className="p-3 text-gray-500">{new Date(o.fecha).toLocaleString('es-EC')}</td>
                <td className="p-3">
                  {o.detalles.map((d) => (
                    <div key={d.id}>{d.producto?.nombre} x{d.cantidad}</div>
                  ))}
                </td>
                <td className="p-3 font-semibold">${Number(o.total).toFixed(2)}</td>
                <td className="p-3 text-gray-500">{o.direccion_entrega}</td>
                <td className="p-3">
                  <select
                    value={o.estado}
                    onChange={(e) => cambiarEstado(o.id, e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1 text-xs"
                  >
                    {estados.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
