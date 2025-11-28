/**
 * Generate a random 4-digit OTP
 */
export const generateOTP = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

/**
 * Calculate OTP expiry time
 */
export const getOTPExpiry = (minutes: number): Date => {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + minutes);
    return expiry;
};

/**
 * Check if OTP has expired
 */
export const isOTPExpired = (expiryDate: Date): boolean => {
    return new Date() > new Date(expiryDate);
};
