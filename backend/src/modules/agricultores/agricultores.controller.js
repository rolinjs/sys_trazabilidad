import {
    listarAgricultoresModel,
    contarAgricultoresModel,
    buscarAgricultorPorClpModel,
    buscarAgricultorPorDniRucModel,
    crearAgricultorModel,
    buscarAgricultorPorDniRucEditarModel,
    actualizarAgricultorModel,
    cambiarEstadoAgricultorModel
} from './agricultores.model.js';

export const listarAgricultoresController = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const buscar = req.query.buscar?.trim() || null;

        const offset = (page - 1) * limit;

        const agricultores = await listarAgricultoresModel(
            limit,
            offset,
            buscar
        );

        const total = await contarAgricultoresModel(buscar);

        return res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: agricultores
        });

    } catch (error) {
        console.log('Error en listarAgricultoresController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};

export const crearAgricultorController = async (req, res) => {
    try {
        const {
            clp_senasa,
            nombres,
            apellidos,
            dni_ruc,
            zona_produccion,
            sector,
            sub_sector,
            distrito,
            provincia,
            departamento,
            hectareas,
            cantidad_plantas,
            telefono
        } = req.body;

        if (!clp_senasa || clp_senasa.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El CLP/SENASA es obligatorio.'
            });
        }

        if (!/^\d{10}$/.test(clp_senasa.trim())) {
            return res.status(400).json({
                success: false,
                message: 'El CLP/SENASA debe tener exactamente 10 dígitos.'
            });
        }

        if (!nombres || nombres.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Los nombres son obligatorios.'
            });
        }

        if (!apellidos || apellidos.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Los apellidos son obligatorios.'
            });
        }

        if (!dni_ruc || dni_ruc.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El DNI/RUC es obligatorio.'
            });
        }

        const clpExiste = await buscarAgricultorPorClpModel(
            clp_senasa.trim()
        );

        if (clpExiste) {
            return res.status(409).json({
                success: false,
                message: 'El CLP/SENASA ya se encuentra registrado.'
            });
        }

        const dniRucExiste = await buscarAgricultorPorDniRucModel(
            dni_ruc.trim()
        );

        if (dniRucExiste) {
            return res.status(409).json({
                success: false,
                message: 'El DNI/RUC ya se encuentra registrado.'
            });
        }

        const nuevoAgricultor = await crearAgricultorModel(
            clp_senasa.trim(),
            nombres.trim().toUpperCase(),
            apellidos.trim().toUpperCase(),
            dni_ruc.trim(),
            zona_produccion?.trim() || null,
            sector?.trim() || null,
            sub_sector?.trim() || null,
            distrito?.trim() || null,
            provincia?.trim() || null,
            departamento?.trim() || null,
            hectareas !== undefined ? Number(hectareas) : 0,
            cantidad_plantas !== undefined ? Number(cantidad_plantas) : 0,
            telefono?.trim() || null
        );

        return res.status(201).json({
            success: true,
            message: 'Agricultor registrado correctamente.',
            data: nuevoAgricultor
        });

    } catch (error) {
        console.log('Error en crearAgricultorController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};

export const actualizarAgricultorController = async (req, res) => {
    try {
        const { uuid } = req.params;

        const {
            nombres,
            apellidos,
            dni_ruc,
            zona_produccion,
            sector,
            sub_sector,
            distrito,
            provincia,
            departamento,
            hectareas,
            cantidad_plantas,
            telefono
        } = req.body;

        if (!uuid) {
            return res.status(400).json({
                success: false,
                message: 'El UUID es obligatorio.'
            });
        }

        if (nombres !== undefined && nombres.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Los nombres no pueden estar vacíos.'
            });
        }

        if (apellidos !== undefined && apellidos.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Los apellidos no pueden estar vacíos.'
            });
        }

        if (dni_ruc !== undefined) {
            if (dni_ruc.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'El DNI/RUC no puede estar vacío.'
                });
            }

            const dniRucExiste = await buscarAgricultorPorDniRucEditarModel(
                dni_ruc.trim(),
                uuid
            );

            if (dniRucExiste) {
                return res.status(409).json({
                    success: false,
                    message: 'El DNI/RUC ya se encuentra registrado.'
                });
            }
        }

        if (hectareas !== undefined && Number(hectareas) < 0) {
            return res.status(400).json({
                success: false,
                message: 'Las hectáreas no pueden ser negativas.'
            });
        }

        if (cantidad_plantas !== undefined && Number(cantidad_plantas) < 0) {
            return res.status(400).json({
                success: false,
                message: 'La cantidad de plantas no puede ser negativa.'
            });
        }

        const agricultorActualizado = await actualizarAgricultorModel(
            uuid,
            nombres?.trim().toUpperCase() || null,
            apellidos?.trim().toUpperCase() || null,
            dni_ruc?.trim() || null,
            zona_produccion?.trim() || null,
            sector?.trim() || null,
            sub_sector?.trim() || null,
            distrito?.trim() || null,
            provincia?.trim() || null,
            departamento?.trim() || null,
            hectareas !== undefined ? Number(hectareas) : null,
            cantidad_plantas !== undefined ? Number(cantidad_plantas) : null,
            telefono?.trim() || null
        );

        if (!agricultorActualizado) {
            return res.status(404).json({
                success: false,
                message: 'Agricultor no encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Agricultor actualizado correctamente.',
            data: agricultorActualizado
        });

    } catch (error) {
        console.log('Error en actualizarAgricultorController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};

export const cambiarEstadoAgricultorController = async (req, res) => {
    try {
        const { uuid } = req.params;

        if (!uuid) {
            return res.status(400).json({
                success: false,
                message: 'El UUID es obligatorio.'
            });
        }

        const agricultor = await cambiarEstadoAgricultorModel(uuid);

        if (!agricultor) {
            return res.status(404).json({
                success: false,
                message: 'Agricultor no encontrado.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Estado actualizado correctamente.',
            data: agricultor
        });

    } catch (error) {
        console.log('Error en cambiarEstadoAgricultorController:', error);

        return res.status(500).json({
            success: false,
            message: 'Hubo problemas en el servidor.'
        });
    }
};