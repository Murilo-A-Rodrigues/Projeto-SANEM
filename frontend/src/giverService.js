import { apiClient } from './apiClient';

export const giverService = {
  async create(data) {
    try {
      const response = await apiClient.post('/api/givers', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getAll() {
    try {
      const response = await apiClient.get('/api/givers');
      return response.data || [];
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(`/api/givers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await apiClient.put(`/api/givers/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async patch(id, data) {
    try {
      const response = await apiClient.patch(`/api/givers/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await apiClient.delete(`/api/givers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};