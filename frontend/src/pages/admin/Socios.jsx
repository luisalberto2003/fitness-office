import { useEffect, useState } from 'react';
import api from '../../api/client';

const vacio = { nombres: '', apellidos: '', cedula: '', telefono: '', email: '' };

export default function Socios() {
  const [socios, setSocios] = useState([]);
  const [membresias, setMembresias] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [error, setError] = useState('');
  const [asignando, setAsignando] = useState(null); // socio_id

  async function cargarSocios() {
    const { data } = await api.get('/socios', { params: busqueda ? { busqueda } : {} });
    setSocios(data);
  }

  useEffect(() => {
    cargarSocios();
    api.get('/membresias').then(({ data }) => setMembresias(data));
  }, []);

  useEffect(() => {
    const t = setTimeout(cargarSocios, 300);
    return () => clearTimeout(t);
  }, [busqueda]);

  function actualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function guardar(e) {
    e.preventDefault();
    setError('');
    try {
      if (editandoId) {
        await api.put(`/socios/${editandoId}`, form);
      } else {
        await api.post('/socios', form);
      }
      setForm(vacio);
      setEditandoId(null);
      cargarSocios();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo guardar el socio.');
    }
  }

  function editar(socio) {
    setEditandoId(socio.id);
    setForm({
      nombres: socio.nombres,
      apellidos: socio.apellidos,
      cedula: socio.cedula,
      telefono: socio.telefono || '',
      email: socio.email || '',
    });
  }

  async function darDeBaja(id) {
    if (!confirm('¿Dar de baja a este socio?')) return;
    await api.delete(`/socios/${id}`);
    cargarSocios();
  }

  async function asignarMembresia(socioId, membresiaId) {
    if (!membresiaId) return;
    await api.post(`/socios/${socioId}/membresias`, { membresia_id: membresiaId });
    setAsignando(null);
    cargarSocios();
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Socios</h1>

      <form onSubmit={guardar} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Input label="Nombres" value={form.nombres} onChange={(v) => actualizarCampo('nombres', v)} required />
        <Input label="Apellidos" value={form.apellidos} onChange={(v) => actualizarCampo('apellidos', v)} required />
        <Input label="Cédula" value={form.cedula} onChange={(v) => actualizarCampo('cedula', v)} required />
        <Input label="Teléfono" value={form.telefono} onChange={(v) => actualizarCampo('telefono', v)} />
        <Input label="Email" value={form.email} onChange={(v) => actualizarCampo('email', v)} />

        <div className="lg:col-span-5 flex items-center gap-3">
          <button type="submit" className="bg-brand hover:bg-brand-dark transition text-white font-semibold px-5 py-2 rounded-md text-sm">
            {editandoId ? 'Actualizar socio' : 'Registrar socio'}
          </button>
          {editandoId && (
            <button type="button" onClick={() => { setEditandoId(null); setForm(vacio); }} className="text-sm text-gray-500">
              Cancelar edición
            </button>
          )}
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
      </form>

      <input
        type="text"
        placeholder="Buscar por nombre o cédula..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-72 mb-4 focus:outline-none focus:ring-2 focus:ring-brand"
      />

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Cédula</th>
              <th className="p-3">Contacto</th>
              <th className="p-3">Membresía vigente</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {socios.map((s) => {
              const membresiaActiva = s.membresias?.find((m) => m.estado === 'activo');
              return (
                <tr key={s.id}>
                  <td className="p-3 font-medium">{s.nombres} {s.apellidos}</td>
                  <td className="p-3">{s.cedula}</td>
                  <td className="p-3 text-gray-500">{s.telefono}<br />{s.email}</td>
                  <td className="p-3">
                    {membresiaActiva ? (
                      <span className="text-green-600 font-medium">
                        {membresiaActiva.Membresium?.nombre} (vence {membresiaActiva.fecha_fin})
                      </span>
                    ) : (
                      <span className="text-gray-400">Sin membresía activa</span>
                    )}
                    {asignando === s.id ? (
                      <select
                        autoFocus
                        onBlur={() => setAsignando(null)}
                        onChange={(e) => asignarMembresia(s.id, e.target.value)}
                        className="ml-2 border border-gray-300 rounded-md px-2 py-1 text-xs"
                      >
                        <option value="">Elegir plan...</option>
                        {membresias.map((m) => (
                          <option key={m.id} value={m.id}>{m.nombre} (${m.precio})</option>
                        ))}
                      </select>
                    ) : (
                      <button onClick={() => setAsignando(s.id)} className="ml-2 text-brand text-xs font-semibold hover:underline">
                        Asignar/Renovar
                      </button>
                    )}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.estado === 'activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {s.estado}
                    </span>
                  </td>
                  <td className="p-3 space-x-2 whitespace-nowrap">
                    <button onClick={() => editar(s)} className="text-blue-600 text-xs font-semibold hover:underline">Editar</button>
                    <button onClick={() => darDeBaja(s.id)} className="text-red-500 text-xs font-semibold hover:underline">Baja</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, required }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
      />
    </div>
  );
}
