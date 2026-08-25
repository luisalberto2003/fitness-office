import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Registro() {
  const { registro } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '', password: '', cedula: '', telefono: '' });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  function actualizar(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await registro(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No se pudo completar el registro.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-1">Crear cuenta</h1>
        <p className="text-gray-500 text-sm mb-6">Regístrate como socio de Fitness Office</p>

        {error && <div className="bg-red-50 text-red-600 text-sm rounded-md p-3 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Campo label="Nombre completo" value={form.nombre} onChange={(v) => actualizar('nombre', v)} required />
          <Campo label="Correo electrónico" type="email" value={form.email} onChange={(v) => actualizar('email', v)} required />
          <Campo label="Contraseña" type="password" value={form.password} onChange={(v) => actualizar('password', v)} required />
          <Campo label="Cédula" value={form.cedula} onChange={(v) => actualizar('cedula', v)} />
          <Campo label="Teléfono" value={form.telefono} onChange={(v) => actualizar('telefono', v)} />

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-brand hover:bg-brand-dark transition text-white font-semibold py-2.5 rounded-md disabled:opacity-60"
          >
            {cargando ? 'Creando cuenta...' : 'Registrarme'}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-brand font-medium">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

function Campo({ label, type = 'text', value, onChange, required }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
      />
    </div>
  );
}
