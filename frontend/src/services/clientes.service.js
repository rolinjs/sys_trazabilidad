import axios from 'axios';

/**
 * API GENERAL
 */

const API_URL = 'http://localhost:3000/api/clientes';

/**
 * 
 * LISTAR CLIENTES / EXPORTADORES
 */
export const listarClientesService = async () => {
    const response = await axios.get(
        `${API_URL}/listar-clientes`
    );
    return response.data;
}

/**
 * CREAR CLIENTES / EXPORTADORES
 */

export const crearClientesService = async (body) => {
    const response = await axios.post(`${API_URL}/crear-cliente`, body);
    return response.data;
}

/**
 * CAMBIAR ESTADO CLIENTE
 */

export const cambiarEstadoClienteService = async (uuid) => {
  const response = await axios.patch(
    `${API_URL}/cambiar-estado-cliente/${uuid}`
  );

  return response.data;
};

/**
 * ACTUALIZAR DATOS DEL CLIENTE / EXPORTADOR
 */
export const actualizarClientesService = async (uuid, body) => {
  const response = await axios.put(
    `${API_URL}/actualizar-cliente/${uuid}`,
    body
  );

  return response.data;
};