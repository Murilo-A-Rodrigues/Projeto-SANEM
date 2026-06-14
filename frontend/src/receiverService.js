import { apiClient } from './apiClient';

export const receiverService = {
  async create(data) {
    try {
      const response = await apiClient.post('/api/receivers', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAll() {
    try {
      const response = await apiClient.get('/api/receivers');
      return response.data || [];
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(`/api/receivers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await apiClient.put(`/api/receivers/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/api/receivers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
