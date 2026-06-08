import {
    listarTarasClienteModel,
    buscarClientePorUuidModel,
    crearTaraClienteModel,
    actualizarTaraClienteModel,
    cambiarEstadoTaraClienteModel
} from './taras_cliente.model.js';

export const listarTarasClienteController = async (req, res) => {
    try {
        const taras = await listarTarasClienteModel();

        return res.status(200).json({
            success: true,
            data: taras
        });

    } catch (error) {
        console.log('Error en listarTarasClienteController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};

export const crearTaraClienteController = async (req, res) => {
    try {
        const {
            cliente_uuid,
            descripcion,
            peso_tara
        } = req.body;

        if (!cliente_uuid) {
            return res.status(400).json({
                success: false,
                message: 'El cliente es obligatorio.'
            });
        }

        if (peso_tara === undefined || peso_tara === null || peso_tara === '') {
            return res.status(400).json({
                success: false,
                message: 'El peso de tara es obligatorio.'
            });
        }

        if (Number(peso_tara) <= 0) {
            return res.status(400).json({
                success: false,
                message: 'El peso de tara debe ser mayor a 0.'
            });
        }

        const cliente = await buscarClientePorUuidModel(cliente_uuid);

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado.'
            });
        }

        const nuevaTara = await crearTaraClienteModel(
            cliente.id,
            descripcion?.trim() || null,
            Number(peso_tara)
        );

        return res.status(201).json({
            success: true,
            message: 'Tara registrada correctamente.',
            data: nuevaTara
        });

    } catch (error) {
        console.log('Error en crearTaraClienteController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};

export const actualizarTaraClienteController = async (req, res) => {
    try {
        const { uuid } = req.params;

        const {
            descripcion,
            peso_tara
        } = req.body;

        if (!uuid) {
            return res.status(400).json({
                success: false,
                message: 'El UUID es obligatorio.'
            });
        }

        if (peso_tara !== undefined) {
            if (peso_tara === null || peso_tara === '') {
                return res.status(400).json({
                    success: false,
                    message: 'El peso de tara no puede estar vacío.'
                });
            }

            if (Number(peso_tara) <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El peso de tara debe ser mayor a 0.'
                });
            }
        }

        const taraActualizada = await actualizarTaraClienteModel(
            uuid,
            descripcion?.trim() || null,
            peso_tara !== undefined ? Number(peso_tara) : null
        );

        if (!taraActualizada) {
            return res.status(404).json({
                success: false,
                message: 'Tara no encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Tara actualizada correctamente.',
            data: taraActualizada
        });

    } catch (error) {
        console.log('Error en actualizarTaraClienteController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};

export const cambiarEstadoTaraClienteController = async (req, res) => {
    try {
        const { uuid } = req.params;

        if (!uuid) {
            return res.status(400).json({
                success: false,
                message: 'El UUID es obligatorio.'
            });
        }

        const tara = await cambiarEstadoTaraClienteModel(uuid);

        if (!tara) {
            return res.status(404).json({
                success: false,
                message: 'Tara no encontrada.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Estado actualizado correctamente.',
            data: tara
        });

    } catch (error) {
        console.log('Error en cambiarEstadoTaraClienteController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};