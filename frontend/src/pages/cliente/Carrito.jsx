import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../../context/CarritoContext';
import api from '../../api/client';

export default function Carrito() {
  const carrito = useCarrito();
  const navigate = useNavigate();
  const [direccion, setDireccion] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [ordenConfirmada, setOrdenConfirmada] = useState(null);

  async function confirmarCompra() {
    setError('');
    setEnviando(true);
    try {
      const items = carrito.items.map((i) => ({ producto_id: i.producto.id, cantidad: i.cantidad }));
      const { data } = await api.post('/ordenes', { direccion_entrega: direccion, items });
      setOrdenConfirmada(data);
      carrito.vaciar();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo procesar la orden.');
    } finally {
      setEnviando(false);
    }
  }

  if (ordenConfirmada) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-2xl font-bold mb-2">¡Pedido confirmado!</h1>
          <p className="text-gray-500 mb-4">
            Tu orden #{ordenConfirmada.id} por ${Number(ordenConfirmada.total).toFixed(2)} fue registrada correctamente.
          </p>
          <button
            onClick={() => navigate('/mis-pedidos')}
            className="bg-brand hover:bg-brand-dark transition text-white font-semibold px-5 py-2.5 rounded-md"
          >
            Ver mis pedidos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-extrabold mb-6">Carrito de compras</h1>

      {carrito.items.length === 0 ? (
        <p className="text-gray-400">Tu carrito está vacío.</p>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y">
          {carrito.items.map((item) => (
            <div key={item.producto.id} className="flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">{item.producto.nombre}</p>
                <p className="text-sm text-gray-500">${Number(item.producto.precio).toFixed(2)} c/u</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max={item.producto.stock}
                  value={item.cantidad}
                  onChange={(e) => carrito.actualizarCantidad(item.producto.id, Number(e.target.value))}
                  className="w-16 border border-gray-300 rounded-md px-2 py-1 text-center"
                />
                <span className="font-semibold w-20 text-right">
                  ${(item.producto.precio * item.cantidad).toFixed(2)}
                </span>
                <button
                  onClick={() => carrito.quitar(item.producto.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Quitar
                </button>
              </div>
            </div>
          ))}

          <div className="p-4">
            <label className="text-sm font-medium text-gray-700">
              Comentarios para tu pedido <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ej. Retiro después de las 6pm, o alguna indicación para el gimnasio"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <p className="text-xs text-gray-400 mt-1">Los pedidos se retiran directamente en Fitness Office.</p>
          </div>

          {error && <p className="text-red-500 text-sm px-4">{error}</p>}

          <div className="flex items-center justify-between p-4">
            <span className="font-bold text-lg">Total: ${carrito.total.toFixed(2)}</span>
            <button
              onClick={confirmarCompra}
              disabled={enviando}
              className="bg-brand hover:bg-brand-dark transition text-white font-semibold px-5 py-2.5 rounded-md disabled:opacity-60"
            >
              {enviando ? 'Procesando...' : 'Confirmar compra'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
