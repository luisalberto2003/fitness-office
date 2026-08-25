const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reportes.controller');
const { verificarToken, autorizarRoles } = require('../middleware/auth');

router.get('/resumen', verificarToken, autorizarRoles('administrador'), ctrl.resumen);

module.exports = router;
