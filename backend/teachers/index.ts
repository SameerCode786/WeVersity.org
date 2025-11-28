import { supabaseClient } from '../supabase/client';
import { throwIfError } from '../supabase/supabaseHelpers';

export const startLiveSession = async (teacherId: string, title: string) => {
  // Generate a fake stream key/url for now, or integrate with a real provider (e.g. Mux, Agora)
  const streamKey = `sk_${Math.random().toString(36).substring(7)}`;
  const streamUrl = `rtmp://live.weversity.app/app/${streamKey}`;

  const response = await supabaseClient
    .from('live_sessions')
    .insert({
      teacher_id: teacherId,
      title,
      stream_url: streamUrl,
      stream_key: streamKey,
      is_live: true,
    })
    .select()
    .single();

  return throwIfError(response, 'Failed to start live session');
};

export const stopLiveSession = async (sessionId: string) => {
  const response = await supabaseClient
    .from('live_sessions')
    .update({ is_live: false, ended_at: new Date().toISOString() })
    .eq('id', sessionId);

  return throwIfError(response, 'Failed to stop live session');
};

export const uploadShort = async (teacherId: string, videoUrl: string, caption: string) => {
  const response = await supabaseClient
    .from('shorts')
    .insert({
      teacher_id: teacherId,
      video_url: videoUrl,
      caption,
    })
    .select()
    .single();

  return throwIfError(response, 'Failed to upload short');
};

export const createCourse = async (teacherId: string, title: string, description: string, thumbnail: string) => {
  const response = await supabaseClient
    .from('courses')
    .insert({
      teacher_id: teacherId,
      title,
      description,
      thumbnail,
    })
    .select()
    .single();

  return throwIfError(response, 'Failed to create course');
};

export const addCourseContent = async (
  courseId: string,
  type: 'video' | 'quiz' | 'text',
  title: string,
  contentUrl?: string,
  contentBody?: string
) => {
  const response = await supabaseClient
    .from('course_content')
    .insert({
      course_id: courseId,
      content_type: type,
      title,
      content_url: contentUrl,
      content_body: contentBody,
    });

  return throwIfError(response, 'Failed to add course content');
};
