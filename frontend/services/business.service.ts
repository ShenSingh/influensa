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
      const response = await apiClient.post('/api/businessDetails/', businessData);
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

  // Toggle business active status
  async toggleBusinessStatus(id: string, isActive: boolean): Promise<Business> {
    try {
      const response = await apiClient.patch(`/api/businessDetails/${id}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Error toggling business status:', error);
      throw error;
    }
  }

  // Search businesses with filters
  async searchBusinesses(filters: BusinessFilters): Promise<Business[]> {
    try {
      const params = new URLSearchParams();

      if (filters.industry) params.append('industry', filters.industry);
      if (filters.businessType) params.append('businessType', filters.businessType);
      if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
      if (filters.minBudget) params.append('minBudget', filters.minBudget.toString());
      if (filters.maxBudget) params.append('maxBudget', filters.maxBudget.toString());

      const response = await apiClient.get(`/api/businessDetails/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error searching businesses:', error);
      throw error;
    }
  }

  // Get business analytics/stats
  async getBusinessAnalytics(id: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/businessDetails/${id}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching business analytics:', error);
      throw error;
    }
  }

  // Validate business data before submission
  validateBusinessData(businessData: CreateBusinessRequest | UpdateBusinessRequest): string[] {
    const errors: string[] = [];

    if ('businessName' in businessData && !businessData.businessName?.trim()) {
      errors.push('Business name is required');
    }

    if ('email' in businessData && businessData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(businessData.email)) {
        errors.push('Invalid email format');
      }
    }

    if ('phone' in businessData && businessData.phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(businessData.phone.replace(/[\s\-\(\)]/g, ''))) {
        errors.push('Invalid phone number format');
      }
    }


    return errors;
  }
}

export default new BusinessService();
