import {
    listarTiposProduccionModel,
    buscarTipoProduccionPorCodigoModel,
    buscarTipoProduccionPorNombreModel,
    crearTipoProduccionModel,
    buscarTipoProduccionPorNombreEditarModel,
    actualizarTipoProduccionModel,
    cambiarEstadoTipoProduccionModel
} from './tipos_produccion.model.js';

export const listarTiposProduccionController = async (req, res) => {
    try {
        const tipos = await listarTiposProduccionModel();

        return res.status(200).json({
            success: true,
            data: tipos
        });

    } catch (error) {
        console.log('Error en listarTiposProduccionController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};

export const crearTipoProduccionController = async (req, res) => {
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

        const codigoExiste = await buscarTipoProduccionPorCodigoModel(
            codigo.trim()
        );

        if (codigoExiste) {
            return res.status(409).json({
                success: false,
                message: 'El código ya se encuentra registrado.'
            });
        }

        const nombreExiste = await buscarTipoProduccionPorNombreModel(
            nombre.trim()
        );

        if (nombreExiste) {
            return res.status(409).json({
                success: false,
                message: 'El nombre ya se encuentra registrado.'
            });
        }

        const nuevoTipo = await crearTipoProduccionModel(
            codigo.trim().toUpperCase(),
            nombre.trim().toUpperCase(),
            descripcion?.trim() || null
        );

        return res.status(201).json({
            success: true,
            message: 'Tipo de producción registrado correctamente.',
            data: nuevoTipo
        });

    } catch (error) {
        console.log('Error en crearTipoProduccionController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};

export const actualizarTipoProduccionController = async (req, res) => {
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

            const nombreExiste = await buscarTipoProduccionPorNombreEditarModel(
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

        const tipoActualizado = await actualizarTipoProduccionModel(
            uuid,
            nombre?.trim().toUpperCase() || null,
            descripcion?.trim() || null
        );

        if (!tipoActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de producción no encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Tipo de producción actualizado correctamente.',
            data: tipoActualizado
        });

    } catch (error) {
        console.log('Error en actualizarTipoProduccionController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};

export const cambiarEstadoTipoProduccionController = async (req, res) => {
    try {
        const { uuid } = req.params;

        if (!uuid) {
            return res.status(400).json({
                success: false,
                message: 'El UUID es obligatorio.'
            });
        }

        const tipo = await cambiarEstadoTipoProduccionModel(uuid);

        if (!tipo) {
            return res.status(404).json({
                success: false,
                message: 'Tipo de producción no encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Estado actualizado correctamente.',
            data: tipo
        });

    } catch (error) {
        console.log('Error en cambiarEstadoTipoProduccionController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};