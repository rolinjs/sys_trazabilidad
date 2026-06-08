import { Router } from 'express';

import {
    listarTiposProduccionController,
    crearTipoProduccionController,
    actualizarTipoProduccionController,
    cambiarEstadoTipoProduccionController
} from './tipos_produccion.controller.js';

const router = Router();

router.get('/listar-tipos-produccion', listarTiposProduccionController);
router.post('/crear-tipo-produccion', crearTipoProduccionController);
router.put('/actualizar-tipo-produccion/:uuid', actualizarTipoProduccionController);
router.patch('/cambiar-estado-tipo-produccion/:uuid', cambiarEstadoTipoProduccionController);

export default router;