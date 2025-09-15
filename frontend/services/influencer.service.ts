import apiClient from './config/apiClient';
import { Influencer, CreateInfluencerRequest, UpdateInfluencerRequest } from '../types/Influencer';

class InfluencerService {
  // Get all influencers
  async getAllInfluencers(): Promise<Influencer[]> {
    try {
      const response = await apiClient.get('/api/influencer/getAll');
      return response.data;
    } catch (error) {
      console.error('Error fetching influencers:', error);
      throw error;
    }
  }

  // Get influencer by ID
  async getInfluencerById(id: string): Promise<Influencer> {
    try {
      const response = await apiClient.get(`/api/influencer/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching influencer:', error);
      throw error;
    }
  }

  // Create new influencer
  async createInfluencer(influencerData: CreateInfluencerRequest): Promise<Influencer> {
    try {
      const response = await apiClient.post('/api/influencer/', influencerData);
      return response.data;
    } catch (error) {
      console.error('Error creating influencer:', error);
      throw error;
    }
  }

  // Update influencer
  async updateInfluencer(id: string, influencerData: UpdateInfluencerRequest): Promise<Influencer> {
    try {
      const response = await apiClient.put(`/api/influencer/${id}`, influencerData);
      return response.data;
    } catch (error) {
      console.error('Error updating influencer:', error);
      throw error;
    }
  }

  // Delete influencer
  async deleteInfluencer(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/influencer/${id}`);
    } catch (error) {
      console.error('Error deleting influencer:', error);
      throw error;
    }
  }
}

export default new InfluencerService();
