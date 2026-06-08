import { Router } from 'express';

import {
    listarClientesController,
    crearClienteController,
    actualizarClienteController,
    cambiarEstadoClienteController
} from './clientes.controller.js';

const router = Router();

router.get('/listar-clientes', listarClientesController);
router.post('/crear-cliente', crearClienteController);
router.put('/actualizar-cliente/:uuid', actualizarClienteController);
router.patch('/cambiar-estado-cliente/:uuid', cambiarEstadoClienteController);

export default router;