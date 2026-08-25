const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, Socio } = require('../models');

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

// POST /api/auth/registro
// Registra un nuevo cliente y, opcionalmente, crea su perfil de socio.
async function registro(req, res) {
  try {
    const { nombre, email, password, cedula, telefono } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: 'Nombre, email y contraseña son obligatorios.' });
    }

    const existente = await Usuario.findOne({ where: { email } });
    if (existente) {
      return res.status(409).json({ mensaje: 'Ya existe una cuenta registrada con ese email.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ nombre, email, password_hash, rol: 'cliente' });

    if (cedula) {
      const [nombres, ...resto] = nombre.split(' ');
      await Socio.create({
        usuario_id: usuario.id,
        nombres: nombres || nombre,
        apellidos: resto.join(' ') || '-',
        cedula,
        telefono,
        email,
      });
    }

    const token = generarToken(usuario);
    return res.status(201).json({
      mensaje: 'Cuenta creada correctamente.',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error al registrar el usuario.', error: error.message });
  }
}

// POST /api/auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Email y contraseña son obligatorios.' });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    const claveValida = await bcrypt.compare(password, usuario.password_hash);
    if (!claveValida) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    const token = generarToken(usuario);
    return res.json({
      mensaje: 'Inicio de sesión exitoso.',
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error al iniciar sesión.', error: error.message });
  }
}

// GET /api/auth/perfil (requiere token)
async function perfil(req, res) {
  const usuario = await Usuario.findByPk(req.usuario.id, {
    attributes: ['id', 'nombre', 'email', 'rol', 'creado_en'],
  });
  return res.json(usuario);
}

module.exports = { registro, login, perfil };
