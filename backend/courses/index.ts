import { supabaseClient } from '../supabase/client';
import { throwIfError } from '../supabase/supabaseHelpers';

export const getCourseById = async (courseId: string) => {
  const response = await supabaseClient
    .from('courses')
    .select('*, teacher:users(*), content:course_content(*)')
    .eq('id', courseId)
    .single();

  return throwIfError(response, 'Failed to fetch course');
};

export const getCourseContent = async (courseId: string) => {
  const response = await supabaseClient
    .from('course_content')
    .select('*')
    .eq('course_id', courseId)
    .order('sort_order', { ascending: true });

  return throwIfError(response, 'Failed to fetch course content');
};
