import { Router } from 'express';

import {
    listarLineasProcesoController,
    crearLineaProcesoController,
    actualizarLineaProcesoController,
    cambiarEstadoLineaProcesoController
} from './lineas_proceso.controller.js';

const router = Router();

router.get('/listar-lineas-proceso', listarLineasProcesoController);
router.post('/crear-linea-proceso', crearLineaProcesoController);
router.put('/actualizar-linea-proceso/:uuid', actualizarLineaProcesoController);
router.patch('/cambiar-estado-linea-proceso/:uuid', cambiarEstadoLineaProcesoController);

export default router;