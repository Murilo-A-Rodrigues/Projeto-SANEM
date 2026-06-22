import { apiClient } from './apiClient';

export const donationService = {
  async create(data) {
    try {
      const response = await apiClient.post('/api/donations', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAll() {
    try {
      const response = await apiClient.get('/api/donations');
      return response.data || [];
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(`/api/donations/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};