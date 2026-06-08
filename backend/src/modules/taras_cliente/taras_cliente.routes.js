import { Router } from 'express';

import {
    listarTarasClienteController,
    crearTaraClienteController,
    actualizarTaraClienteController,
    cambiarEstadoTaraClienteController
} from './taras_cliente.controller.js';

const router = Router();

router.get('/listar-taras-cliente', listarTarasClienteController);
router.post('/crear-tara-cliente', crearTaraClienteController);
router.put('/actualizar-tara-cliente/:uuid', actualizarTaraClienteController);
router.patch('/cambiar-estado-tara-cliente/:uuid', cambiarEstadoTaraClienteController);

export default router;