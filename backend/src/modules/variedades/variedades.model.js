import { pool } from '../../config/db.js';

/**
 * Modelo para listar variedades
 */
export const listarVariedadesModel = async () => {
    const sql = `
        SELECT 
            id, 
            uuid, 
            codigo, 
            nombre, 
            estado, 
            fecha_creacion, 
            fecha_actualizacion 

        FROM variedades
        ORDER BY id DESC
    `;
    const { rows } = await pool.query(sql);
    return rows;
}

/**
 * Modelo para buscar variedad por código
 */

export const buscarVariedadPorCodigoModel = async (codigo) => {
    const sql = `
        SELECT id
            FROM variedades
        WHERE UPPER(codigo) = UPPER($1)
    `;
    const { rows } = await pool.query(sql, [codigo]);
    return rows[0];
}

/**
 * Modelo para buscar variedad por nombre
 */

export const buscarVariedadPorNombreModel = async (nombre) => {
    const sql = `
        SELECT id
        FROM variedades
        WHERE UPPER(nombre) = UPPER($1)
    `;
    const { rows } = await pool.query(sql, [nombre]);
    return rows[0];
}

/**
 * modelo para crear variedad Model
 */

export const crearVariedadModel = async ( codigo, nombre ) => {
    const sql = `
        INSERT INTO variedades (codigo, nombre) VALUES ($1, $2) RETURNING *
    `;
    const values = [codigo, nombre];
    const { rows } = await pool.query(sql, values);
    return rows[0];
}

/**
 * Actualizar variedad
 */

export const actualizarVariedadModel = async (
    uuid,
    codigo,
    nombre
) => {
    const sql = `
        UPDATE variedades
        SET
            codigo = $1,
            nombre = $2,
            fecha_actualizacion = NOW()
        WHERE uuid = $3
        RETURNING *
    `;

    const values = [
        codigo,
        nombre,
        uuid
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
};

/**
 * Modelo para ver duplicados
 */

export const buscarVariedadPorCodigoEditarModel = async (codigo, uuid) => {
    const sql = `
        SELECT id
        FROM variedades
        WHERE UPPER(codigo) = UPPER($1)
        AND uuid <> $2
    `;

    const { rows } = await pool.query(sql, [codigo, uuid]);
    return rows[0];
};

export const buscarVariedadPorNombreEditarModel = async (nombre, uuid) => {
    const sql = `
        SELECT id
        FROM variedades
        WHERE UPPER(nombre) = UPPER($1)
        AND uuid <> $2
    `;

    const { rows } = await pool.query(sql, [nombre, uuid]);
    return rows[0];
};

/**
 * Modelo para cambiar estado - variedad
 */
export const cambiarEstadoVariedadModel = async (uuid) => {
    const sql = `
        UPDATE variedades
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