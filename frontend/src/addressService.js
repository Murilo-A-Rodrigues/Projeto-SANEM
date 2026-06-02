import { apiClient } from './apiClient';

export const addressService = {
  async create(data) {
    try {
      const response = await apiClient.post('/api/addresses', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async findOrCreate(data) {
    try {
      // Primeiro tenta buscar se já existe
      const all = await this.getAll();
      const existing = all.find(addr => 
        addr.street === data.street && 
        addr.number === data.number && 
        addr.neighborhood === data.neighborhood
      );
      
      if (existing) {
        return existing;
      }
      
      // Se não existe, cria
      return await this.create(data);
    } catch (error) {
      throw error;
    }
  },

  async getAll() {
    try {
      const response = await apiClient.get('/api/addresses');
      return response.data || [];
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(`/api/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await apiClient.put(`/api/addresses/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/api/addresses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
