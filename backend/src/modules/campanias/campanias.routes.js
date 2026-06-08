
import { Router } from 'express';

import * as Campanias from './campanias.controller.js';

const router = Router();

router.get('/listar-campanias', Campanias.listarCampaniasController);
router.post('/crear-campania', Campanias.crearCampaniaController);
router.put('/actualizar-campania/:uuid', Campanias.actualizarCampaniaController);
router.patch('/cambiar-estado-campania/:uuid', Campanias.cambiarEstadoCampaniaController);

export default router;