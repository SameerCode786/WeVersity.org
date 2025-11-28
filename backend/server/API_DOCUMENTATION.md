# WeVersity API Documentation

Complete API documentation for the WeVersity backend with role-based authentication and OTP password reset.

## 📋 Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [Student Endpoints](#student-endpoints)
3. [Teacher Endpoints](#teacher-endpoints)
4. [Role-Based Access Control](#role-based-access-control)
5. [Error Handling](#error-handling)

## 🔐 Authentication Endpoints

### 1. Signup

**POST** `/api/auth/signup`

Register a new user (student or teacher).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student",
  "fullName": "John Doe",
  "userName": "johndoe",
  "phoneNumber": "+1234567890",
  "avatarUrl": "https://example.com/avatar.jpg",
  "bio": "Passionate learner",
  "expertise": "Web Development"  // Only for teachers
}
```

**Response (201):**
```json
{
  "success": true,
  "role": "student",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "student",
    "fullName": "John Doe",
    "userName": "johndoe",
    "phoneNumber": "+1234567890",
    "avatarUrl": "https://example.com/avatar.jpg",
    "bio": "Passionate learner",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 2. Login

**POST** `/api/auth/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "role": "teacher",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "teacher",
    "fullName": "Jane Smith",
    "userName": "janesmith",
    "expertise": "Mathematics"
  }
}
```

### 3. Send OTP

**POST** `/api/auth/send-otp`

Send OTP to email for password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

### 4. Verify OTP

**POST** `/api/auth/verify-otp`

Verify the OTP sent to email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "1234"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid OTP"
}
```

### 5. Reset Password

**POST** `/api/auth/reset-password`

Reset password after OTP verification.

**Request Body:**
```json
{
  "email": "user@example.com",
  "newPassword": "newpassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

### 6. Get Current User

**GET** `/api/auth/me`

Get current authenticated user details.

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "student",
    "fullName": "John Doe"
  }
}
```

## 👨‍🎓 Student Endpoints

All student endpoints require:
- **Authentication:** `Authorization: Bearer <token>`
- **Role:** Student only

### 1. Student Dashboard

**GET** `/api/students/dashboard`

Get student dashboard data.

**Response (200):**
```json
{
  "success": true,
  "message": "Student dashboard",
  "user": { "userId": "uuid", "email": "...", "role": "student" },
  "data": {
    "enrolledCourses": [],
    "upcomingClasses": [],
    "recentActivity": []
  }
}
```

### 2. Get Student Courses

**GET** `/api/students/courses`

Get student's enrolled courses.

**Response (200):**
```json
{
  "success": true,
  "courses": []
}
```

### 3. Get Student Profile

**GET** `/api/students/profile`

Get student profile.

**Response (200):**
```json
{
  "success": true,
  "user": { "userId": "uuid", "email": "...", "role": "student" }
}
```

## 👩‍🏫 Teacher Endpoints

All teacher endpoints require:
- **Authentication:** `Authorization: Bearer <token>`
- **Role:** Teacher only

### 1. Teacher Dashboard

**GET** `/api/teachers/dashboard`

Get teacher dashboard data.

**Response (200):**
```json
{
  "success": true,
  "message": "Teacher dashboard",
  "user": { "userId": "uuid", "email": "...", "role": "teacher" },
  "data": {
    "courses": [],
    "students": [],
    "upcomingClasses": [],
    "earnings": 0
  }
}
```

### 2. Get Teacher Courses

**GET** `/api/teachers/courses`

Get teacher's courses.

**Response (200):**
```json
{
  "success": true,
  "courses": []
}
```

### 3. Create Course

**POST** `/api/teachers/courses`

Create a new course.

**Request Body:**
```json
{
  "title": "Introduction to React",
  "description": "Learn React from scratch",
  "thumbnail": "https://example.com/thumbnail.jpg"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Course created",
  "course": {}
}
```

### 4. Get Teacher Profile

**GET** `/api/teachers/profile`

Get teacher profile.

**Response (200):**
```json
{
  "success": true,
  "user": { "userId": "uuid", "email": "...", "role": "teacher" }
}
```

## 🔐 Role-Based Access Control

### Middleware Usage

The backend uses middleware to protect routes:

```typescript
// Protect route - requires valid JWT
router.get('/protected', authMiddleware, handler);

// Student-only route
router.get('/student-only', authMiddleware, requireStudent, handler);

// Teacher-only route
router.get('/teacher-only', authMiddleware, requireTeacher, handler);
```

### Frontend Integration

Include JWT token in all authenticated requests:

```typescript
const response = await fetch('http://localhost:5000/api/students/dashboard', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
```

## ❌ Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  // Additional data
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Common Error Messages

- `"No token provided. Authorization header must be in format: Bearer <token>"`
- `"Invalid or expired token"`
- `"Access denied. Required role: student or teacher"`
- `"User with this email already exists"`
- `"Invalid email or password"`
- `"Invalid OTP"`
- `"OTP has expired. Please request a new one"`
- `"User not found"`