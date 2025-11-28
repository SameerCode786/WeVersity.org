import { Request, Response } from 'express';
import { config } from '../config';
import { supabaseAdmin } from '../config/supabase';
import {
    AuthResponse,
    LoginRequest,
    ResetPasswordRequest,
    SendOTPRequest,
    SignupRequest,
    User,
    VerifyOTPRequest
} from '../models/types';
import { sendOTPEmail, sendWelcomeEmail } from '../utils/email';
import { generateToken } from '../utils/jwt';
import { generateOTP, getOTPExpiry, isOTPExpired } from '../utils/otp';
import { comparePassword, hashPassword } from '../utils/password';

// Check if Supabase is configured
const isSupabaseConfigured = supabaseAdmin !== null;

/**
 * Signup Controller
 */
export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            email,
            password,
            role,
            fullName,
            userName,
            phoneNumber,
            avatarUrl,
            bio,
            expertise,
        }: SignupRequest = req.body;

        // If Supabase is not configured, return a mock response
        if (!isSupabaseConfigured) {
            // Generate JWT token
            const token = generateToken({
                userId: 'mock-user-id',
                email,
                role,
            });

            const user: User = {
                id: 'mock-user-id',
                email,
                role,
                fullName,
                userName,
                phoneNumber,
                avatarUrl,
                bio,
                expertise,
                createdAt: new Date(),
                emailVerified: false,
            };

            const response: AuthResponse = {
                success: true,
                role,
                token,
                user,
            };

            res.status(201).json(response);
            return;
        }

        // Check if user already exists
        const { data: existingUser } = await supabaseAdmin!
            .from('user_profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: 'User with this email already exists',
            });
            return;
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin!.auth.admin.createUser({
            email,
            password,
            email_confirm: false, // Require email verification
            user_metadata: {
                role,
                full_name: fullName,
                user_name: userName,
                phone_number: phoneNumber,
                avatar_url: avatarUrl,
                bio,
                expertise,
            },
        });

        if (authError || !authData.user) {
            throw new Error(authError?.message || 'Failed to create user');
        }

        // Create user profile in database
        const { data: profile, error: profileError } = await supabaseAdmin!
            .from('user_profiles')
            .insert({
                user_id: authData.user.id,
                email,
                password_hash: hashedPassword,
                role,
                full_name: fullName,
                user_name: userName,
                phone_number: phoneNumber,
                avatar_url: avatarUrl,
                bio,
                expertise,
            })
            .select()
            .single();

        if (profileError) {
            // Rollback: delete auth user if profile creation fails
            await supabaseAdmin!.auth.admin.deleteUser(authData.user.id);
            throw new Error(profileError.message);
        }

        // Send welcome email (non-blocking)
        if (fullName) {
            sendWelcomeEmail(email, fullName, role).catch(console.error);
        }

        // Generate JWT token
        const token = generateToken({
            userId: authData.user.id,
            email,
            role,
        });

        const user: User = {
            id: authData.user.id,
            email,
            role,
            fullName,
            userName,
            phoneNumber,
            avatarUrl,
            bio,
            expertise,
            createdAt: new Date(authData.user.created_at),
            emailVerified: authData.user.email_confirmed_at ? true : false,
        };

        const response: AuthResponse = {
            success: true,
            role,
            token,
            user,
        };

        res.status(201).json(response);
    } catch (error: any) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create account',
        });
    }
};

/**
 * Login Controller
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password }: LoginRequest = req.body;

        // If Supabase is not configured, return a mock response
        if (!isSupabaseConfigured) {
            // Generate JWT token
            const token = generateToken({
                userId: 'mock-user-id',
                email,
                role: 'student',
            });

            const user: User = {
                id: 'mock-user-id',
                email,
                role: 'student',
                createdAt: new Date(),
            };

            const response: AuthResponse = {
                success: true,
                role: 'student',
                token,
                user,
            };

            res.status(200).json(response);
            return;
        }

        // Get user from database
        const { data: profile, error: profileError } = await supabaseAdmin!
            .from('user_profiles')
            .select('*')
            .eq('email', email)
            .single();

        if (profileError || !profile) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
            return;
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, profile.password_hash);

        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
            return;
        }

        // Generate JWT token
        const token = generateToken({
            userId: profile.user_id,
            email: profile.email,
            role: profile.role,
        });

        const user: User = {
            id: profile.user_id,
            email: profile.email,
            role: profile.role,
            fullName: profile.full_name,
            userName: profile.user_name,
            phoneNumber: profile.phone_number,
            avatarUrl: profile.avatar_url,
            bio: profile.bio,
            expertise: profile.expertise,
            createdAt: new Date(profile.created_at),
        };

        const response: AuthResponse = {
            success: true,
            role: profile.role,
            token,
            user,
        };

        res.status(200).json(response);
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Login failed',
        });
    }
};

/**
 * Send OTP Controller
 */
