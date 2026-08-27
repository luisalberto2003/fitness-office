const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/socios.controller');
const { verificarToken, autorizarRoles } = require('../middleware/auth');

// El cliente autenticado puede consultar su propio perfil de socio.
router.get('/me', verificarToken, ctrl.obtenerPropio);

// El resto de rutas de socios son exclusivas del administrador del gimnasio.
router.use(verificarToken, autorizarRoles('administrador'));

router.get('/', ctrl.listar);
router.get('/:id', ctrl.obtener);
router.post('/', ctrl.crear);
router.put('/:id', ctrl.actualizar);
router.delete('/:id', ctrl.eliminar);
router.post('/:id/membresias', ctrl.asignarMembresia);
router.post('/:id/asistencias', ctrl.registrarAsistencia);

module.exports = router;
