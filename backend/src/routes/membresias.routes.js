const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/membresias.controller');
const { verificarToken, autorizarRoles } = require('../middleware/auth');

router.get('/', ctrl.listar); // público: para mostrar planes disponibles
router.post('/', verificarToken, autorizarRoles('administrador'), ctrl.crear);
router.put('/:id', verificarToken, autorizarRoles('administrador'), ctrl.actualizar);
router.delete('/:id', verificarToken, autorizarRoles('administrador'), ctrl.eliminar);

module.exports = router;
