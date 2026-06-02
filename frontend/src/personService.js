import { apiClient } from './apiClient';

export const personService = {
  async create(data) {
    try {
      const response = await apiClient.post('/api/people', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await apiClient.get(`/api/people/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async update(id, data) {
    try {
      const response = await apiClient.put(`/api/people/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async findOrCreate(data) {
    try {
      const existingPerson = await apiClient.get(`/api/people/${data.idAddress}`);
      if (existingPerson) {
        await apiClient.put(`/api/people/${data.idAddress}`, data);
        return existingPerson;
      } else {
        const newPerson = await apiClient.post('/api/people', data);
        return newPerson.data;
      }
    } catch (error) {
      throw error;
    }
  }
};
