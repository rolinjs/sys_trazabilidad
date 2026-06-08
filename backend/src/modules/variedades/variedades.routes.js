import { Router } from 'express';

import {
    listarVariedadesController,
    crearVariedadController,
    actualizarVariedadController,
    cambiarEstadoVariedadController
} from './variedades.controller.js';

const router = Router();

router.get('/listar-variedades', listarVariedadesController);
router.post('/crear-variedad', crearVariedadController);
router.put('/actualizar-variedad/:uuid', actualizarVariedadController);
router.patch('/cambiar-estado-variedad/:uuid', cambiarEstadoVariedadController);

export default router;