export type UserRole = 'student' | 'teacher';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    fullName?: string;
    userName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    bio?: string;
    expertise?: string;
    createdAt: Date;
    emailVerified?: boolean;
}

export interface UserProfile {
    id: string;
    user_id: string;
    role: UserRole;
    full_name?: string;
    user_name?: string;
    phone_number?: string;
    avatar_url?: string;
    bio?: string;
    expertise?: string;
    created_at: string;
    updated_at: string;
}

export interface OTP {
    id?: string;
    email: string;
    otp: string;
    expiresAt: Date;
    createdAt?: Date;
}

export interface SignupRequest {
    email: string;
    password: string;
    role: UserRole;
    fullName?: string;
    userName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    bio?: string;
    expertise?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    role: UserRole;
    token: string;
    user: User;
}

export interface SendOTPRequest {
    email: string;
}

export interface VerifyOTPRequest {
    email: string;
    otp: string;
}

export interface ResetPasswordRequest {
    email: string;
    newPassword: string;
}
