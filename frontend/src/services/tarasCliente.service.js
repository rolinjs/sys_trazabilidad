import axios from "axios";

const API_URL = "http://localhost:3000/api/taras-cliente";

export const listarTarasClienteService = async () => {
  const response = await axios.get(`${API_URL}/listar-taras-cliente`);
  return response.data;
};

export const crearTaraClienteService = async (body) => {
  const response = await axios.post(`${API_URL}/crear-tara-cliente`, body);
  return response.data;
};

export const cambiarEstadoTaraClienteService = async (uuid) => {
  const response = await axios.patch(
    `${API_URL}/cambiar-estado-tara-cliente/${uuid}`
  );

  return response.data;
};

export const actualizarTaraClienteService = async (uuid, body) => {
  const response = await axios.put(
    `${API_URL}/actualizar-tara-cliente/${uuid}`,
    body
  );

  return response.data;
};