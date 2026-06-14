import axios from "axios";

const API_URL = "http://localhost:3000/api/agricultores";

export const listarAgricultoresService = async ({
  page = 1,
  limit = 5,
  buscar = ""
}) => {
  const response = await axios.get(`${API_URL}/listar-agricultores`, {
    params: {
      page,
      limit,
      buscar
    }
  });

  return response.data;
};

export const crearAgricultorService = async (body) => {
  const response = await axios.post(`${API_URL}/crear-agricultor`, body);
  return response.data;
};

export const actualizarAgricultorService = async (uuid, body) => {
  const response = await axios.put(
    `${API_URL}/actualizar-agricultor/${uuid}`,
    body
  );

  return response.data;
};

export const cambiarEstadoAgricultorService = async (uuid) => {
  const response = await axios.patch(
    `${API_URL}/cambiar-estado-agricultor/${uuid}`
  );

  return response.data;
};