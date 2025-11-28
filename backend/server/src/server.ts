import cors from 'cors';
import express, { Application } from 'express';
import { config, validateConfig } from './config';
import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

// Validate environment variables
try {
    validateConfig();
} catch (error: any) {
    console.error('Configuration error:', error.message);
    process.exit(1);
}

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api', routes);

// Root route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to WeVersity API',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            auth: {
                signup: 'POST /api/auth/signup',
                login: 'POST /api/auth/login',
                sendOTP: 'POST /api/auth/send-otp',
                verifyOTP: 'POST /api/auth/verify-otp',
                resetPassword: 'POST /api/auth/reset-password',
                me: 'GET /api/auth/me',
            },
            students: {
                dashboard: 'GET /api/students/dashboard',
                courses: 'GET /api/students/courses',
                profile: 'GET /api/students/profile',
            },
            teachers: {
                dashboard: 'GET /api/teachers/dashboard',
                courses: 'GET /api/teachers/courses',
                createCourse: 'POST /api/teachers/courses',
                profile: 'GET /api/teachers/profile',
            },
        },
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 WeVersity Backend Server`);
    console.log(`📡 Running on: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`📅 Started at: ${new Date().toISOString()}`);
    console.log('='.repeat(50));
});

export default app;
