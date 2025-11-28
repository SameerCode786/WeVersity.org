import nodemailer from 'nodemailer';
import { config } from '../config';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.email.user,
        pass: config.email.password,
    },
});

/**
 * Send OTP email
 */
export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
    // If email is not configured, just log the OTP (for development)
    if (!config.email.user || !config.email.password) {
        console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
        return;
    }

    const mailOptions = {
        from: config.email.from,
        to: email,
        subject: 'WeVersity - Password Reset OTP',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7F56D9 0%, #9333EA 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px solid #7F56D9; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
          .otp-code { font-size: 32px; font-weight: bold; color: #7F56D9; letter-spacing: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #6B7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You requested to reset your password for your WeVersity account. Use the OTP code below to proceed:</p>
            
            <div class="otp-box">
              <p style="margin: 0; font-size: 14px; color: #6B7280;">Your OTP Code</p>
              <p class="otp-code">${otp}</p>
              <p style="margin: 0; font-size: 12px; color: #EF4444;">Expires in ${config.otp.expiryMinutes} minutes</p>
            </div>
            
            <p><strong>Important:</strong></p>
            <ul>
              <li>This OTP is valid for ${config.otp.expiryMinutes} minutes only</li>
              <li>Do not share this code with anyone</li>
              <li>If you didn't request this, please ignore this email</li>
            </ul>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} WeVersity. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        // Fallback to console log in case of email error
        console.log(`[FALLBACK] OTP for ${email}: ${otp}`);
    }
};

/**
 * Send welcome email after successful registration
 */
export const sendWelcomeEmail = async (email: string, fullName: string, role: string): Promise<void> => {
    if (!config.email.user || !config.email.password) {
        console.log(`[DEV MODE] Welcome email would be sent to ${email}`);
        return;
    }

    const mailOptions = {
        from: config.email.from,
        to: email,
        subject: 'Welcome to WeVersity!',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7F56D9 0%, #9333EA 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to WeVersity! 🎉</h1>
          </div>
          <div class="content">
            <p>Hello ${fullName},</p>
            <p>Thank you for joining WeVersity as a <strong>${role}</strong>!</p>
            <p>We're excited to have you on board. Start exploring courses and connect with our community.</p>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The WeVersity Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};
