import {
    listarClientesModel,
    buscarClientePorCodigoModel,
    buscarClientePorRucModel,
    crearClienteModel,
    buscarClientePorCodigoEditarModel,
    buscarClientePorRucEditarModel,
    actualizarClienteModel,
    cambiarEstadoClienteModel
} from './clientes.model.js';

/**
 * Controlador para listar clientes
 */
export const listarClientesController = async (req, res) => {
    try {
        const clientes = await listarClientesModel();

        return res.status(200).json({
            success: true,
            data: clientes
        });

    } catch (error) {
        console.log('Error en listarClientesController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo un error en el servidor.'
        });
    }
};

/**
 * Controlador para actualizar cliente
 */
export const crearClienteController = async (req, res) => {
    try {
        const {
            codigo,
            razon_social,
            ruc,
            direccion_fiscal,
            representante_legal,
            telefono_principal,
            correo_principal,
            persona_contacto_planta,
            telefono_contacto,
            correo_contacto
        } = req.body;

        if (!codigo || codigo.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El código del cliente es obligatorio.'
            });
        }

        if (!razon_social || razon_social.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'La razón social es obligatoria.'
            });
        }

        if (!ruc || ruc.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El RUC es obligatorio.'
            });
        }

        if (codigo.trim().length > 10) {
            return res.status(400).json({
                success: false,
                message: 'El código no debe superar los 10 caracteres.'
            });
        }

        if (razon_social.trim().length > 150) {
            return res.status(400).json({
                success: false,
                message: 'La razón social no debe superar los 150 caracteres.'
            });
        }

        if (ruc.trim().length !== 11) {
            return res.status(400).json({
                success: false,
                message: 'El RUC debe tener 11 dígitos.'
            });
        }

        const codigoExiste = await buscarClientePorCodigoModel(codigo.trim());

        if (codigoExiste) {
            return res.status(409).json({
                success: false,
                message: 'El código del cliente ya se encuentra registrado.'
            });
        }

        const rucExiste = await buscarClientePorRucModel(ruc.trim());

        if (rucExiste) {
            return res.status(409).json({
                success: false,
                message: 'El RUC ya se encuentra registrado.'
            });
        }

        const nuevoCliente = await crearClienteModel(
            codigo.trim(),
            razon_social.trim().toUpperCase(),
            ruc.trim(),
            direccion_fiscal?.trim() || null,
            representante_legal?.trim() || null,
            telefono_principal?.trim() || null,
            correo_principal?.trim() || null,
            persona_contacto_planta?.trim() || null,
            telefono_contacto?.trim() || null,
            correo_contacto?.trim() || null
        );

        return res.status(201).json({
            success: true,
            message: 'Cliente registrado correctamente.',
            data: nuevoCliente
        });

    } catch (error) {
        console.log('Error en crearClienteController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo un error en el servidor.'
        });
    }
};

/**
 * Controlador para actualizar cliente
 */
export const actualizarClienteController = async (req, res) => {
    try {
        const { uuid } = req.params;

        const {
            razon_social,
            ruc,
            direccion_fiscal,
            representante_legal,
            telefono_principal,
            correo_principal,
            persona_contacto_planta,
            telefono_contacto,
            correo_contacto
        } = req.body;

        if (!uuid) {
            return res.status(400).json({
                success: false,
                message: 'El UUID es obligatorio.'
            });
        }

        if (ruc !== undefined && ruc.trim().length !== 11) {
            return res.status(400).json({
                success: false,
                message: 'El RUC debe tener 11 dígitos.'
            });
        }

        if (ruc !== undefined) {
            const rucExiste = await buscarClientePorRucEditarModel(
                ruc.trim(),
                uuid
            );

            if (rucExiste) {
                return res.status(409).json({
                    success: false,
                    message: 'El RUC ya se encuentra registrado.'
                });
            }
        }

        const clienteActualizado = await actualizarClienteModel(
            uuid,
            razon_social?.trim().toUpperCase() || null,
            ruc?.trim() || null,
            direccion_fiscal?.trim() || null,
            representante_legal?.trim() || null,
            telefono_principal?.trim() || null,
            correo_principal?.trim() || null,
            persona_contacto_planta?.trim() || null,
            telefono_contacto?.trim() || null,
            correo_contacto?.trim() || null
        );

        if (!clienteActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Cliente actualizado correctamente.',
            data: clienteActualizado
        });

    } catch (error) {
        console.log('Error en actualizarClienteController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};

/**
 * Controlador para cambiar estado - clientes
 */

export const cambiarEstadoClienteController = async (
    req,
    res
) => {
    try {

        const { uuid } = req.params;

        if (!uuid) {
            return res.status(400).json({
                success: false,
                message: 'El UUID es obligatorio.'
            });
        }

        const cliente =
            await cambiarEstadoClienteModel(uuid);

        if (!cliente) {
            return res.status(404).json({
                success: false,
                message: 'Cliente no encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Estado actualizado correctamente.',
            data: cliente
        });

    } catch (error) {

        console.log(
            'Error en cambiarEstadoClienteController:',
            error
        );

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};