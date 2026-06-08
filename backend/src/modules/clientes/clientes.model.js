import { pool } from '../../config/db.js';

/**
 * Modelo para listar clientes
 */
export const listarClientesModel = async () => {
    const sql = `
        SELECT
            id, uuid, codigo, razon_social, ruc,
            direccion_fiscal, representante_legal,
            telefono_principal, correo_principal,
            persona_contacto_planta, telefono_contacto, correo_contacto,
            estado, fecha_creacion, fecha_actualizacion
        FROM clientes
        ORDER BY id DESC
    `;

    const { rows } = await pool.query(sql);
    return rows;
};

/**
 * Modelo para buscar cliente por Código
 */

export const buscarClientePorCodigoModel = async (codigo) => {
    const sql = `
        SELECT id
        FROM clientes
        WHERE codigo = $1
    `;

    const { rows } = await pool.query(sql, [codigo]);
    return rows[0];
};

/**
 * Modelo para buscar cliente por RUC
 */
export const buscarClientePorRucModel = async (ruc) => {
    const sql = `
        SELECT id
        FROM clientes
        WHERE ruc = $1
    `;

    const { rows } = await pool.query(sql, [ruc]);
    return rows[0];
};

/**
 * Modelo para crear cliente
 */

export const crearClienteModel = async (
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
) => {
    const sql = `
        INSERT INTO clientes (
            codigo, razon_social, ruc,
            direccion_fiscal, representante_legal,
            telefono_principal, correo_principal,
            persona_contacto_planta, telefono_contacto, correo_contacto
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *
    `;

    const values = [
        codigo,
        razon_social,
        ruc,
        direccion_fiscal || null,
        representante_legal || null,
        telefono_principal || null,
        correo_principal || null,
        persona_contacto_planta || null,
        telefono_contacto || null,
        correo_contacto || null
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
};

/**
 * Modelo para buscar cliente por codigo
 */
export const buscarClientePorCodigoEditarModel = async (
    codigo,
    uuid
) => {
    const sql = `
        SELECT id
        FROM clientes
        WHERE codigo = $1
        AND uuid <> $2
    `;

    const { rows } = await pool.query(sql, [codigo, uuid]);
    return rows[0];
};

/**
 * Modelo para buscar cliente por RUC
 */
export const buscarClientePorRucEditarModel = async (
    ruc,
    uuid
) => {
    const sql = `
        SELECT id
        FROM clientes
        WHERE ruc = $1
        AND uuid <> $2
    `;

    const { rows } = await pool.query(sql, [ruc, uuid]);
    return rows[0];
};

/**
 * Modelo para actualizar cliente
 */
export const actualizarClienteModel = async (
    uuid,
    razon_social,
    ruc,
    direccion_fiscal,
    representante_legal,
    telefono_principal,
    correo_principal,
    persona_contacto_planta,
    telefono_contacto,
    correo_contacto
) => {
    const sql = `
        UPDATE clientes
        SET
            razon_social = COALESCE($1, razon_social),
            ruc = COALESCE($2, ruc),
            direccion_fiscal = COALESCE($3, direccion_fiscal),
            representante_legal = COALESCE($4, representante_legal),
            telefono_principal = COALESCE($5, telefono_principal),
            correo_principal = COALESCE($6, correo_principal),
            persona_contacto_planta = COALESCE($7, persona_contacto_planta),
            telefono_contacto = COALESCE($8, telefono_contacto),
            correo_contacto = COALESCE($9, correo_contacto),
            fecha_actualizacion = NOW()
        WHERE uuid = $10
        RETURNING *
    `;

    const values = [
        razon_social,
        ruc,
        direccion_fiscal,
        representante_legal,
        telefono_principal,
        correo_principal,
        persona_contacto_planta,
        telefono_contacto,
        correo_contacto,
        uuid
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
};
/**
 * Modelo para cambiar estado - cliente
 */

export const cambiarEstadoClienteModel = async (uuid) => {

    const sql = `
        UPDATE clientes
        SET
            estado = CASE
                        WHEN estado = 1 THEN 0
                        ELSE 1
                     END,
            fecha_actualizacion = NOW()
        WHERE uuid = $1
        RETURNING *
    `;

    const { rows } = await pool.query(sql, [uuid]);

    return rows[0];
};