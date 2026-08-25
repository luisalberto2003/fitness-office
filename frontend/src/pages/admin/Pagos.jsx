import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function Pagos() {
  const [pagos, setPagos] = useState([]);
  const [socios, setSocios] = useState([]);
  const [socioMembresiaId, setSocioMembresiaId] = useState('');
  const [monto, setMonto] = useState('');
  const [metodo, setMetodo] = useState('efectivo');
  const [error, setError] = useState('');
  const [mensajeVerificacion, setMensajeVerificacion] = useState('');

  async function cargarPagos() {
    const { data } = await api.get('/pagos');
    setPagos(data);
  }

  useEffect(() => {
    cargarPagos();
    api.get('/socios').then(({ data }) => setSocios(data));
  }, []);

  const opcionesMembresia = socios.flatMap((s) =>
    (s.membresias || []).map((m) => ({
      id: m.id,
      etiqueta: `${s.nombres} ${s.apellidos} - ${m.Membresium?.nombre} (${m.estado})`,
    }))
  );

  async function registrarPago(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/pagos', { socio_membresia_id: Number(socioMembresiaId), monto: Number(monto), metodo_pago: metodo });
      setSocioMembresiaId('');
      setMonto('');
      cargarPagos();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo registrar el pago.');
    }
  }

  async function verificarVencimientos() {
    const { data } = await api.get('/pagos/vencimientos');
    setMensajeVerificacion(
      data.membresias_vencidas.length
        ? `Se marcaron ${data.membresias_vencidas.length} membresía(s) como vencidas.`
        : 'No hay membresías vencidas nuevas.'
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold">Pagos</h1>
        <button onClick={verificarVencimientos} className="text-sm bg-brand-black text-white px-4 py-2 rounded-md hover:bg-brand transition">
          Verificar vencimientos
        </button>
      </div>

      {mensajeVerificacion && <p className="text-sm text-brand-dark mb-4">{mensajeVerificacion}</p>}

      <form onSubmit={registrarPago} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-2">
          <label className="text-xs font-medium text-gray-600">Socio / Membresía</label>
          <select
            value={socioMembresiaId}
            onChange={(e) => setSocioMembresiaId(e.target.value)}
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm"
          >
            <option value="">Seleccionar...</option>
            {opcionesMembresia.map((o) => (
              <option key={o.id} value={o.id}>{o.etiqueta}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Monto (USD)</label>
          <input type="number" step="0.01" required value={monto} onChange={(e) => setMonto(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600">Método de pago</label>
          <select value={metodo} onChange={(e) => setMetodo(e.target.value)} className="mt-1 w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm">
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>
        </div>
        <div className="lg:col-span-4">
          <button type="submit" className="bg-brand hover:bg-brand-dark transition text-white font-semibold px-5 py-2 rounded-md text-sm">
            Registrar pago
          </button>
          {error && <span className="text-red-500 text-sm ml-3">{error}</span>}
        </div>
      </form>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="p-3">Socio</th>
              <th className="p-3">Plan</th>
              <th className="p-3">Monto</th>
              <th className="p-3">Método</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pagos.map((p) => (
              <tr key={p.id}>
                <td className="p-3">{p.SocioMembresium?.Socio?.nombres} {p.SocioMembresium?.Socio?.apellidos}</td>
                <td className="p-3">{p.SocioMembresium?.Membresium?.nombre}</td>
                <td className="p-3 font-semibold">${Number(p.monto).toFixed(2)}</td>
                <td className="p-3 capitalize">{p.metodo_pago}</td>
                <td className="p-3">{p.fecha_pago}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">{p.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
