import { apiClient } from './apiClient';

export const voluntaryService = {
  async create(data) {
    try {
      const response = await apiClient.post('/api/voluntaries', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAll() {
    try {
      const response = await apiClient.get('/api/voluntaries');
      return response.data || [];
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(`/api/voluntaries/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await apiClient.put(`/api/voluntaries/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async patch(id, data) {
    try {
      const response = await apiClient.patch(`/api/voluntaries/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/api/voluntaries/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};