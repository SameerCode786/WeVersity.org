import { supabaseClient } from '../supabase/client';
import { throwIfError } from '../supabase/supabaseHelpers';

export const followTeacher = async (studentId: string, teacherId: string) => {
    const response = await supabaseClient
        .from('followers')
        .insert({ student_id: studentId, teacher_id: teacherId });

    return throwIfError(response, 'Failed to follow teacher');
};

export const unfollowTeacher = async (studentId: string, teacherId: string) => {
    const response = await supabaseClient
        .from('followers')
        .delete()
        .match({ student_id: studentId, teacher_id: teacherId });

    return throwIfError(response, 'Failed to unfollow teacher');
};

export const getFollowedTeachers = async (studentId: string) => {
    const response = await supabaseClient
        .from('followers')
        .select('*, teacher:users!teacher_id(*)')
        .eq('student_id', studentId);

    return throwIfError(response, 'Failed to fetch followed teachers');
};
