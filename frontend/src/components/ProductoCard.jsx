import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Zap, Pill, Flame, Package } from 'lucide-react';

// Ilustraciones propias por categoría (sin depender de fotos de terceros con derechos de autor).
const ESTILO_CATEGORIA = {
  'Proteínas': { icon: Dumbbell, bg: 'bg-red-50', color: 'text-brand' },
  'Creatinas': { icon: Zap, bg: 'bg-amber-50', color: 'text-amber-500' },
  'Vitaminas y Minerales': { icon: Pill, bg: 'bg-emerald-50', color: 'text-emerald-500' },
  'Pre-entrenos': { icon: Flame, bg: 'bg-orange-50', color: 'text-orange-500' },
};

function IlustracionProducto({ categoria }) {
  const estilo = ESTILO_CATEGORIA[categoria] || { icon: Package, bg: 'bg-gray-50', color: 'text-gray-400' };
  const Icono = estilo.icon;
  return (
    <div className={`h-36 ${estilo.bg} flex items-center justify-center`}>
      <Icono className={`w-12 h-12 ${estilo.color}`} strokeWidth={1.5} />
    </div>
  );
}

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
      <IlustracionProducto categoria={producto.categoria?.nombre} />
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
