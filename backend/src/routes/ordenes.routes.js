const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ordenes.controller');
const { verificarToken, autorizarRoles } = require('../middleware/auth');

router.post('/', verificarToken, ctrl.crear);
router.get('/mis-pedidos', verificarToken, ctrl.misPedidos);
router.get('/', verificarToken, autorizarRoles('administrador'), ctrl.listarTodas);
router.put('/:id/estado', verificarToken, autorizarRoles('administrador'), ctrl.actualizarEstado);

module.exports = router;
