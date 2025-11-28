import jwt from 'jsonwebtoken';
import { config } from '../config';
import { UserRole } from '../models/types';

export interface JWTPayload {
    userId: string;
    email: string;
    role: UserRole;
}

/**
 * Generate a JWT token
 */
export const generateToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    } as jwt.SignOptions);
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
    try {
        return jwt.verify(token, config.jwt.secret) as JWTPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};