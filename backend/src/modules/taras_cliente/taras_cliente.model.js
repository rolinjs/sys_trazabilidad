import { pool } from '../../config/db.js';

export const listarTarasClienteModel = async () => {
    const sql = `
        SELECT
            tc.id,
            tc.uuid,
            tc.cliente_id,
            c.uuid AS cliente_uuid,
            c.codigo AS cliente_codigo,
            c.razon_social,
            tc.descripcion,
            tc.peso_tara,
            tc.estado,
            tc.fecha_creacion,
            tc.fecha_actualizacion
        FROM taras_cliente tc
        INNER JOIN clientes c ON c.id = tc.cliente_id
        ORDER BY tc.id DESC
    `;

    const { rows } = await pool.query(sql);
    return rows;
};

export const buscarClientePorUuidModel = async (cliente_uuid) => {
    const sql = `
        SELECT id
        FROM clientes
        WHERE uuid = $1
    `;

    const { rows } = await pool.query(sql, [cliente_uuid]);
    return rows[0];
};

export const crearTaraClienteModel = async (
    cliente_id,
    descripcion,
    peso_tara
) => {
    const sql = `
        INSERT INTO taras_cliente (
            cliente_id,
            descripcion,
            peso_tara
        )
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    const values = [
        cliente_id,
        descripcion || null,
        peso_tara
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
};

export const actualizarTaraClienteModel = async (
    uuid,
    descripcion,
    peso_tara
) => {
    const sql = `
        UPDATE taras_cliente
        SET
            descripcion = COALESCE($1, descripcion),
            peso_tara = COALESCE($2, peso_tara),
            fecha_actualizacion = NOW()
        WHERE uuid = $3
        RETURNING *
    `;

    const values = [
        descripcion,
        peso_tara,
        uuid
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
};

export const cambiarEstadoTaraClienteModel = async (uuid) => {
    const sql = `
        UPDATE taras_cliente
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