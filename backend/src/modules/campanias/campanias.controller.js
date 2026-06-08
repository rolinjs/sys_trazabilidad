
import { 
    listarCampaniasModel,
    crearCampaniaModel,
    actualizarCampaniaModel,
    cambiarEstadoCampaniaModel
} from './campanias.model.js';

/**
 * Controlador para listar campañas
 */
export const listarCampaniasController = async (req, res) => {
    try {
        const campanias = await listarCampaniasModel();

        return res.status(200).json({
            success: true, 
            data: campanias
        });

    } catch (error) {
        console.log('Hubo un error en listarCampaniasController: ', error);
        
        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor'
        })
    }
}

/**
 * Controlador para crear campañas
 */

export const crearCampaniaController = async (req, res) => {
    try {
        const {
            nombre,
            producto,
            fecha_inicio,
            fecha_fin,
            observacion
        } = req.body;

        if(!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la campaña es obligatoria.'
            });
        }

        if(!producto || producto.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El producto es obligatorio.'
            })
        }

        if(!fecha_inicio) {
            return res.status(400).json({
                success: false,
                message: 'La fecha de inicio es obligatoria.'
            });
        }

        const nuevaCampania = await crearCampaniaModel(
            nombre.trim(),
            producto.trim(),
            fecha_inicio,
            fecha_fin || null,
            observacion?.trim() || null
        );

        return res.status(200).json({
            success: true,
            message: 'Campaña registrada correctamente.',
            data: nuevaCampania
        });


    } catch (error) {

        console.log('Hubo un error en crearCampaniaController: ', error);
        return res.status(500).json({
            success: false,
            message: 'Hubo un error en el servidor'
        })
    }
}

/**
 * Controller para actualizar campaña
 */

export const actualizarCampaniaController = async (req, res) => {
    try {
        const { uuid } = req.params;

        const {
            nombre,
            producto,
            fecha_inicio,
            fecha_fin,
            observacion
        } = req.body;

        if(!uuid) {
            return res.status(400).json({
                success: false,
                message: 'El UUID de la campaña es obligatorio.'
            });
        }

        if(!nombre || nombre.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la campaña es obligatorio.'
            });
        }

        if(!producto || producto.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El producto es obligatorio.'
            });
        }

        if(!fecha_inicio) {
            return res.status(400).json({
                success: false,
                message: 'La fecha de inicio es obligatoria.'
            });
        }

        const campaniaActualizada = await actualizarCampaniaModel(
            uuid,
            nombre.trim(),
            producto.trim(),
            fecha_inicio,
            fecha_fin || null,
            observacion?.trim() || null
        );

        if(!campaniaActualizada) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró la campaña.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Campaña actualizada correctamente.',
            data: campaniaActualizada
        })

    } catch (error) {
        console.log('Error en el controlador actualizarCampaniaController: ', error);
        return res.status(500).json({
            success: false,
            message: 'Hubo un error en el servidor'
        });
        
    }
}

/**
 * Controlador para actualizar estado de la campaña
 */

export const cambiarEstadoCampaniaController = async (req, res) => {
    try {

        const { uuid } = req.params;

        if (!uuid) {
            return res.status(400).json({
                success: false,
                message: 'El UUID es obligatorio.'
            });
        }

        const campania = await cambiarEstadoCampaniaModel(uuid);

        if (!campania) {
            return res.status(404).json({
                success: false,
                message: 'No se encontró la campaña.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Estado actualizado correctamente.',
            data: campania
        });

    } catch (error) {

        console.log(
            'Error en cambiarEstadoCampaniaController:',
            error
        );

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};