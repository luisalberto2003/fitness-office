import { useEffect, useState } from 'react';
import api from '../../api/client';

const vacio = { nombre: '', descripcion: '', precio: '', stock: '', categoria_id: '', imagen_url: '' };

export default function ProductosAdmin() {
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');

  async function cargar() {
    const { data } = await api.get('/productos');
    setProductos(data);
  }

  useEffect(() => { cargar(); }, []);

  function actualizarCampo(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function guardar(e) {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, precio: Number(form.precio), stock: Number(form.stock) };
      if (!payload.categoria_id) delete payload.categoria_id;
      if (editandoId) {
        await api.put(`/productos/${editandoId}`, payload);
      } else {
        await api.post('/productos', payload);
      }
      setForm(vacio);
      setEditandoId(null);
      cargar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo guardar el producto.');
    }
  }

  function editar(p) {
    setEditandoId(p.id);
    setForm({ nombre: p.nombre, descripcion: p.descripcion || '', precio: p.precio, stock: p.stock, categoria_id: p.categoria_id || '', imagen_url: p.imagen_url || '' });
  }

  async function darDeBaja(id) {
    if (!confirm('¿Dar de baja este producto?')) return;
    await api.delete(`/productos/${id}`);
    cargar();
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold mb-6">Productos</h1>

      <form onSubmit={guardar} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Input label="Nombre" value={form.nombre} onChange={(v) => actualizarCampo('nombre', v)} required />
        <Input label="Descripción" value={form.descripcion} onChange={(v) => actualizarCampo('descripcion', v)} />
        <Input label="Precio (USD)" type="number" value={form.precio} onChange={(v) => actualizarCampo('precio', v)} required />
        <Input label="Stock" type="number" value={form.stock} onChange={(v) => actualizarCampo('stock', v)} required />
        <div className="lg:col-span-2">
          <Input label="URL de la foto (opcional)" value={form.imagen_url} onChange={(v) => actualizarCampo('imagen_url', v)} />
          <p className="text-[11px] text-gray-400 mt-1">Sube la foto a un servicio como imgur.com y pega aquí el enlace directo a la imagen.</p>
        </div>
        {form.imagen_url && (
          <div className="flex items-end">
            <img src={form.imagen_url} alt="Vista previa" className="h-16 w-16 object-cover rounded-md border border-gray-200" onError={(e) => (e.target.style.display = 'none')} />
          </div>
        )}

        <div className="lg:col-span-4 flex items-center gap-3">
          <button type="submit" className="bg-brand hover:bg-brand-dark transition text-white font-semibold px-5 py-2 rounded-md text-sm">
            {editandoId ? 'Actualizar producto' : 'Crear producto'}
          </button>
          {editandoId && (
            <button type="button" onClick={() => { setEditandoId(null); setForm(vacio); }} className="text-sm text-gray-500">
              Cancelar
            </button>
          )}
          {error && <span className="text-red-500 text-sm">{error}</span>}
        </div>
      </form>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="p-3">Producto</th>
              <th className="p-3">Categoría</th>
              <th className="p-3">Precio</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {productos.map((p) => (
              <tr key={p.id}>
                <td className="p-3 font-medium">{p.nombre}</td>
                <td className="p-3 text-gray-500">{p.categoria?.nombre || '-'}</td>
                <td className="p-3">${Number(p.precio).toFixed(2)}</td>
                <td className="p-3">
                  <span className={p.stock <= 5 ? 'text-red-500 font-semibold' : ''}>{p.stock}</span>
                </td>
                <td className="p-3 space-x-2">
                  <button onClick={() => editar(p)} className="text-blue-600 text-xs font-semibold hover:underline">Editar</button>
                  <button onClick={() => darDeBaja(p.id)} className="text-red-500 text-xs font-semibold hover:underline">Baja</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
