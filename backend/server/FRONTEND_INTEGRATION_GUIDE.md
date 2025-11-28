# Frontend Integration Guide

Complete guide for integrating the WeVersity backend API with your React Native Expo frontend.

## 📋 Table of Contents

1. [Setup](#setup)
2. [Authentication Integration](#authentication-integration)
3. [Role-Based Navigation](#role-based-navigation)
4. [Password Reset Flow](#password-reset-flow)
5. [API Service Layer](#api-service-layer)
6. [Testing](#testing)

## 🛠️ Setup

### 1. Environment Variables

Create a `.env` file in your project root:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Install Required Dependencies

```bash
npm install axios @react-native-async-storage/async-storage
```

### 3. API Service Configuration

Create `services/api.ts`:

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your backend URL
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:5000/api'  // Development
  : 'https://your-production-url.com/api';  // Production

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userRole');
      // Navigate to login
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 🔐 Authentication Integration

### 1. Auth Service

Create `services/authService.ts`:

```typescript
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SignupData {
  email: string;
  password: string;
  role: 'student' | 'teacher';
  fullName?: string;
  userName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  bio?: string;
  expertise?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  role: 'student' | 'teacher';
  token: string;
  user: any;
}

class AuthService {
  /**
   * Signup new user
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post('/auth/signup', data);
    
    if (response.data.success) {
      // Store token and role
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('userRole', response.data.role);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  /**
   * Login user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    
    if (response.data.success) {
      // Store token and role
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('userRole', response.data.role);
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
    }
    
    return response.data;
  }

  /**
   * Send OTP for password reset
   */
  async sendOTP(email: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  }

  /**
   * Verify OTP
   */
  async verifyOTP(email: string, otp: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/verify-otp', { email, otp });
    return response.data;
  }

  /**
   * Reset password
   */
  async resetPassword(email: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/reset-password', { email, newPassword });
    return response.data;
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.user;
  }

  /**
   * Logout
   */
  async logout() {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userRole');
    await AsyncStorage.removeItem('userData');
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  }

  /**
   * Get user role
   */
  async getUserRole(): Promise<'student' | 'teacher' | null> {
    const role = await AsyncStorage.getItem('userRole');
    return role as 'student' | 'teacher' | null;
  }
}

export default new AuthService();
```

### 2. Signup Screen Integration

Update your signup screen to use the new API:

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import authService from '../services/authService';

export default function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student' as 'student' | 'teacher',
    fullName: '',
    userName: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.signup(formData);
      
      Alert.alert(
        "Success",
        "Account created successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate based on role
              if (response.role === 'student') {
                router.replace('/student/home');
              } else {
                router.replace('/teacher/home');
              }
            }
          }
        ]
      );
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "An error occurred.";
      Alert.alert("Registration Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={formData.email}
        onChangeText={(text) => setFormData({...formData, email: text})}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={formData.password}
        onChangeText={(text) => setFormData({...formData, password: text})}
        secureTextEntry
      />
      {/* Add other form fields */}
      <TouchableOpacity onPress={handleSignup} disabled={loading}>
        <Text>{loading ? 'Signing up...' : 'Sign Up'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### 3. Login Screen Integration

Update your login screen:

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import authService from '../services/authService';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });

      // Navigate based on role
      if (response.role === 'student') {
        router.replace('/student/home');
      } else {
        router.replace('/teacher/home');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} disabled={loading}>
        {loading ? <ActivityIndicator /> : <Text>Login</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
        <Text>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## 🎯 Role-Based Navigation

### 1. Protected Route Component

Create `components/ProtectedRoute.tsx`:

```typescript
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import authService from '../services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'student' | 'teacher';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    const isAuth = await authService.isAuthenticated();
    
    if (!isAuth) {
      router.replace('/auth/login');
      return;
    }

    if (requiredRole) {
      const role = await authService.getUserRole();
      if (role !== requiredRole) {
        router.replace('/unauthorized');
      }
    }
  };

  return <>{children}</>;
}
```

### 2. App Entry Point

Update your app entry point `app/index.tsx`:

```typescript
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import authService from '../services/authService';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const isAuth = await authService.isAuthenticated();
    
    if (!isAuth) {
      router.replace('/auth/login');
      return;
    }

    const role = await authService.getUserRole();
    
    if (role === 'student') {
      router.replace('/student/home');
    } else if (role === 'teacher') {
      router.replace('/teacher/home');
    } else {
      router.replace('/auth/login');
    }
  };

  return null; // Or a loading screen
}
```

### 3. Role-Specific Screens

Use the protected route component in your screens:

```typescript
// app/student/home.tsx
import ProtectedRoute from '../../components/ProtectedRoute';

export default function StudentHome() {
  return (
    <ProtectedRoute requiredRole="student">
      {/* Your student home content */}
    </ProtectedRoute>
  );
}
```

## 🔑 Password Reset Flow

### 1. Forgot Password Screen

Create `app/auth/forgot-password.tsx`:

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import authService from '../../services/authService';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      await authService.sendOTP(email);
      Alert.alert('Success', 'OTP sent to your email');
      router.push({
        pathname: '/auth/verify-otp',
        params: { email },
      });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity onPress={handleSendOTP} disabled={loading}>
        <Text>{loading ? 'Sending...' : 'Send OTP'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### 2. OTP Verification Screen

Create `app/auth/verify-otp.tsx`:

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import authService from '../../services/authService';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 4) {
      Alert.alert('Error', 'Please enter 4-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await authService.verifyOTP(email as string, otp);
      Alert.alert('Success', 'OTP verified');
      router.push({
        pathname: '/auth/reset-password',
        params: { email },
      });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text>Enter OTP sent to {email}</Text>
      <TextInput
        placeholder="Enter 4-digit OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={4}
      />
      <TouchableOpacity onPress={handleVerifyOTP} disabled={loading}>
        <Text>{loading ? 'Verifying...' : 'Verify OTP'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

### 3. Reset Password Screen

Create `app/auth/reset-password.tsx`:

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import authService from '../../services/authService';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(email as string, newPassword);
      Alert.alert('Success', 'Password reset successfully', [
        {
          text: 'OK',
          onPress: () => router.replace('/auth/login'),
        },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleResetPassword} disabled={loading}>
        <Text>{loading ? 'Resetting...' : 'Reset Password'}</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## 🌐 API Service Layer

### 1. Enhanced API Service

Create `services/apiClient.ts`:

```typescript
import axios, { AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Redirect to login
      console.log('Unauthorized access - redirecting to login');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 2. User Service

Create `services/userService.ts`:

```typescript
import apiClient from './apiClient';

export const userService = {
  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data.user;
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  },

  // Update user profile
  updateUserProfile: async (data: any) => {
    try {
      const response = await apiClient.put('/auth/me', data);
      return response.data.user;
    } catch (error) {
      throw new Error('Failed to update profile');
    }
  },
};

export default userService;
```

## 🧪 Testing

### 1. Testing Endpoints with cURL

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "student",
    "fullName": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Protected Route:**
```bash
curl -X GET http://localhost:5000/api/students/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. Common Issues and Solutions

1. **"Network request failed"**
   - Ensure backend server is running
   - Check `API_BASE_URL` in `services/api.ts`
   - For Android emulator, use `http://10.0.2.2:5000/api`
   - For iOS simulator, use `http://localhost:5000/api`
   - For physical device, use your computer's IP: `http://192.168.x.x:5000/api`

2. **"401 Unauthorized"**
   - Token might be expired or invalid
   - Check if token is being sent in headers
   - Verify JWT_SECRET matches between frontend and backend

3. **OTP not received**
   - Check email configuration in `.env`
   - Look for OTP in console logs (development mode)
   - Verify Gmail app password is correct

## ✅ Checklist

- [ ] Backend server running
- [ ] Database schema applied
- [ ] Environment variables configured
- [ ] API service created
- [ ] Auth service implemented
- [ ] Signup screen updated
- [ ] Login screen created
- [ ] Forgot password flow implemented
- [ ] Role-based navigation working
- [ ] Protected routes implemented

## 🎉 You're Done!

Your frontend is now fully integrated with the backend. Users can:
- ✅ Sign up as student or teacher
- ✅ Login with email/password
- ✅ Reset password via OTP
- ✅ Access role-specific dashboards
- ✅ Make authenticated API requests