import { Request, Response, Router } from 'express';
import { authMiddleware, requireStudent } from '../middlewares/auth';

const router = Router();

// All student routes require authentication and student role
router.use(authMiddleware);
router.use(requireStudent);

/**
 * @route   GET /api/students/dashboard
 * @desc    Get student dashboard data
 * @access  Private (Student only)
 */
router.get('/dashboard', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Student dashboard',
        user: req.user,
        data: {
            enrolledCourses: [],
            upcomingClasses: [],
            recentActivity: [],
        },
    });
});

/**
 * @route   GET /api/students/courses
 * @desc    Get student's enrolled courses
 * @access  Private (Student only)
 */
router.get('/courses', (req: Request, res: Response) => {
    res.json({
        success: true,
        courses: [],
    });
});

/**
 * @route   GET /api/students/profile
 * @desc    Get student profile
 * @access  Private (Student only)
 */
router.get('/profile', (req: Request, res: Response) => {
    res.json({
        success: true,
        user: req.user,
    });
});

export default router;
