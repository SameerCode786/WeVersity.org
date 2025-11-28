import { PostgrestError } from '@supabase/supabase-js';
import { supabaseClient } from './client';

export type UserRole = 'student' | 'teacher';

export type UserProfile = {
  id: string;
  email?: string | null;
  role: UserRole;
  full_name?: string | null;
  user_name?: string | null;
  phone_number?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  expertise?: string | null;
};

export const throwIfError = <T>(
  response: { data: T | null; error: PostgrestError | null },
  message: string
): T => {
  if (response.error || !response.data) {
    throw new Error(response.error?.message ?? message);
  }
  return response.data;
};

export const upsertUserProfile = async (
  id: string,
  role: UserRole,
  profile: Partial<UserProfile>
) => {
  const { error } = await supabaseClient
    .from('users')
    .upsert({ id, role, ...profile }, { onConflict: 'id' });

  if (error) {
    throw new Error(error.message);
  }
};

export const ensureRole = (profile: UserProfile | null, role: UserRole) => {
  if (!profile || profile.role !== role) {
    throw new Error(`Only ${role}s can perform this action.`);
  }
};

export const getProfile = async (userId?: string | null) => {
  if (!userId) return null;
  const { data, error } = await supabaseClient
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserProfile;
};

export const subscribeToLiveComments = (
  liveSessionId: string,
  handler: (comment: unknown) => void
) =>
  supabaseClient
    .channel(`live-comments-${liveSessionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'live_comments',
        filter: `live_session_id=eq.${liveSessionId}`,
      },
      (payload) => handler(payload.new)
    );

export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabaseClient
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UserProfile;
};
