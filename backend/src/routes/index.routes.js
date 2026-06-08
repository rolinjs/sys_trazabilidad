import { Router } from 'express';

import campaniasRoutes from '../modules/campanias/campanias.routes.js';
import variedadesRoutes from '../modules/variedades/variedades.routes.js';
import clientesRoutes from '../modules/clientes/clientes.routes.js';
import tarasClienteRoutes from '../modules/taras_cliente/taras_cliente.routes.js';
import agricultoresRoutes from '../modules/agricultores/agricultores.routes.js';
import lineasProcesoRoutes from '../modules/lineas_proceso/lineas_proceso.routes.js';
import tiposProduccionRoutes from '../modules/tipos_produccion/tipos_produccion.routes.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API SAC Trazabilidad funcionando'
  });
});

router.use('/campanias', campaniasRoutes);
router.use('/variedades', variedadesRoutes);
router.use('/clientes', clientesRoutes);
router.use('/taras-cliente', tarasClienteRoutes);
router.use('/agricultores', agricultoresRoutes);
router.use('/lineas-proceso', lineasProcesoRoutes);
router.use('/tipos-produccion', tiposProduccionRoutes);

export default router;