const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pagos.controller');
const { verificarToken, autorizarRoles } = require('../middleware/auth');

router.use(verificarToken, autorizarRoles('administrador'));

router.get('/', ctrl.listar);
router.post('/', ctrl.crear);
router.get('/vencimientos', ctrl.verificarVencimientos);

module.exports = router;
