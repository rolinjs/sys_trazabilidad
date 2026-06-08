import { pool } from '../../config/db.js';

export const listarTiposProduccionModel = async () => {
    const sql = `
        SELECT
            id,
            uuid,
            codigo,
            nombre,
            descripcion,
            estado,
            fecha_creacion,
            fecha_actualizacion
        FROM tipos_produccion
        ORDER BY id DESC
    `;

    const { rows } = await pool.query(sql);
    return rows;
};

export const buscarTipoProduccionPorCodigoModel = async (codigo) => {
    const sql = `
        SELECT id
        FROM tipos_produccion
        WHERE UPPER(codigo) = UPPER($1)
    `;

    const { rows } = await pool.query(sql, [codigo]);
    return rows[0];
};

export const buscarTipoProduccionPorNombreModel = async (nombre) => {
    const sql = `
        SELECT id
        FROM tipos_produccion
        WHERE UPPER(nombre) = UPPER($1)
    `;

    const { rows } = await pool.query(sql, [nombre]);
    return rows[0];
};

export const crearTipoProduccionModel = async (
    codigo,
    nombre,
    descripcion
) => {
    const sql = `
        INSERT INTO tipos_produccion (
            codigo,
            nombre,
            descripcion
        )
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    const values = [
        codigo,
        nombre,
        descripcion
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
};

export const buscarTipoProduccionPorNombreEditarModel = async (
    nombre,
    uuid
) => {
    const sql = `
        SELECT id
        FROM tipos_produccion
        WHERE UPPER(nombre) = UPPER($1)
        AND uuid <> $2
    `;

    const { rows } = await pool.query(sql, [nombre, uuid]);
    return rows[0];
};

export const actualizarTipoProduccionModel = async (
    uuid,
    nombre,
    descripcion
) => {
    const sql = `
        UPDATE tipos_produccion
        SET
            nombre = COALESCE($1, nombre),
            descripcion = COALESCE($2, descripcion),
            fecha_actualizacion = NOW()
        WHERE uuid = $3
        RETURNING *
    `;

    const values = [
        nombre,
        descripcion,
        uuid
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
};

export const cambiarEstadoTipoProduccionModel = async (uuid) => {
    const sql = `
        UPDATE tipos_produccion
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