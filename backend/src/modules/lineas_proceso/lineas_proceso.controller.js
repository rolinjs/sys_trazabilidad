import {
    listarLineasProcesoModel,
    buscarLineaProcesoPorCodigoModel,
    buscarLineaProcesoPorNombreModel,
    crearLineaProcesoModel,
    actualizarLineaProcesoModel,
    buscarLineaProcesoPorNombreEditarModel,
    cambiarEstadoLineaProcesoModel
} from './lineas_proceso.model.js';

export const listarLineasProcesoController = async (req, res) => {
    try {
        const lineas = await listarLineasProcesoModel();

        return res.status(200).json({
            success: true,
            data: lineas
        });

    } catch (error) {
        console.log('Error en listarLineasProcesoController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};

export const crearLineaProcesoController = async (req, res) => {
    try {
        const {
            codigo,
            nombre,
            descripcion
        } = req.body;

        if (!codigo || codigo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El código es obligatorio.'
            });
        }

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre es obligatorio.'
            });
        }

        if (codigo.trim().length > 20) {
            return res.status(400).json({
                success: false,
                message: 'El código no debe superar los 20 caracteres.'
            });
        }

        if (nombre.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: 'El nombre no debe superar los 100 caracteres.'
            });
        }

        const codigoExiste = await buscarLineaProcesoPorCodigoModel(
            codigo.trim()
        );

        if (codigoExiste) {
            return res.status(409).json({
                success: false,
                message: 'El código ya se encuentra registrado.'
            });
        }

        const nombreExiste = await buscarLineaProcesoPorNombreModel(
            nombre.trim()
        );

        if (nombreExiste) {
            return res.status(409).json({
                success: false,
                message: 'El nombre ya se encuentra registrado.'
            });
        }

        const nuevaLinea = await crearLineaProcesoModel(
            codigo.trim().toUpperCase(),
            nombre.trim().toUpperCase(),
            descripcion?.trim() || null
        );

        return res.status(201).json({
            success: true,
            message: 'Línea de proceso registrada correctamente.',
            data: nuevaLinea
        });

    } catch (error) {
        console.log('Error en crearLineaProcesoController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};

export const actualizarLineaProcesoController = async (req, res) => {
    try {
        const { uuid } = req.params;

        const {
            nombre,
            descripcion
        } = req.body;

        if (!uuid) {
            return res.status(400).json({
                success: false,
                message: 'El UUID es obligatorio.'
            });
        }

        if (nombre !== undefined) {
            if (nombre.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre no puede estar vacío.'
                });
            }

            if (nombre.trim().length > 100) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre no debe superar los 100 caracteres.'
                });
            }

            const nombreExiste = await buscarLineaProcesoPorNombreEditarModel(
                nombre.trim(),
                uuid
            );

            if (nombreExiste) {
                return res.status(409).json({
                    success: false,
                    message: 'El nombre ya se encuentra registrado.'
                });
            }
        }

        const lineaActualizada = await actualizarLineaProcesoModel(
            uuid,
            nombre?.trim().toUpperCase() || null,
            descripcion?.trim() || null
        );

        if (!lineaActualizada) {
            return res.status(404).json({
                success: false,
                message: 'Línea de proceso no encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Línea de proceso actualizada correctamente.',
            data: lineaActualizada
        });

    } catch (error) {
        console.log('Error en actualizarLineaProcesoController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};

export const cambiarEstadoLineaProcesoController = async (req, res) => {
    try {
        const { uuid } = req.params;

        if (!uuid) {
            return res.status(400).json({
                success: false,
                message: 'El UUID es obligatorio.'
            });
        }

        const linea = await cambiarEstadoLineaProcesoModel(uuid);

        if (!linea) {
            return res.status(404).json({
                success: false,
                message: 'Línea de proceso no encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Estado actualizado correctamente.',
            data: linea
        });

    } catch (error) {
        console.log('Error en cambiarEstadoLineaProcesoController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};