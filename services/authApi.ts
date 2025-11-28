import { LoginCredentials, SignupCredentials } from '../types';
import apiClient from './api';

// Auth API service
export const authApi = {
  // Login user
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  // Signup user
  signup: async (userData: SignupCredentials) => {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw new Error('Signup failed');
    }
  },

  // Logout user
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('authToken');
    } catch (error) {
      throw new Error('Logout failed');
    }
  },

  // Forgot password
  forgotPassword: async (email: string) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw new Error('Failed to send reset instructions');
    }
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string) => {
    try {
      const response = await apiClient.post('/auth/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw new Error('Failed to reset password');
    }
  },
};

export default authApi;
