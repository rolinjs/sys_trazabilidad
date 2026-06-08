import { pool } from '../../config/db.js';

export const listarAgricultoresModel = async (limit, offset, buscar) => {
    const sql = `
        SELECT
            id,
            uuid,
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
            telefono,
            estado,
            fecha_creacion,
            fecha_actualizacion
        FROM agricultores
        WHERE
            $3::TEXT IS NULL
            OR clp_senasa ILIKE '%' || $3 || '%'
            OR dni_ruc ILIKE '%' || $3 || '%'
            OR nombres ILIKE '%' || $3 || '%'
            OR apellidos ILIKE '%' || $3 || '%'
        ORDER BY id DESC
        LIMIT $1 OFFSET $2
    `;

    const values = [limit, offset, buscar || null];

    const { rows } = await pool.query(sql, values);
    return rows;
};

export const contarAgricultoresModel = async (buscar) => {
    const sql = `
        SELECT COUNT(*)::INT AS total
        FROM agricultores
        WHERE
            $1::TEXT IS NULL
            OR clp_senasa ILIKE '%' || $1 || '%'
            OR dni_ruc ILIKE '%' || $1 || '%'
            OR nombres ILIKE '%' || $1 || '%'
            OR apellidos ILIKE '%' || $1 || '%'
    `;

    const { rows } = await pool.query(sql, [buscar || null]);
    return rows[0].total;
};

export const buscarAgricultorPorClpModel = async (clp_senasa) => {
    const sql = `
        SELECT id
        FROM agricultores
        WHERE clp_senasa = $1
    `;

    const { rows } = await pool.query(sql, [clp_senasa]);
    return rows[0];
};

export const buscarAgricultorPorDniRucModel = async (dni_ruc) => {
    const sql = `
        SELECT id
        FROM agricultores
        WHERE dni_ruc = $1
    `;

    const { rows } = await pool.query(sql, [dni_ruc]);
    return rows[0];
};

export const crearAgricultorModel = async (
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
) => {
    const sql = `
        INSERT INTO agricultores (
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
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        RETURNING *
    `;

    const values = [
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
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
};

export const buscarAgricultorPorDniRucEditarModel = async (
    dni_ruc,
    uuid
) => {
    const sql = `
        SELECT id
        FROM agricultores
        WHERE dni_ruc = $1
        AND uuid <> $2
    `;

    const { rows } = await pool.query(sql, [dni_ruc, uuid]);
    return rows[0];
};

export const actualizarAgricultorModel = async (
    uuid,
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
) => {
    const sql = `
        UPDATE agricultores
        SET
            nombres = COALESCE($1, nombres),
            apellidos = COALESCE($2, apellidos),
            dni_ruc = COALESCE($3, dni_ruc),
            zona_produccion = COALESCE($4, zona_produccion),
            sector = COALESCE($5, sector),
            sub_sector = COALESCE($6, sub_sector),
            distrito = COALESCE($7, distrito),
            provincia = COALESCE($8, provincia),
            departamento = COALESCE($9, departamento),
            hectareas = COALESCE($10, hectareas),
            cantidad_plantas = COALESCE($11, cantidad_plantas),
            telefono = COALESCE($12, telefono),
            fecha_actualizacion = NOW()
        WHERE uuid = $13
        RETURNING *
    `;

    const values = [
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
        telefono,
        uuid
    ];

    const { rows } = await pool.query(sql, values);
    return rows[0];
};

export const cambiarEstadoAgricultorModel = async (uuid) => {
    const sql = `
        UPDATE agricultores
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