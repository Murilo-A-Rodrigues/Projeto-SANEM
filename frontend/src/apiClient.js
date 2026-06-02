import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
});

const insertPerson = async (person) => {
  const { id_address, ...rest } = person;
  const existingAddress = await apiClient.get(`/api/addresses/${id_address}`);
  if (existingAddress) {
    // Atualizar o registro existente
    await apiClient.put(`/api/addresses/${id_address}`, rest);
  } else {
    // Inserir um novo registro
    await apiClient.post('/api/people', person);
  }
};

const getAddressById = async (id) => {
  try {
    const response = await apiClient.get(`/api/addresses/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { insertPerson, getAddressById, apiClient };