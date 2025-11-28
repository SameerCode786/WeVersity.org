# WeVersity Backend API

Complete Node.js + Express + Supabase backend for the WeVersity React Native application.

## 🚀 Features

- ✅ **User Authentication** (Student & Teacher roles)
- ✅ **JWT-based Authorization**
- ✅ **OTP-based Password Reset**
- ✅ **Role-based Access Control**
- ✅ **Email Notifications**
- ✅ **Secure Password Hashing (bcrypt)**
- ✅ **Input Validation**
- ✅ **TypeScript Support**
- ✅ **Supabase Integration**

## 📁 Project Structure

```
backend/server/
├── src/
│   ├── config/           # Configuration files
│   │   ├── index.ts      # Main config
│   │   └── supabase.ts   # Supabase client
│   ├── controllers/      # Request handlers
│   │   └── authController.ts
│   ├── middlewares/      # Express middlewares
│   │   ├── auth.ts       # JWT & role verification
│   │   ├── validator.ts  # Input validation
│   │   └── errorHandler.ts
│   ├── models/           # TypeScript types
│   │   └── types.ts
│   ├── routes/           # API routes
│   │   ├── authRoutes.ts
│   │   ├── studentRoutes.ts
│   │   ├── teacherRoutes.ts
│   │   └── index.ts
│   ├── utils/            # Utility functions
│   │   ├── password.ts   # Password hashing
│   │   ├── jwt.ts        # JWT utilities
│   │   ├── otp.ts        # OTP generation
│   │   └── email.ts      # Email service
│   └── server.ts         # Main server file
├── database/             # Database schemas
│   ├── schema.sql        # Database tables
│   └── policies.sql      # RLS policies
├── package.json
├── tsconfig.json
├── .env.example
└── .gitignore
```

## 🛠️ Installation

### 1. Navigate to Backend Directory

```bash
cd "backend/server"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=your_anon_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
EMAIL_FROM=WeVersity <noreply@weversity.com>

# OTP Configuration
OTP_EXPIRY_MINUTES=3
```

### 4. Setup Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run `database/schema.sql` to create tables
4. Run `database/policies.sql` to setup RLS policies

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 6. Build for Production

```bash
npm run build
npm start
```

## 📧 Email Configuration (Gmail)

To enable OTP emails via Gmail:

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password
3. Use this app password in `EMAIL_PASSWORD` in `.env`

**Note:** If email is not configured, OTPs will be logged to console (development mode).

## 📚 API Documentation

Base URL: `http://localhost:5000/api`

### Authentication Endpoints

#### 1. Signup

**POST** `/auth/signup`

Register a new user (student or teacher).

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "student",
  "fullName": "John Doe",
  "userName": "johndoe",
  "phoneNumber": "+923001234567",
  "avatarUrl": "https://example.com/avatar.jpg",
  "bio": "Passionate learner",
  "expertise": "Web Development"
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
    "phoneNumber": "+923001234567",
    "avatarUrl": "https://example.com/avatar.jpg",
    "bio": "Passionate learner",
    "createdAt": "2025-11-27T10:00:00.000Z"
  }
}
```

---

#### 2. Login

**POST** `/auth/login`

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

---

#### 3. Send OTP

**POST** `/auth/send-otp`

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

---

#### 4. Verify OTP

**POST** `/auth/verify-otp`

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

---

#### 5. Reset Password

**POST** `/auth/reset-password`

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

---

#### 6. Get Current User

**GET** `/auth/me`

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

---

### Student Endpoints

All student endpoints require:
- **Authentication:** `Authorization: Bearer <token>`
- **Role:** Student only

#### 1. Student Dashboard

**GET** `/students/dashboard`

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

#### 2. Get Student Courses

**GET** `/students/courses`

#### 3. Get Student Profile

**GET** `/students/profile`

---

### Teacher Endpoints

All teacher endpoints require:
- **Authentication:** `Authorization: Bearer <token>`
- **Role:** Teacher only

#### 1. Teacher Dashboard

**GET** `/teachers/dashboard`

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

#### 2. Get Teacher Courses

**GET** `/teachers/courses`

#### 3. Create Course

**POST** `/teachers/courses`

#### 4. Get Teacher Profile

**GET** `/teachers/profile`

---

## 🔐 Authentication Flow

### 1. Signup Flow

```
Frontend → POST /api/auth/signup
         ← { success, token, user, role }
         
Store token in AsyncStorage
Navigate to role-based dashboard:
  - Student → /student/home
  - Teacher → /teacher/home
```

### 2. Login Flow

```
Frontend → POST /api/auth/login
         ← { success, token, user, role }
         
Store token in AsyncStorage
Navigate based on role
```

### 3. Password Reset Flow

```
Step 1: Send OTP
Frontend → POST /api/auth/send-otp { email }
         ← { success, message }

Step 2: Verify OTP
Frontend → POST /api/auth/verify-otp { email, otp }
         ← { success, message }

Step 3: Reset Password
Frontend → POST /api/auth/reset-password { email, newPassword }
         ← { success, message }
```

---

## 🛡️ Role-Based Access Control

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

---

## 🧪 Testing Endpoints

### Using cURL

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "student",
    "fullName": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Protected Route:**
```bash
curl -X GET http://localhost:5000/api/students/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🐛 Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Ensure `.env` file exists with correct Supabase credentials

2. **"Invalid or expired token"**
   - Check if JWT token is included in Authorization header
   - Verify token hasn't expired (default: 7 days)

3. **"Access denied. Required role: student"**
   - User role doesn't match route requirements
   - Verify user role in database

4. **OTP not received**
   - Check email configuration in `.env`
   - Look for OTP in console logs (development mode)
   - Verify Gmail app password is correct

---

## 📝 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` or `production` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Service role key | `eyJhbG...` |
| `SUPABASE_ANON_KEY` | Anonymous key | `eyJhbG...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `JWT_EXPIRES_IN` | Token expiration | `7d`, `24h`, `60m` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |
| `EMAIL_USER` | Email address | `your@gmail.com` |
| `EMAIL_PASSWORD` | App password | `xxxx xxxx xxxx xxxx` |
| `EMAIL_FROM` | From address | `WeVersity <noreply@weversity.com>` |
| `OTP_EXPIRY_MINUTES` | OTP validity | `3` |

---

## 🚀 Deployment

### Deploy to Heroku

1. Create Heroku app:
```bash
heroku create weversity-backend
```

2. Set environment variables:
```bash
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_SERVICE_KEY=your_key
heroku config:set JWT_SECRET=your_secret
# ... set all other variables
```

3. Deploy:
```bash
git push heroku main
```

### Deploy to Railway

1. Connect GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically

### Deploy to Render

1. Create new Web Service
2. Connect repository
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variables

---

## 📄 License

MIT

---

## 👨‍💻 Support

For issues or questions, please contact the development team.