# Frontend Integration Guide

This guide explains how to integrate the WeVersity backend API with your existing React Native Expo frontend.

## 📋 Table of Contents

1. [Setup](#setup)
2. [API Service](#api-service)
3. [Authentication Integration](#authentication-integration)
4. [Screen Integration](#screen-integration)
5. [Role-Based Navigation](#role-based-navigation)

---

## 1. Setup

### Install Required Dependencies

Your app already has most dependencies. Ensure you have:

```bash
npm install axios @react-native-async-storage/async-storage
```

### Configure API Base URL

Create or update `services/api.ts`:

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

---

## 2. API Service

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

---

## 3. Authentication Integration

### Update Signup Screen

Update `app/auth/userSignUpPage.tsx`:

```typescript
import authService from '../../services/authService';

// In your handleRegister function:
const handleRegister = async () => {
  if (!validateForm()) {
    return;
  }

  const formattedPhoneNumber = phoneInput.current?.getNumberAfterPossiblyEliminatingZero()?.formattedNumber;

  if (!formattedPhoneNumber) {
    setPhoneError("Invalid phone number format.");
    return;
  }

  setLoading(true);
  try {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    const payload = {
      email: formData.email,
      password: formData.password,
      role: role === UserRole.Student ? 'student' : 'teacher',
      fullName,
      userName: formData.userName,
      phoneNumber: formattedPhoneNumber,
    };

    // Call backend API
    const response = await authService.signup(payload);

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
```

### Update Login Screen

Create or update `app/auth/login.tsx`:

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import authService from '../../services/authService';

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

---

## 4. Screen Integration

### Forgot Password Flow

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

### OTP Verification Screen

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

### Reset Password Screen

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

---

## 5. Role-Based Navigation

### Update App Entry Point

Update `app/index.tsx`:

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

### Protect Routes

Create a protected route wrapper `components/ProtectedRoute.tsx`:

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

Use in your screens:

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

---

## 📱 Testing the Integration

1. **Start Backend Server:**
   ```bash
   cd backend/server
   npm run dev
   ```

2. **Start Expo App:**
   ```bash
   npm start
   ```

3. **Test Flow:**
   - Signup as student → Should redirect to `/student/home`
   - Signup as teacher → Should redirect to `/teacher/home`
   - Login → Should redirect based on role
   - Forgot password → OTP flow → Reset password

---

## 🔧 Troubleshooting

### "Network request failed"

- Ensure backend server is running
- Check `API_BASE_URL` in `services/api.ts`
- For Android emulator, use `http://10.0.2.2:5000/api`
- For iOS simulator, use `http://localhost:5000/api`
- For physical device, use your computer's IP: `http://192.168.x.x:5000/api`

### "401 Unauthorized"

- Token might be expired or invalid
- Check if token is being sent in headers
- Verify JWT_SECRET matches between frontend and backend

---

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

---

## 🎉 You're Done!

Your frontend is now fully integrated with the backend. Users can:
- ✅ Sign up as student or teacher
- ✅ Login with email/password
- ✅ Reset password via OTP
- ✅ Access role-specific dashboards
- ✅ Make authenticated API requests
