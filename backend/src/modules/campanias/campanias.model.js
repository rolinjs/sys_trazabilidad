import { pool } from '../../config/db.js';

/**
 * Modelo para listar / obtener lista de campañas
 */
export const listarCampaniasModel = async () => {
    const sql = `
        SELECT 
            id,
            uuid,
            nombre,
            producto,
            fecha_inicio,
            fecha_fin,
            estado,
            observacion,
            fecha_creacion,
            fecha_actualizacion
        FROM campanias
        ORDER BY id DESC
    `;
    const { rows } = await pool.query(sql);
    
    return rows;
}

/**
 * Modelo para crear nueva campaña
 */

export const crearCampaniaModel = async (
    nombre, producto, fecha_inicio, fecha_fin, observacion
) => {
    const sql = `
        INSERT INTO campanias (
            nombre, producto, fecha_inicio, fecha_fin, observacion
        )
        VALUES($1, $2, $3, $4, $5)
        RETURNING *
    `;

    const values = [
        nombre, 
        producto, 
        fecha_inicio, 
        fecha_fin || null, 
        observacion || null
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
}

/**
 * Modelo para actualizar campañas
 */

export const actualizarCampaniaModel = async (
    uuid,
    nombre,
    producto,
    fecha_inicio,
    fecha_fin,
    observacion
) => {

    const sql = `
        UPDATE campanias
            SET
                nombre = $1,
                producto = $2,
                fecha_inicio = $3,
                fecha_fin = $4,
                observacion = $5,
                fecha_actualizacion = NOW()
            WHERE uuid = $6
            RETURNING *
    `;

    const values = [
        nombre,
        producto,
        fecha_inicio,
        fecha_fin || null,
        observacion || null,
        uuid
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];

}

/**
 * Modelo para cambiar estado
 */

export const cambiarEstadoCampaniaModel = async (uuid) => {

    const sql = `
        UPDATE campanias
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