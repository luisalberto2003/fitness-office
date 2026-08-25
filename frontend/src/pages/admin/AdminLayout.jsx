import { NavLink, Outlet } from 'react-router-dom';

const enlaces = [
  { to: '/admin', label: 'Resumen', end: true },
  { to: '/admin/socios', label: 'Socios' },
  { to: '/admin/membresias', label: 'Membresías' },
  { to: '/admin/pagos', label: 'Pagos' },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/ordenes', label: 'Órdenes' },
];

export default function AdminLayout() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
      <aside className="md:w-56 shrink-0">
        <nav className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex md:flex-col gap-1 overflow-x-auto">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.to}
              to={enlace.to}
              end={enlace.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  isActive ? 'bg-brand text-white' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              {enlace.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
