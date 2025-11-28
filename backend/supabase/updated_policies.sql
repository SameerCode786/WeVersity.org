-- Updated RLS Policies for WeVersity
-- Run this in Supabase SQL Editor after running updated_trigger.sql

-- Ensure extension for uuid generation
create extension if not exists "uuid-ossp";

-- ===== DROP ALL EXISTING POLICIES =====
-- This ensures clean slate and avoids conflicts

-- Drop users policies
drop policy if exists "Users can view their profile" on public.users;
drop policy if exists "Teachers manage themselves" on public.users;
drop policy if exists "Students manage themselves" on public.users;
drop policy if exists "users_insert_auth" on public.users;
drop policy if exists "users_select_own" on public.users;
drop policy if exists "users_update_own" on public.users;

-- Drop live_sessions policies
drop policy if exists "Anyone can read live sessions" on public.live_sessions;
drop policy if exists "Teacher inserts live session" on public.live_sessions;
drop policy if exists "Teacher updates own live session" on public.live_sessions;
drop policy if exists "live_select_public" on public.live_sessions;
drop policy if exists "live_insert_for_teachers" on public.live_sessions;
drop policy if exists "live_update_own" on public.live_sessions;

-- Drop shorts policies
drop policy if exists "Anyone can read shorts" on public.shorts;
drop policy if exists "Teacher inserts shorts" on public.shorts;
drop policy if exists "Teacher updates own shorts" on public.shorts;
drop policy if exists "shorts_select_public" on public.shorts;
drop policy if exists "shorts_insert_teacher" on public.shorts;
drop policy if exists "shorts_update_teacher" on public.shorts;

-- Drop courses policies
drop policy if exists "Anyone can read courses" on public.courses;
drop policy if exists "Teacher inserts courses" on public.courses;
drop policy if exists "Teacher updates own courses" on public.courses;
drop policy if exists "courses_select" on public.courses;
drop policy if exists "courses_insert_teacher" on public.courses;
drop policy if exists "courses_update_teacher" on public.courses;

-- Drop course_content policies
drop policy if exists "Anyone can read course content" on public.course_content;
drop policy if exists "Teacher inserts course content" on public.course_content;
drop policy if exists "Teacher updates own course content" on public.course_content;

-- Drop enrollments policies
drop policy if exists "Students view own enrollments" on public.enrollments;
drop policy if exists "Students enroll themselves" on public.enrollments;
drop policy if exists "enroll_insert_student" on public.enrollments;
drop policy if exists "enroll_select_student_or_teacher" on public.enrollments;

-- Drop followers policies
drop policy if exists "followers_insert" on public.followers;
drop policy if exists "followers_delete_own" on public.followers;

-- Drop live_comments policies
drop policy if exists "Anyone can read live comments" on public.live_comments;
drop policy if exists "Authenticated users create live comments" on public.live_comments;
drop policy if exists "live_comments_insert" on public.live_comments;
drop policy if exists "live_comments_select" on public.live_comments;

-- ===== ENABLE RLS ON ALL TABLES =====

alter table public.users enable row level security;
alter table public.live_sessions enable row level security;
alter table public.shorts enable row level security;
alter table public.courses enable row level security;
alter table public.course_content enable row level security;
alter table public.enrollments enable row level security;
alter table public.live_comments enable row level security;

-- Enable RLS on followers table if it exists
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'followers') then
    alter table public.followers enable row level security;
  end if;
end $$;

-- ===== USERS TABLE POLICIES =====

-- Allow authenticated users to insert their own profile (when id = auth.uid())
create policy "users_insert_auth" on public.users
  for insert
  to authenticated
  with check (auth.uid() = id);

-- Allow users to view their own profile
create policy "users_select_own" on public.users
  for select
  to authenticated
  using (auth.uid() = id);

-- Allow users to update their own profile
create policy "users_update_own" on public.users
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ===== LIVE SESSIONS POLICIES =====

-- Students and teachers can read live sessions (public or their own)
create policy "live_select_public" on public.live_sessions
  for select
  to authenticated
  using (is_live = true OR teacher_id = auth.uid());

-- Teachers can insert live sessions
create policy "live_insert_for_teachers" on public.live_sessions
  for insert
  to authenticated
  with check (auth.uid() = teacher_id);

-- Teachers can update their own live sessions
create policy "live_update_own" on public.live_sessions
  for update
  to authenticated
  using (auth.uid() = teacher_id)
  with check (auth.uid() = teacher_id);

-- ===== SHORTS POLICIES =====

-- Anyone authenticated can read shorts
create policy "shorts_select_public" on public.shorts
  for select 
  to authenticated 
  using (true);

-- Teachers can insert shorts
create policy "shorts_insert_teacher" on public.shorts
  for insert 
  to authenticated 
  with check (auth.uid() = teacher_id);

-- Teachers can update their own shorts
create policy "shorts_update_teacher" on public.shorts
  for update 
  to authenticated 
  using (auth.uid() = teacher_id) 
  with check (auth.uid() = teacher_id);

-- ===== COURSES POLICIES =====

-- Anyone authenticated can read courses
create policy "courses_select" on public.courses 
  for select 
  to authenticated 
  using (true);

-- Teachers can insert courses
create policy "courses_insert_teacher" on public.courses 
  for insert 
  to authenticated 
  with check (auth.uid() = teacher_id);

-- Teachers can update their own courses
create policy "courses_update_teacher" on public.courses 
  for update 
  to authenticated 
  using (auth.uid() = teacher_id) 
  with check (auth.uid() = teacher_id);

-- ===== COURSE CONTENT POLICIES =====

-- Anyone authenticated can read course content
create policy "course_content_select" on public.course_content
  for select
  to authenticated
  using (true);

-- Teachers can insert course content for their own courses
create policy "course_content_insert_teacher" on public.course_content
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.courses c
      where c.id = course_id and c.teacher_id = auth.uid()
    )
  );

-- Teachers can update course content for their own courses
create policy "course_content_update_teacher" on public.course_content
  for update
  to authenticated
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_id and c.teacher_id = auth.uid()
    )
  );

-- ===== ENROLLMENTS POLICIES =====

-- Students can insert their own enrollments
create policy "enroll_insert_student" on public.enrollments 
  for insert 
  to authenticated 
  with check (auth.uid() = student_id);

-- Students can view their enrollments, teachers can view enrollments for their courses
create policy "enroll_select_student_or_teacher" on public.enrollments 
  for select 
  to authenticated 
  using (
    student_id = auth.uid()
    OR
    exists (select 1 from public.courses c where c.id = course_id and c.teacher_id = auth.uid())
  );

-- ===== FOLLOWERS POLICIES (if table exists) =====

-- Students can insert their own follows
do $$
begin
  if exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'followers') then
    execute 'create policy "followers_insert" on public.followers for insert to authenticated with check (auth.uid() = student_id)';
    execute 'create policy "followers_delete_own" on public.followers for delete to authenticated using (student_id = auth.uid())';
    execute 'create policy "followers_select" on public.followers for select to authenticated using (student_id = auth.uid() or teacher_id = auth.uid())';
  end if;
end $$;

-- ===== LIVE COMMENTS POLICIES =====

-- Authenticated users can insert comments
create policy "live_comments_insert" on public.live_comments 
  for insert 
  to authenticated 
  with check (auth.uid() = author_id);

-- Anyone authenticated can read live comments
create policy "live_comments_select" on public.live_comments 
  for select 
  to authenticated 
  using (true);

-- Verify policies were created
select 'RLS policies created successfully' as status;
