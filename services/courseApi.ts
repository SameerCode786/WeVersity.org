import { Course } from '../types';
import apiClient from './api';

// Course API service
export const courseApi = {
  // Get all courses
  getAllCourses: async (): Promise<Course[]> => {
    try {
      const response = await apiClient.get('/courses');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch courses');
    }
  },

  // Get course by ID
  getCourseById: async (id: string): Promise<Course> => {
    try {
      const response = await apiClient.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch course details');
    }
  },

  // Get top mentors
  getTopMentors: async () => {
    try {
      const response = await apiClient.get('/mentors/top');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch mentors');
    }
  },

  // Bookmark a course
  bookmarkCourse: async (courseId: string) => {
    try {
      const response = await apiClient.post(`/courses/${courseId}/bookmark`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to bookmark course');
    }
  },

  // Get bookmarked courses
  getBookmarkedCourses: async (): Promise<Course[]> => {
    try {
      const response = await apiClient.get('/courses/bookmarked');
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch bookmarked courses');
    }
  },
};

export default courseApi;
