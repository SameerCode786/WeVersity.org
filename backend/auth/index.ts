import { User } from '@supabase/supabase-js';
import { supabaseClient } from '../supabase/client';
import { upsertUserProfile, UserRole } from '../supabase/supabaseHelpers';

export type SignupPayload = {
  email: string;
  password: string;
  fullName?: string;
  userName?: string;
  phoneNumber?: string;
  avatarUrl?: string;
  bio?: string;
  expertise?: string;
};

const signUp = async (
  payload: SignupPayload,
  role: UserRole
): Promise<User> => {
  const { data, error } = await supabaseClient.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        role,
        full_name: payload.fullName,
        user_name: payload.userName,
        phone_number: payload.phoneNumber,
        avatar_url: payload.avatarUrl,
        bio: payload.bio,
        expertise: payload.expertise,
      },
    },
  });

  if (error) {
    // Handle specific email rate limit or configuration errors
    if (error.message.includes('error sending confirmation email') || error.message.includes('rate limit')) {
      console.warn('Signup successful but email failed:', error.message);
      // If user was created but email failed, we can still proceed in dev mode
      // or warn the user. However, Supabase usually prevents creation if email fails 
      // depending on config. 
      throw new Error('Signup failed: Email service is not configured or rate limited. Please try again later or contact support.');
    }
    throw new Error(error.message);
  }

  const user = data.user;
  if (!user) {
    throw new Error('User not returned after signup.');
  }

  // Create profile immediately (works whether email confirmation is on or off)
  try {
    await upsertUserProfile(user.id, role, {
      email: user.email ?? undefined,
      full_name: payload.fullName,
      user_name: payload.userName,
      phone_number: payload.phoneNumber,
      avatar_url: payload.avatarUrl,
      bio: payload.bio,
      expertise: payload.expertise,
    });
  } catch (profileError: any) {
    console.warn('Profile creation failed:', profileError.message);
    // Don't throw - user is created, profile can be created later
  }

  return user;
};


export const signupStudent = (payload: SignupPayload) => {
  return signUp(payload, 'student');
};


export const signupTeacher = (payload: SignupPayload) => {
  return signUp(payload, 'teacher');
};

export const resendVerificationEmail = async (email: string) => {
  const { error } = await supabaseClient.auth.resend({
    type: 'signup',
    email,
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const verifyAndCreateProfile = async (userId: string) => {
  // Get user metadata
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    throw new Error('Failed to get user data');
  }

  const metadata = user.user_metadata;
  const role = metadata.role as UserRole;

  // Create profile in public.users
  await upsertUserProfile(userId, role, {
    email: user.email,
    full_name: metadata.full_name,
    user_name: metadata.user_name,
    phone_number: metadata.phone_number,
    avatar_url: metadata.avatar_url,
    bio: metadata.bio,
    expertise: metadata.expertise,
  });
};

export const login = async (email: string, password: string) => {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Check if it's an email not confirmed error
    const errorMsg = error.message.toLowerCase();
    if (errorMsg.includes('email not confirmed') || errorMsg.includes('not verified')) {
      throw new Error('Email not verified. Please check your inbox.');
    }
    // Generic credential error
    if (errorMsg.includes('invalid') || errorMsg.includes('credentials')) {
      throw new Error('Wrong credentials');
    }
    throw new Error(error.message);
  }

  // If we have a user but no session, check email confirmation
  if (data.user && !data.session) {
    // Check if email is confirmed
    if (!data.user.email_confirmed_at) {
      throw new Error('Email not verified. Please check your inbox.');
    }
    throw new Error('Login failed. Please try again.');
  }

  if (!data.session) {
    throw new Error('Login failed. Please try again.');
  }

  return data;
};

export const getRoleBasedRoute = (role: string | undefined): string => {
  if (role === 'teacher') {
    return '/(tabs)/home';
  }
  return '/(tabs)/home';
};
