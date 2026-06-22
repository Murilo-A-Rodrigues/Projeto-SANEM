import { apiClient } from './apiClient';

export const transferService = {
  async create(data) {
    try {
      const response = await apiClient.post('/api/transfers', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAll() {
    try {
      const response = await apiClient.get('/api/transfers');
      return response.data || [];
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(`/api/transfers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/api/transfers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};