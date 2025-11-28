import { createClient } from '@supabase/supabase-js';
import { config } from './index';

// Check if we have valid Supabase configuration
const hasValidSupabaseConfig = 
    config.supabase.url && 
    config.supabase.url !== 'your_supabase_project_url' &&
    config.supabase.serviceKey &&
    config.supabase.anonKey;

// Admin client with service role key (can bypass RLS)
export const supabaseAdmin = hasValidSupabaseConfig
    ? createClient(
        config.supabase.url!,
        config.supabase.serviceKey!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )
    : null;

// Public client with anon key (respects RLS)
export const supabaseClient = hasValidSupabaseConfig
    ? createClient(
        config.supabase.url!,
        config.supabase.anonKey!
    )
    : null;