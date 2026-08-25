const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productos.controller');
const { verificarToken, autorizarRoles } = require('../middleware/auth');

router.get('/', ctrl.listar); // catálogo público
router.get('/:id', ctrl.obtener);
router.post('/', verificarToken, autorizarRoles('administrador'), ctrl.crear);
router.put('/:id', verificarToken, autorizarRoles('administrador'), ctrl.actualizar);
router.delete('/:id', verificarToken, autorizarRoles('administrador'), ctrl.eliminar);

module.exports = router;
