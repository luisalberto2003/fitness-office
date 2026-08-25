import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductoCard({ producto }) {
  const carrito = useCarrito();
  const { usuario } = useAuth();
  const navigate = useNavigate();

  function handleAgregar() {
    if (!usuario) {
      navigate('/login');
      return;
    }
    carrito.agregar(producto, 1);
  }

  const sinStock = producto.stock <= 0;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
      <div className="h-36 bg-gray-50 flex items-center justify-center text-gray-300 text-4xl font-black">
        {producto.nombre.charAt(0)}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-brand font-semibold uppercase tracking-wide mb-1">
          {producto.categoria?.nombre || 'Suplemento'}
        </p>
        <h3 className="font-bold text-gray-900 leading-snug">{producto.nombre}</h3>
        <p className="text-gray-500 text-sm mt-1 flex-1">{producto.descripcion}</p>

        <div className="flex items-center justify-between mt-4">
          <span className="font-extrabold text-lg">${Number(producto.precio).toFixed(2)}</span>
          <span className={`text-xs font-medium ${sinStock ? 'text-red-500' : 'text-green-600'}`}>
            {sinStock ? 'Agotado' : `${producto.stock} disponibles`}
          </span>
        </div>

        <button
          onClick={handleAgregar}
          disabled={sinStock}
          className="mt-3 w-full bg-brand-black hover:bg-brand transition text-white text-sm font-semibold py-2 rounded-md disabled:opacity-40"
        >
          {sinStock ? 'No disponible' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  );
}
