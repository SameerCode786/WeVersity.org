import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../models/types';
import { JWTPayload, verifyToken } from '../utils/jwt';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}

/**
 * Middleware to verify JWT token
 */
export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'No token provided. Authorization header must be in format: Bearer <token>',
            });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = verifyToken(token);

        // Attach user data to request
        req.user = decoded;

        next();
    } catch (error: any) {
        res.status(401).json({
            success: false,
            message: error.message || 'Invalid or expired token',
        });
    }
};

/**
 * Middleware to check if user has required role
 */
export const requireRole = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Authentication required',
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(' or ')}`,
            });
            return;
        }

        next();
    };
};

/**
 * Middleware for student-only routes
 */
export const requireStudent = requireRole('student');

/**
 * Middleware for teacher-only routes
 */
export const requireTeacher = requireRole('teacher');
