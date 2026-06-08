import {
    listarVariedadesModel,
    buscarVariedadPorCodigoModel,
    buscarVariedadPorNombreModel,
    crearVariedadModel,
    actualizarVariedadModel,
    buscarVariedadPorCodigoEditarModel,
    buscarVariedadPorNombreEditarModel,
    cambiarEstadoVariedadModel
} from './variedades.model.js';

export const listarVariedadesController = async (req, res) => {
    try {
        const variedades = await listarVariedadesModel();

        return res.status(200).json({
            success: true,
            data: variedades
        });

    } catch (error) {
        console.log('Error en listarVariedadesController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo un error en el servidor.'
        });
    }
};

export const crearVariedadController = async (req, res) => {
    try {
        const { codigo, nombre } = req.body;

        if (!codigo || codigo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El código es obligatorio.'
            });
        }

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la variedad es obligatorio.'
            });
        }

        if (codigo.trim().length > 10) {
            return res.status(400).json({
                success: false,
                message: 'El código no debe superar los 10 caracteres.'
            });
        }

        if (nombre.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: 'El nombre no debe superar los 100 caracteres.'
            });
        }

        const codigoExiste = await buscarVariedadPorCodigoModel(codigo.trim());

        if (codigoExiste) {
            return res.status(409).json({
                success: false,
                message: 'El código ya se encuentra registrado.'
            });
        }

        const nombreExiste = await buscarVariedadPorNombreModel(nombre.trim());

        if (nombreExiste) {
            return res.status(409).json({
                success: false,
                message: 'El nombre de la variedad ya se encuentra registrado.'
            });
        }

        const nuevaVariedad = await crearVariedadModel(
            codigo.trim().toUpperCase(),
            nombre.trim()
        );

        return res.status(201).json({
            success: true,
            message: 'Variedad registrada correctamente.',
            data: nuevaVariedad
        });

    } catch (error) {
        console.log('Error en crearVariedadController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo un error en el servidor.'
        });
    }
};

/**
 * Controlador para actualizar variedad
 */
export const actualizarVariedadController = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { codigo, nombre } = req.body;

        if (!uuid) {
            return res.status(400).json({
                success: false,
                message: 'El UUID es obligatorio.'
            });
        }

        if (!codigo || codigo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El código es obligatorio.'
            });
        }

        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la variedad es obligatorio.'
            });
        }

        if (codigo.trim().length > 10) {
            return res.status(400).json({
                success: false,
                message: 'El código no debe superar los 10 caracteres.'
            });
        }

        if (nombre.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: 'El nombre no debe superar los 100 caracteres.'
            });
        }

        const codigoExiste = await buscarVariedadPorCodigoEditarModel(
            codigo.trim(),
            uuid
        );

        if (codigoExiste) {
            return res.status(409).json({
                success: false,
                message: 'El código ya se encuentra registrado.'
            });
        }

        const nombreExiste = await buscarVariedadPorNombreEditarModel(
            nombre.trim(),
            uuid
        );

        if (nombreExiste) {
            return res.status(409).json({
                success: false,
                message: 'El nombre de la variedad ya se encuentra registrado.'
            });
        }

        const variedadActualizada = await actualizarVariedadModel(
            uuid,
            codigo.trim().toUpperCase(),
            nombre.trim()
        );

        if (!variedadActualizada) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró la variedad.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Variedad actualizada correctamente.',
            data: variedadActualizada
        });

    } catch (error) {
        console.log('Error en actualizarVariedadController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo un error en el servidor.'
        });
    }
};

/**
 * Controlador para actualizar estado - variedades
 */
export const cambiarEstadoVariedadController = async (req, res) => {
    try {
        const { uuid } = req.params;

        if (!uuid) {
            return res.status(400).json({
                success: false,
                message: 'El UUID es obligatorio.'
            });
        }

        const variedad = await cambiarEstadoVariedadModel(uuid);

        if (!variedad) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró la variedad.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Estado actualizado correctamente.',
            data: variedad
        });

    } catch (error) {
        console.log('Error en cambiarEstadoVariedadController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo un error en el servidor.'
        });
    }
};