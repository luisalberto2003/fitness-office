import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="bg-brand-black text-white rounded-2xl p-10 md:p-16 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <p className="text-brand font-semibold tracking-widest text-sm mb-2">FITNESS OFFICE</p>
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
            Gestiona tu membresía y compra tus suplementos, todo en un solo lugar.
          </h1>
          <p className="text-gray-300 mb-6">
            Consulta el estado de tu membresía, revisa tus pagos y descubre nuestro catálogo de
            suplementos nutricionales disponibles para retiro en el gimnasio.
          </p>
          <div className="flex gap-3">
            <Link to="/catalogo" className="bg-brand hover:bg-brand-dark transition px-5 py-2.5 rounded-md font-semibold">
              Ver catálogo
            </Link>
            <Link to="/login" className="border border-white/30 hover:border-white transition px-5 py-2.5 rounded-md font-semibold">
              Ingresar
            </Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-10">
        <Tarjeta
          titulo="Gestión de membresías"
          texto="Control de planes, vigencia y pagos de todos los socios del gimnasio."
        />
        <Tarjeta
          titulo="E-commerce de suplementos"
          texto="Catálogo con control de inventario en tiempo real para evitar sobreventas."
        />
        <Tarjeta
          titulo="Reportes gerenciales"
          texto="Panel administrativo con indicadores clave de ingresos y operación."
        />
      </div>
    </div>
  );
}

function Tarjeta({ titulo, texto }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-lg mb-2">{titulo}</h3>
      <p className="text-gray-500 text-sm">{texto}</p>
    </div>
  );
}
