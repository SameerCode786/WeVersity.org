import { Request, Response, Router } from 'express';
import { authMiddleware, requireTeacher } from '../middlewares/auth';

const router = Router();

// All teacher routes require authentication and teacher role
router.use(authMiddleware);
router.use(requireTeacher);

/**
 * @route   GET /api/teachers/dashboard
 * @desc    Get teacher dashboard data
 * @access  Private (Teacher only)
 */
router.get('/dashboard', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Teacher dashboard',
        user: req.user,
        data: {
            courses: [],
            students: [],
            upcomingClasses: [],
            earnings: 0,
        },
    });
});

/**
 * @route   GET /api/teachers/courses
 * @desc    Get teacher's courses
 * @access  Private (Teacher only)
 */
router.get('/courses', (req: Request, res: Response) => {
    res.json({
        success: true,
        courses: [],
    });
});

/**
 * @route   POST /api/teachers/courses
 * @desc    Create a new course
 * @access  Private (Teacher only)
 */
router.post('/courses', (req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Course created',
        course: {},
    });
});

/**
 * @route   GET /api/teachers/profile
 * @desc    Get teacher profile
 * @access  Private (Teacher only)
 */
router.get('/profile', (req: Request, res: Response) => {
    res.json({
        success: true,
        user: req.user,
    });
});

export default router;
