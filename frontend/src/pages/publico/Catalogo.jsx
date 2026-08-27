import { useEffect, useState } from 'react';
import api from '../../api/client';
import ProductoCard from '../../components/ProductoCard';

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    api
      .get('/productos')
      .then(({ data }) => setProductos(data))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold">Catálogo de suplementos</h1>
          <p className="text-gray-500 text-sm">Nutrición deportiva para socios de Fitness Office.</p>
        </div>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      {cargando ? (
        <p className="text-gray-400">Cargando productos...</p>
      ) : filtrados.length === 0 ? (
        <p className="text-gray-400">No se encontraron productos.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtrados.map((p) => (
            <ProductoCard key={p.id} producto={p} />
          ))}
        </div>
      )}
    </div>
  );
}
