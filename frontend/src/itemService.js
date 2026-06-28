import { apiClient } from './apiClient';

export const itemService = {
  async testConnection() {
    try {
      const response = await apiClient.get('/api/test');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async create(data) {
    try {
      const response = await apiClient.post('/api/items', data);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar item:", error.response?.data || error.message);
      throw error;
    }
  },

  async getAll() {
    const url = '/api/items';
    console.log("Buscando itens em:", url, "- baseURL:", apiClient.defaults.baseURL);
    try {
      const response = await apiClient.get(url);
      console.log("Resposta de /api/items:", response.data);
      return response.data || [];
    } catch (error) {
      console.error("Erro ao buscar itens. URL:", apiClient.defaults.baseURL + url, "Erro:", error.message);
      if (error.code === "ERR_NETWORK") {
        console.error("DICA: Backend indisponível ou bloqueado (CORS/rede). Teste no navegador:", apiClient.defaults.baseURL + url);
      }
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(`/api/items/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/api/items/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async patch(id, data) {
    try {
      const response = await apiClient.patch(`/api/items/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};