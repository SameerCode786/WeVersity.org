import { supabaseClient } from '../supabase/client';
import { throwIfError } from '../supabase/supabaseHelpers';

export const getLiveTeachers = async () => {
  const response = await supabaseClient
    .from('live_sessions')
    .select('*, teacher:users(*)')
    .eq('is_live', true);

  return throwIfError(response, 'Failed to fetch live teachers');
};

export const getCourses = async () => {
  const response = await supabaseClient
    .from('courses')
    .select('*, teacher:users(*)');

  return throwIfError(response, 'Failed to fetch courses');
};

export const getShorts = async () => {
  const response = await supabaseClient
    .from('shorts')
    .select('*, teacher:users(*)')
    .order('created_at', { ascending: false });

  return throwIfError(response, 'Failed to fetch shorts');
};

export const enrollCourse = async (studentId: string, courseId: string) => {
  const response = await supabaseClient
    .from('enrollments')
    .insert({ student_id: studentId, course_id: courseId });

  return throwIfError(response, 'Failed to enroll in course');
};

export const joinLiveSession = async (liveId: string) => {
  const response = await supabaseClient
    .from('live_sessions')
    .select('*')
    .eq('id', liveId)
    .single();

  return throwIfError(response, 'Failed to join live session');
};
