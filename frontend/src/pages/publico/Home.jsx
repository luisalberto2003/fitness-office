import { Link } from 'react-router-dom';
import { Dumbbell, HeartPulse, Zap, MapPin, Phone, Clock, Star } from 'lucide-react';

const WHATSAPP = 'https://api.whatsapp.com/send/?phone=593983458206&text=Hola%2C%20quiero%20recibir%20informaci%C3%B3n%20sobre%20el%20gimnasio';

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <div className="bg-brand-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 text-center">
          <p className="text-brand font-semibold tracking-widest text-sm mb-3">ENTRENA · SUPÉRATE · EVOLUCIONA</p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">
            Tu cuerpo. Tu disciplina.<br />Tu mejor versión.
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            En Fitness Office encontrarás un espacio pensado para ayudarte a trabajar por tus objetivos:
            ganar fuerza, mejorar tu condición física, aumentar tu resistencia o simplemente sentirte mejor
            contigo mismo. No importa si es tu primer día o si ya tienes experiencia — lo importante es
            dar el primer paso.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
              className="bg-brand hover:bg-brand-dark transition px-6 py-3 rounded-md font-semibold">
              ¡Inscríbete ahora!
            </a>
            <Link to="/membresias" className="border border-white/30 hover:border-white transition px-6 py-3 rounded-md font-semibold">
              Ver membresías
            </Link>
          </div>
        </div>
      </div>

      {/* ÁREAS */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-brand font-semibold tracking-widest text-sm mb-2">INSTALACIONES</p>
          <h2 className="text-2xl md:text-3xl font-extrabold">Todo lo que necesitas para dar tu mejor esfuerzo</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <AreaCard
            icon={<Dumbbell className="w-7 h-7 text-brand" />}
            titulo="Área de pesas"
            texto="Un espacio diseñado para trabajar fuerza, aumentar masa muscular y mejorar tu rendimiento físico."
          />
          <AreaCard
            icon={<HeartPulse className="w-7 h-7 text-brand" />}
            titulo="Área de cardio"
            texto="Mejora tu resistencia y fortalece tu condición física con entrenamientos cardiovasculares a tu propio ritmo."
          />
          <AreaCard
            icon={<Zap className="w-7 h-7 text-brand" />}
            titulo="Entrenamiento funcional"
            texto="Entrenamientos dinámicos que combinan fuerza, resistencia, movilidad y coordinación."
          />
        </div>
      </div>

      {/* CLASES GRUPALES */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-brand font-semibold tracking-widest text-sm mb-2">CLASES GRUPALES</p>
            <h2 className="text-2xl md:text-3xl font-extrabold">Entrena, disfruta y mantente motivado</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <ClaseCard nombre="Bailoterapia" duracion="60 min" intensidad="Baja a media"
              texto="Ejercítate mientras disfrutas de diferentes estilos musicales. Ideal para mejorar tu resistencia cardiovascular y liberar el estrés." />
            <ClaseCard nombre="Fit Combat" duracion="60 min" intensidad="Media - alta"
              texto="Movimientos de combate y ejercicios cardiovasculares para liberar energía y trabajar todo el cuerpo." />
            <ClaseCard nombre="Spinning" duracion="60 min" intensidad="Media - alta"
              texto="Cardio sobre bicicleta fija con música y diferentes niveles de intensidad para fortalecer las piernas." />
          </div>
        </div>
      </div>

      {/* TESTIMONIOS */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-extrabold">Una comunidad que crece contigo</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          <Testimonio texto="Me gusta mucho el ambiente. Es un lugar donde realmente dan ganas de entrenar y seguir mejorando cada día." autor="Carlos M." />
          <Testimonio texto="Desde que comencé a entrenar he logrado ser mucho más constante. El ambiente es cómodo y siempre encuentro motivación." autor="Andrea V." />
          <Testimonio texto="Lo que más me gusta es que puedes entrenar a tu propio ritmo. Poco a poco vas viendo tu progreso." autor="Daniel R." />
        </div>
      </div>

      {/* UBICACIÓN Y CONTACTO */}
      <div className="bg-brand-black text-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-extrabold">Visítanos y comienza tu transformación</h2>
            <p className="text-gray-400 mt-2">El mejor momento para comenzar es ahora.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            <ContactoItem icon={<MapPin className="w-5 h-5 text-brand" />} titulo="Ubicación" texto="N-76, 170133, Quito, Ecuador" />
            <ContactoItem icon={<Phone className="w-5 h-5 text-brand" />} titulo="WhatsApp" texto="0983458206">
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="text-brand font-semibold hover:underline block mt-1">
                Escríbenos
              </a>
            </ContactoItem>
            <ContactoItem icon={<Clock className="w-5 h-5 text-brand" />} titulo="Horarios" texto="Lun-Vie: 05:00–22:00">
              <p className="text-gray-400">Sáb: 07:00–18:00</p>
              <p className="text-gray-400">Dom y feriados: horario especial</p>
            </ContactoItem>
          </div>
        </div>
      </div>
    </div>
  );
}

function AreaCard({ icon, titulo, texto }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{titulo}</h3>
      <p className="text-gray-500 text-sm">{texto}</p>
    </div>
  );
}

function ClaseCard({ nombre, duracion, intensidad, texto }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="font-bold text-lg mb-2">{nombre}</h3>
      <p className="text-gray-500 text-sm mb-4">{texto}</p>
      <div className="flex gap-4 text-xs text-gray-400 border-t pt-3">
        <span><strong className="text-gray-600">Duración:</strong> {duracion}</span>
        <span><strong className="text-gray-600">Intensidad:</strong> {intensidad}</span>
      </div>
    </div>
  );
}

function Testimonio({ texto, autor }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex gap-0.5 text-brand mb-3">
        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-brand text-brand" />)}
      </div>
      <p className="text-gray-600 text-sm italic mb-3">"{texto}"</p>
      <p className="font-semibold text-sm">{autor}</p>
    </div>
  );
}

function ContactoItem({ icon, titulo, texto, children }) {
  return (
    <div className="bg-white/5 rounded-xl p-5 border border-white/10">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="font-semibold">{titulo}</p>
      </div>
      <p className="text-gray-300">{texto}</p>
      {children}
    </div>
  );
}
