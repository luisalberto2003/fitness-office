require('dotenv').config();
const bcrypt = require('bcryptjs');
const sequelize = require('./config/db');
const {
  Usuario,
  Socio,
  Membresia,
  SocioMembresia,
  CategoriaProducto,
  Producto,
} = require('./models');

async function seed() {
  await sequelize.sync({ force: true }); // recrea las tablas (solo para entorno de desarrollo/demo)

  // --- Usuario administrador ---
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin1234', 10);
  await Usuario.create({
    nombre: 'Administrador Fitness Office',
    email: process.env.ADMIN_EMAIL || 'admin@fitnessoffice.com',
    password_hash: passwordHash,
    rol: 'administrador',
  });

  // --- Usuario cliente de prueba ---
  const clientePasswordHash = await bcrypt.hash('Cliente1234', 10);
  const usuarioCliente = await Usuario.create({
    nombre: 'Juan Pérez',
    email: 'cliente@demo.com',
    password_hash: clientePasswordHash,
    rol: 'cliente',
  });

  const socio = await Socio.create({
    usuario_id: usuarioCliente.id,
    nombres: 'Juan',
    apellidos: 'Pérez',
    cedula: '1712345678',
    telefono: '0990000000',
    email: 'cliente@demo.com',
  });

  // --- Membresías (planes) ---
  const [mensual, trimestral, anual] = await Membresia.bulkCreate([
    { nombre: 'Plan Mensual', descripcion: 'Acceso ilimitado durante 30 días.', duracion_dias: 30, precio: 35.0 },
    { nombre: 'Plan Trimestral', descripcion: 'Acceso ilimitado durante 90 días, incluye evaluación física.', duracion_dias: 90, precio: 90.0 },
    { nombre: 'Plan Anual', descripcion: 'Acceso ilimitado durante 365 días, incluye plan nutricional.', duracion_dias: 365, precio: 320.0 },
  ]);

  const hoy = new Date();
  const fin = new Date(hoy);
  fin.setDate(fin.getDate() + mensual.duracion_dias);

  await SocioMembresia.create({
    socio_id: socio.id,
    membresia_id: mensual.id,
    fecha_inicio: hoy.toISOString().slice(0, 10),
    fecha_fin: fin.toISOString().slice(0, 10),
    estado: 'activo',
  });

  // --- Categorías y productos (suplementos) ---
  const [proteinas, creatinas, vitaminas, preEntreno] = await CategoriaProducto.bulkCreate([
    { nombre: 'Proteínas' },
    { nombre: 'Creatinas' },
    { nombre: 'Vitaminas y Minerales' },
    { nombre: 'Pre-entrenos' },
  ]);

  await Producto.bulkCreate([
    {
      categoria_id: proteinas.id,
      nombre: 'Whey Protein Gold Standard 2lb',
      descripcion: 'Proteína de suero de alta absorción, sabor chocolate.',
      precio: 45.0,
      stock: 20,
      imagen_url: '/productos/whey-gold-standard.jpg',
    },
    {
      categoria_id: proteinas.id,
      nombre: 'Proteína Vegana Vainilla 1kg',
      descripcion: 'Mezcla de proteína de arveja y arroz.',
      precio: 38.5,
      stock: 15,
      imagen_url: '/productos/proteina-vegana.jpg',
    },
    {
      categoria_id: creatinas.id,
      nombre: 'Creatina Monohidratada 300g',
      descripcion: 'Aumenta la fuerza y el rendimiento en entrenamientos de alta intensidad.',
      precio: 22.0,
      stock: 30,
      imagen_url: '/productos/creatina.jpg',
    },
    {
      categoria_id: vitaminas.id,
      nombre: 'Multivitamínico Deportivo 60 cápsulas',
      descripcion: 'Complejo vitamínico formulado para deportistas.',
      precio: 18.0,
      stock: 25,
      imagen_url: '/productos/multivitaminico.jpg',
    },
    {
      categoria_id: preEntreno.id,
      nombre: 'Pre-Entreno Explosive Energy 300g',
      descripcion: 'Fórmula con cafeína y beta-alanina para mayor energía.',
      precio: 28.0,
      stock: 4, // stock bajo intencional para demostrar la alerta de inventario
      imagen_url: '/productos/pre-entreno.jpg',
    },
  ]);

  console.log('\nBase de datos poblada correctamente.');
  console.log('----------------------------------------------');
  console.log('Cuenta administrador:');
  console.log(`  email:    ${process.env.ADMIN_EMAIL || 'admin@fitnessoffice.com'}`);
  console.log(`  password: ${process.env.ADMIN_PASSWORD || 'Admin1234'}`);
  console.log('Cuenta cliente de prueba:');
  console.log('  email:    cliente@demo.com');
  console.log('  password: Cliente1234');
  console.log('----------------------------------------------');

  process.exit(0);
}

seed().catch((err) => {
  console.error('Error al poblar la base de datos:', err);
  process.exit(1);
});