export const sendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email }: SendOTPRequest = req.body;

        // If Supabase is not configured, return a mock response
        if (!isSupabaseConfigured) {
            res.status(200).json({
                success: true,
                message: 'OTP sent to your email',
            });
            return;
        }

        // Check if user exists
        const { data: profile } = await supabaseAdmin!
            .from('user_profiles')
            .select('email')
            .eq('email', email)
            .single();

        if (!profile) {
            res.status(404).json({
                success: false,
                message: 'No account found with this email',
            });
            return;
        }

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = getOTPExpiry(config.otp.expiryMinutes);

        // Delete any existing OTPs for this email
        await supabaseAdmin!
            .from('otps')
            .delete()
            .eq('email', email);

        // Save OTP to database
        const { error: otpError } = await supabaseAdmin!
            .from('otps')
            .insert({
                email,
                otp,
                expires_at: expiresAt.toISOString(),
            });

        if (otpError) {
            throw new Error(otpError.message);
        }

        // Send OTP via email
        await sendOTPEmail(email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent to your email',
        });
    } catch (error: any) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to send OTP',
        });
    }
};

/**
 * Verify OTP Controller
 */
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp }: VerifyOTPRequest = req.body;

        // If Supabase is not configured, return a mock response
        if (!isSupabaseConfigured) {
            res.status(200).json({
                success: true,
                message: 'OTP verified successfully',
            });
            return;
        }

        // Get OTP from database
        const { data: otpRecord, error: otpError } = await supabaseAdmin!
            .from('otps')
            .select('*')
            .eq('email', email)
            .eq('otp', otp)
            .single();

        if (otpError || !otpRecord) {
            res.status(400).json({
                success: false,
                message: 'Invalid OTP',
            });
            return;
        }

        // Check if OTP has expired
        if (isOTPExpired(new Date(otpRecord.expires_at))) {
            // Delete expired OTP
            await supabaseAdmin!
                .from('otps')
                .delete()
                .eq('email', email);

            res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one',
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
        });
    } catch (error: any) {
        console.error('Verify OTP error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to verify OTP',
        });
    }
};

/**
 * Reset Password Controller
 */
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, newPassword }: ResetPasswordRequest = req.body;

        // If Supabase is not configured, return a mock response
        if (!isSupabaseConfigured) {
            res.status(200).json({
                success: true,
                message: 'Password reset successfully',
            });
            return;
        }

        // Get user profile
        const { data: profile, error: profileError } = await supabaseAdmin!
            .from('user_profiles')
            .select('user_id')
            .eq('email', email)
            .single();

        if (profileError || !profile) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password in user_profiles table
        const { error: updateError } = await supabaseAdmin!
            .from('user_profiles')
            .update({ password_hash: hashedPassword })
            .eq('email', email);

        if (updateError) {
            throw new Error(updateError.message);
        }

        // Update password in Supabase Auth
        const { error: authError } = await supabaseAdmin!.auth.admin.updateUserById(
            profile.user_id,
            { password: newPassword }
        );

        if (authError) {
            console.error('Auth password update error:', authError);
            // Continue even if auth update fails, as we've updated the profile
        }

        // Delete OTP after successful password reset
        await supabaseAdmin!
            .from('otps')
            .delete()
            .eq('email', email);

        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    } catch (error: any) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to reset password',
        });
    }
};

/**
 * Get Current User Controller
 */
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // If Supabase is not configured, return a mock response
        if (!isSupabaseConfigured) {
            res.status(200).json({
                success: true,
                user: {
                    id: 'mock-user-id',
                    email: 'mock@example.com',
                    role: 'student',
                    createdAt: new Date(),
                },
            });
            return;
        }

        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Not authenticated',
            });
            return;
        }

        // Get user profile
        const { data: profile, error } = await supabaseAdmin!
            .from('user_profiles')
            .select('*')
            .eq('user_id', req.user.userId)
            .single();

        if (error || !profile) {
            res.status(404).json({
                success: false,
                message: 'User not found',
            });
            return;
        }

        const user: User = {
            id: profile.user_id,
            email: profile.email,
            role: profile.role,
            fullName: profile.full_name,
            userName: profile.user_name,
            phoneNumber: profile.phone_number,
            avatarUrl: profile.avatar_url,
            bio: profile.bio,
            expertise: profile.expertise,
            createdAt: new Date(profile.created_at),
        };

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error: any) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to get user',
        });
    }
};