import { apiClient } from './apiClient';

export const itemService = {
  async create(data) {
    try {
      const response = await apiClient.post('/api/items', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAll() {
    try {
      const response = await apiClient.get('/api/items');
      return response.data || [];
    } catch (error) {
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