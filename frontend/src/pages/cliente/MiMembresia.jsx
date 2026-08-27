import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

const estadoEstilo = {
  activo: 'bg-green-100 text-green-700',
  vencido: 'bg-red-100 text-red-700',
  suspendido: 'bg-yellow-100 text-yellow-700',
};

export default function MiMembresia() {
  const [socio, setSocio] = useState(null);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api
      .get('/socios/me')
      .then(({ data }) => setSocio(data))
      .catch((err) => setError(err.response?.data?.mensaje || 'No se pudo cargar tu información.'))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <div className="max-w-2xl mx-auto px-4 py-10 text-gray-400">Cargando...</div>;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 text-center">
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const historial = [...(socio.membresias || [])].sort(
    (a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio)
  );
  const vigente = historial.find((m) => m.estado === 'activo');

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold mb-6">Mi membresía</h1>

      {vigente ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-bold">{vigente.Membresium?.nombre}</p>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estadoEstilo[vigente.estado]}`}>
              {vigente.estado}
            </span>
          </div>
          <p className="text-gray-500 text-sm mb-4">{vigente.Membresium?.descripcion}</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Inicio</p>
              <p className="font-medium">{vigente.fecha_inicio}</p>
            </div>
            <div>
              <p className="text-gray-400">Vence</p>
              <p className="font-medium">{vigente.fecha_fin}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6 text-center">
          <p className="text-gray-600 mb-2">No tienes una membresía activa en este momento.</p>
          <p className="text-gray-400 text-sm">Acércate al gimnasio para renovar o contratar un plan.</p>
        </div>
      )}

      {historial.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Historial de membresías</h2>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y">
            {historial.map((m) => (
              <div key={m.id} className="flex items-center justify-between p-4 text-sm">
                <div>
                  <p className="font-medium">{m.Membresium?.nombre}</p>
                  <p className="text-gray-400 text-xs">{m.fecha_inicio} — {m.fecha_fin}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${estadoEstilo[m.estado]}`}>
                  {m.estado}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="text-sm text-gray-400 mt-6">
        ¿También quieres ver tus compras de suplementos? Ve a{' '}
        <Link to="/mis-pedidos" className="text-brand font-medium">Mis pedidos</Link>.
      </p>
    </div>
  );
}
