import { useEffect, useState } from 'react';
import api from '../../api/client';

const vacio = { nombre: '', descripcion: '', duracion_dias: '', precio: '' };

export default function Membresias() {
  const [membresias, setMembresias] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');

  async function cargar() {
    const { data } = await api.get('/membresias');
    setMembresias(data);
  }

  useEffect(() => { cargar(); }, []);

  function actualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function guardar(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, duracion_dias: Number(form.duracion_dias), precio: Number(form.precio) };
      if (editandoId) {
        await api.put(`/membresias/${editandoId}`, payload);
      } else {
        await api.post('/membresias', payload);
      }
      setForm(vacio);
      setEditandoId(null);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo guardar la membresía.');
    }
  }

  function editar(m) {
    setEditandoId(m.id);
    setForm({ nombre: m.nombre, descripcion: m.descripcion || '', duracion_dias: m.duracion_dias, precio: m.precio });
  }

  async function desactivar(id) {
    if (!confirm('¿Desactivar esta membresía?')) return;
    await api.delete(`/membresias/${id}`);
    cargar();
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Planes de membresía</h1>

      <form onSubmit={guardar} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input label="Nombre" value={form.nombre} onChange={(v) => actualizarCampo('nombre', v)} required />
        <Input label="Descripción" value={form.descripcion} onChange={(v) => actualizarCampo('descripcion', v)} />
        <Input label="Duración (días)" type="number" value={form.duracion_dias} onChange={(v) => actualizarCampo('duracion_dias', v)} required />
        <Input label="Precio (USD)" type="number" value={form.precio} onChange={(v) => actualizarCampo('precio', v)} required />

        <div className="lg:col-span-4 flex items-center gap-3">
          <button type="submit" className="bg-brand hover:bg-brand-dark transition text-white font-semibold px-5 py-2 rounded-md text-sm">
            {editandoId ? 'Actualizar plan' : 'Crear plan'}
          </button>
          {editandoId && (
            <button type="button" onClick={() => { setEditandoId(null); setForm(vacio); }} className="text-sm text-gray-500">
              Cancelar
            </button>
          )}
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
      </form>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {membresias.map((m) => (
          <div key={m.id} className={`bg-white rounded-xl border shadow-sm p-5 ${!m.activo ? 'opacity-50' : 'border-gray-100'}`}>
            <p className="font-bold">{m.nombre}</p>
            <p className="text-gray-500 text-sm mb-2">{m.descripcion}</p>
            <p className="text-2xl font-extrabold">${Number(m.precio).toFixed(2)}</p>
            <p className="text-xs text-gray-400 mb-3">{m.duracion_dias} días de vigencia</p>
            <div className="flex gap-3 text-xs font-semibold">
              <button onClick={() => editar(m)} className="text-blue-600 hover:underline">Editar</button>
              {m.activo && <button onClick={() => desactivar(m.id)} className="text-red-500 hover:underline">Desactivar</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, required, type = 'text' }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
      />
    </div>
  );
}
