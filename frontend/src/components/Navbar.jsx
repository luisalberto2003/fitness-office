import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const carrito = useCarrito();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-brand-black text-white sticky top-0 z-20 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="font-extrabold text-xl tracking-tight">
          FITNESS <span className="text-brand">OFFICE</span>
        </Link>

        <div className="flex items-center gap-5 text-sm font-medium">
          <Link to="/catalogo" className="hover:text-brand transition">Suplementos</Link>

          {usuario?.rol === 'administrador' && (
            <Link to="/admin" className="hover:text-brand transition">Panel Admin</Link>
          )}

          {usuario?.rol === 'cliente' && (
            <>
              <Link to="/mi-membresia" className="hover:text-brand transition">Mi membresía</Link>
              <Link to="/mis-pedidos" className="hover:text-brand transition">Mis pedidos</Link>
              <Link to="/carrito" className="relative hover:text-brand transition">
                Carrito
                {carrito.cantidadTotal > 0 && (
                  <span className="absolute -top-2 -right-3 bg-brand text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {carrito.cantidadTotal}
                  </span>
                )}
              </Link>
            </>
          )}

          {usuario ? (
            <button
              onClick={handleLogout}
              className="bg-brand hover:bg-brand-dark transition px-3 py-1.5 rounded-md"
            >
              Salir ({usuario.nombre.split(' ')[0]})
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-brand hover:bg-brand-dark transition px-3 py-1.5 rounded-md"
            >
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
