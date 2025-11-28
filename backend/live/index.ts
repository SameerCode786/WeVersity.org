import { supabaseClient } from '../supabase/client';
import { throwIfError } from '../supabase/supabaseHelpers';

export const getLiveById = async (liveId: string) => {
  const response = await supabaseClient
    .from('live_sessions')
    .select('*, teacher:users(*)')
    .eq('id', liveId)
    .single();

  return throwIfError(response, 'Failed to fetch live session');
};

export const swipeNextLive = async (currentLiveId: string) => {
  // Logic to get the next live session (random or ordered)
  // For now, just get any live session that isn't the current one
  const response = await supabaseClient
    .from('live_sessions')
    .select('*, teacher:users(*)')
    .neq('id', currentLiveId)
    .eq('is_live', true)
    .limit(1)
    .maybeSingle();

  return response.data; // Can be null if no other live sessions
};
