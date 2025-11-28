import { Router } from 'express';
import { body } from 'express-validator';
import {
    getCurrentUser,
    login,
    resetPassword,
    sendOTP,
    signup,
    verifyOTP,
} from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';
import { handleValidationErrors } from '../middlewares/validator';

const router = Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user (student or teacher)
 * @access  Public
 */
router.post(
    '/signup',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        body('role')
            .isIn(['student', 'teacher'])
            .withMessage('Role must be either student or teacher'),
        body('fullName').optional().trim(),
        body('userName').optional().trim(),
        body('phoneNumber').optional().trim(),
        body('avatarUrl').optional().isURL().withMessage('Avatar URL must be valid'),
        body('bio').optional().trim(),
        body('expertise').optional().trim(),
        handleValidationErrors,
    ],
    signup
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
        handleValidationErrors,
    ],
    login
);

/**
 * @route   POST /api/auth/send-otp
 * @desc    Send OTP to email for password reset
 * @access  Public
 */
router.post(
    '/send-otp',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        handleValidationErrors,
    ],
    sendOTP
);

/**
 * @route   POST /api/auth/verify-otp
 * @desc    Verify OTP
 * @access  Public
 */
router.post(
    '/verify-otp',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('otp')
            .isLength({ min: 4, max: 4 })
            .withMessage('OTP must be 4 digits'),
        handleValidationErrors,
    ],
    verifyOTP
);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password after OTP verification
 * @access  Public
 */
router.post(
    '/reset-password',
    [
        body('email').isEmail().withMessage('Please provide a valid email'),
        body('newPassword')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        handleValidationErrors,
    ],
    resetPassword
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authMiddleware, getCurrentUser);

export default router;
