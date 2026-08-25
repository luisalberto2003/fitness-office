import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const usuario = await login(email, password);
      navigate(usuario.rol === 'administrador' ? '/admin' : '/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo iniciar sesión.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-1">Iniciar sesión</h1>
        <p className="text-gray-500 text-sm mb-6">Accede a tu cuenta de Fitness Office</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-md p-3 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-brand hover:bg-brand-dark transition text-white font-semibold py-2.5 rounded-md disabled:opacity-60"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-5">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-brand font-medium">
            Regístrate aquí
          </Link>
        </p>

        <div className="mt-6 text-xs text-gray-400 border-t pt-4">
          <p className="font-semibold mb-1">Cuentas de prueba (seed):</p>
          <p>Admin: admin@fitnessoffice.com / Admin1234</p>
          <p>Cliente: cliente@demo.com / Cliente1234</p>
        </div>
      </div>
    </div>
  );
}
