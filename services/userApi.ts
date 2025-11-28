import { User } from '../types';
import apiClient from './api';

// User API service
export const userApi = {
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await apiClient.get('/user/profile');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  },

  // Update user profile
  updateUserProfile: async (userData: Partial<User>) => {
    try {
      const response = await apiClient.put('/user/profile', userData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  },

  // Get user transactions
  getUserTransactions: async () => {
    try {
      const response = await apiClient.get('/user/transactions');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch transactions');
    }
  },

  // Get user notifications
  getUserNotifications: async () => {
    try {
      const response = await apiClient.get('/user/notifications');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch notifications');
    }
  },
};

export default userApi;
