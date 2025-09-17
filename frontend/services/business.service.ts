import apiClient from './config/apiClient';
import { Business, CreateBusinessRequest, UpdateBusinessRequest, BusinessFilters } from '../types/Business';

class BusinessService {
  // Get all businesses for the authenticated user
  async getUserBusinesses(): Promise<Business[]> {
    try {
      const response = await apiClient.get('/api/businessDetails/user');
      return response.data;
    } catch (error) {
      console.error('Error fetching user businesses:', error);
      throw error;
    }
  }

  // Get business by ID
  async getBusinessById(id: string): Promise<Business> {
    try {
      const response = await apiClient.get(`/api/businessDetails/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching business:', error);
      throw error;
    }
  }

  // Create new business
  async createBusiness(businessData: CreateBusinessRequest): Promise<Business> {
    try {
      const response = await apiClient.post('/api/businessDetails', businessData);
      return response.data;
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  }

  // Update business
  async updateBusiness(id: string, businessData: UpdateBusinessRequest): Promise<Business> {
    try {
      const response = await apiClient.put(`/api/businessDetails/${id}`, businessData);
      return response.data;
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  }

  // Delete business
  async deleteBusiness(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/businessDetails/${id}`);
    } catch (error) {
      console.error('Error deleting business:', error);
      throw error;
    }
  }

  // Search businesses with filters
  async searchBusinesses(filters: BusinessFilters): Promise<Business[]> {
    try {
      const response = await apiClient.get('/api/businessDetails/search', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error searching businesses:', error);
      throw error;
    }
  }
}

export default new BusinessService();
