import { Router } from 'express';

import {
    listarAgricultoresController,
    crearAgricultorController,
    actualizarAgricultorController,
    cambiarEstadoAgricultorController
} from './agricultores.controller.js';

const router = Router();

router.get('/listar-agricultores', listarAgricultoresController);
router.post('/crear-agricultor', crearAgricultorController);
router.put('/actualizar-agricultor/:uuid', actualizarAgricultorController);
router.patch('/cambiar-estado-agricultor/:uuid', cambiarEstadoAgricultorController);

export default router;