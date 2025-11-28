-- =====================================================
-- Row Level Security (RLS) Policies for WeVersity
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USER PROFILES POLICIES
-- =====================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Allow service role to do everything (for backend)
CREATE POLICY "Service role full access to user_profiles"
  ON user_profiles FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- OTP POLICIES
-- =====================================================

-- Only service role can manage OTPs (backend only)
CREATE POLICY "Service role full access to otps"
  ON otps FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- COURSES POLICIES
-- =====================================================

-- Anyone can view published courses
CREATE POLICY "Anyone can view published courses"
  ON courses FOR SELECT
  USING (is_published = true);

-- Teachers can view their own courses (published or not)
CREATE POLICY "Teachers can view own courses"
  ON courses FOR SELECT
  USING (auth.uid() = teacher_id);

-- Teachers can create courses
CREATE POLICY "Teachers can create courses"
  ON courses FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

-- Teachers can update their own courses
CREATE POLICY "Teachers can update own courses"
  ON courses FOR UPDATE
  USING (auth.uid() = teacher_id);

-- Teachers can delete their own courses
CREATE POLICY "Teachers can delete own courses"
  ON courses FOR DELETE
  USING (auth.uid() = teacher_id);

-- Service role full access
CREATE POLICY "Service role full access to courses"
  ON courses FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- ENROLLMENTS POLICIES
-- =====================================================

-- Students can view their own enrollments
CREATE POLICY "Students can view own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = student_id);

-- Students can enroll in courses
CREATE POLICY "Students can create enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Teachers can view enrollments for their courses
CREATE POLICY "Teachers can view course enrollments"
  ON enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM courses
      WHERE courses.id = enrollments.course_id
      AND courses.teacher_id = auth.uid()
    )
  );

-- Service role full access
CREATE POLICY "Service role full access to enrollments"
  ON enrollments FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- LIVE SESSIONS POLICIES
-- =====================================================

-- Anyone can view scheduled/live sessions
CREATE POLICY "Anyone can view active sessions"
  ON live_sessions FOR SELECT
  USING (status IN ('scheduled', 'live'));

-- Teachers can view all their sessions
CREATE POLICY "Teachers can view own sessions"
  ON live_sessions FOR SELECT
  USING (auth.uid() = teacher_id);

-- Teachers can create sessions
CREATE POLICY "Teachers can create sessions"
  ON live_sessions FOR INSERT
  WITH CHECK (auth.uid() = teacher_id);

-- Teachers can update their own sessions
CREATE POLICY "Teachers can update own sessions"
  ON live_sessions FOR UPDATE
  USING (auth.uid() = teacher_id);

-- Teachers can delete their own sessions
CREATE POLICY "Teachers can delete own sessions"
  ON live_sessions FOR DELETE
  USING (auth.uid() = teacher_id);

-- Service role full access
CREATE POLICY "Service role full access to live_sessions"
  ON live_sessions FOR ALL
  USING (auth.role() = 'service_role');
