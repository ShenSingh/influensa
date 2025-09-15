import apiClient from './config/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Response from signup endpoint
export interface SignUpResponse {
  _id: string;
  userName: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Response from signin endpoint
export interface SignInResponse {
  _id: string;
  name: string;
  email: string;
  accessToken: string;
}

// Unified auth response for internal use
export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  accessToken: string;
}

export interface SignUpData {
  userName: string;
  email: string;
  password: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly USER_DATA_KEY = 'userData';

  // Sign up user
  async signUp(userData: SignUpData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/api/auth/signup', userData);
      const signUpData: SignUpResponse = response.data;

        console.log('Sign up successful:', signUpData);

        // Automatically sign in after successful sign up
        const signInResponse = await this.signIn({
            email: userData.email,
            password: userData.password
        });

        console.log(signInResponse);

      return signInResponse;
    } catch (error: any) {
      console.log(error);
      throw new Error(error.response?.data?.message || error.response?.data || 'Sign up failed');
    }
  }

  // Sign in user
  async signIn(credentials: SignInData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/api/auth/signin', credentials);
      const signInData: SignInResponse = response.data;

      console.log('Sign in successful:', signInData);

      // Transform the response to our internal format
      const authData: AuthResponse = {
        _id: signInData._id,
        name: signInData.name,
        email: signInData.email,
        accessToken: signInData.accessToken
      };

      // Store access token and user data
      await this.storeAuthData(authData);

      return authData;
    } catch (error: any) {
        console.log(error);
      throw new Error(error.response?.data?.message || error.response?.data || 'Sign in failed');
    }
  }

  // Sign out user
  async signOut(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');

      // Clear stored auth data
      await this.clearAuthData();
    } catch (error: any) {
      // Even if the API call fails, clear local data
      await this.clearAuthData();
      throw new Error(error.response?.data?.message || 'Sign out failed');
    }
  }

  // Refresh access token
  async refreshToken(): Promise<string> {
    try {
      const response = await apiClient.post('/api/auth/refresh-token');
      const newAccessToken = response.data.accessToken;

      // Store new access token
      await AsyncStorage.setItem(this.ACCESS_TOKEN_KEY, newAccessToken);

      return newAccessToken;
    } catch {
      // If refresh fails, clear auth data
      await this.clearAuthData();
      throw new Error('Token refresh failed');
    }
  }

  // Get stored access token
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch {
      console.error('Error getting access token');
      return null;
    }
  }

  // Get stored user data
  async getUserData(): Promise<AuthResponse | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch {
      console.error('Error getting user data');
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      return token !== null;
    } catch {
      return false;
    }
  }

  // Store authentication data
  private async storeAuthData(authData: AuthResponse): Promise<void> {
    try {
      console.log('token store successful:', authData);
      await AsyncStorage.setItem(this.ACCESS_TOKEN_KEY, authData.accessToken);
      await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(authData));
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  // Clear all authentication data
  private async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([this.ACCESS_TOKEN_KEY, this.USER_DATA_KEY]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  // Update user data in storage
  async updateUserData(userData: Partial<AuthResponse>): Promise<void> {
    try {
      const currentData = await this.getUserData();
      if (currentData) {
        const updatedData = { ...currentData, ...userData };
        await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(updatedData));
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      throw new Error('Failed to update user data');
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
