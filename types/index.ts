// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'teacher';
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  thumbnail: string;
  rating: number;
  students: number;
}

// Live Class Types
export interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  viewers: number;
  thumbnail: string;
  isLive: boolean;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
  confirmPassword: string;
}
