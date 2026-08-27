import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import api from '../../api/client';

export default function Membresias() {
  const [membresias, setMembresias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api
      .get('/membresias')
      .then(({ data }) => setMembresias(data.filter((m) => m.activo)))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <p className="text-brand font-semibold tracking-widest text-sm mb-2">PLANES</p>
        <h1 className="text-3xl font-extrabold mb-2">Elige tu membresía</h1>
        <p className="text-gray-500">Acceso completo a las instalaciones y clases grupales de Fitness Office.</p>
      </div>

      {cargando ? (
        <p className="text-center text-gray-400">Cargando planes...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {membresias.map((m, i) => (
            <div
              key={m.id}
              className={`rounded-2xl p-6 border shadow-sm flex flex-col ${
                i === 1 ? 'bg-brand-black text-white border-brand-black scale-[1.03]' : 'bg-white border-gray-100'
              }`}
            >
              <p className={`font-bold text-lg mb-1 ${i === 1 ? 'text-white' : 'text-gray-900'}`}>{m.nombre}</p>
              <p className={`text-sm mb-4 ${i === 1 ? 'text-gray-300' : 'text-gray-500'}`}>{m.descripcion}</p>
              <p className="text-4xl font-extrabold mb-1">${Number(m.precio).toFixed(0)}</p>
              <p className={`text-xs mb-5 ${i === 1 ? 'text-gray-400' : 'text-gray-400'}`}>{m.duracion_dias} días de vigencia</p>

              <ul className="space-y-2 text-sm mb-6 flex-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${i === 1 ? 'text-brand' : 'text-green-600'}`} />
                  Acceso a área de pesas y cardio
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${i === 1 ? 'text-brand' : 'text-green-600'}`} />
                  Clases grupales incluidas
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${i === 1 ? 'text-brand' : 'text-green-600'}`} />
                  Entrenamiento funcional
                </li>
              </ul>

              <a
                href="https://api.whatsapp.com/send/?phone=593983458206&text=Hola%2C%20quiero%20informaci%C3%B3n%20para%20inscribirme%20al%20gimnasio"
                target="_blank"
                rel="noopener noreferrer"
                className={`text-center font-semibold py-2.5 rounded-md transition ${
                  i === 1
                    ? 'bg-brand hover:bg-brand-dark text-white'
                    : 'bg-brand-black hover:bg-brand text-white'
                }`}
              >
                Inscribirme
              </a>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-gray-400 text-sm mt-8">
        ¿Ya eres socio? Habla con el administrador para que registre tu pago y active tu plan.
      </p>
    </div>
  );
}
