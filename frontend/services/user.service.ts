import apiClient from './config/apiClient';
import { GetUser } from '@/types/User';

export interface UpdateUserRequest {
  userName?: string;
  email?: string;
  profileImage?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

class UserService {
  // Get current user profile
  async getUserProfile(): Promise<GetUser> {
    try {
      const response = await apiClient.get('/api/user/getUserByToken');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userData: UpdateUserRequest): Promise<GetUser> {
    try {
      // First get the current user to get their ID
      const currentUser = await this.getUserProfile();
      const response = await apiClient.put(`/api/user/${currentUser._id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(passwordData: ChangePasswordRequest): Promise<void> {
    try {
      await apiClient.put('/api/user/change-password', passwordData);
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    try {
      await apiClient.post('/api/user/forgot-password', { email });
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      throw error;
    }
  }

  // Upload profile image
  async uploadProfileImage(imageFile: FormData): Promise<string> {
    try {
      const response = await apiClient.post('/api/user/upload-image', imageFile, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  }
}

export default new UserService();
