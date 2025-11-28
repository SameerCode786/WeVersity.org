import { supabaseClient } from "../../backend/supabase/client";

// Get user profile information
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabaseClient
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error) throw error;
  return data;
};

// Get teacher's courses
export const getTeacherCourses = async (teacherId: string) => {
  const { data, error } = await supabaseClient
    .from('courses')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Get teacher's shorts
export const getTeacherShorts = async (teacherId: string) => {
  const { data, error } = await supabaseClient
    .from('shorts')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Get teacher's live sessions
export const getTeacherLiveSessions = async (teacherId: string) => {
  const { data, error } = await supabaseClient
    .from('live_sessions')
    .select('*')
    .eq('teacher_id', teacherId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Get student's enrolled courses
export const getStudentEnrollments = async (studentId: string) => {
  const { data, error } = await supabaseClient
    .from('enrollments')
    .select('*, course:courses(*)')
    .eq('student_id', studentId)
    .order('enrolled_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Get all courses for browsing
export const getAllCourses = async () => {
  const { data, error } = await supabaseClient
    .from('courses')
    .select('*, teacher:users(full_name)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Get all shorts for browsing
export const getAllShorts = async () => {
  const { data, error } = await supabaseClient
    .from('shorts')
    .select('*, teacher:users(full_name)')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

// Get live sessions
export const getLiveSessions = async () => {
  const { data, error } = await supabaseClient
    .from('live_sessions')
    .select('*, teacher:users(full_name)')
    .eq('is_live', true)
    .order('started_at', { ascending: false });
  
  if (error) throw error;
  return data;
};