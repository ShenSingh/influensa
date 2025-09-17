import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Debug: Check if environment variables are loaded
        console.log('Email configuration check:');
        console.log('EMAIL_USER:', process.env.EMAIL_USER || 'systeminfo8962@gmail.com');
        console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '[SET]' : '[USING FALLBACK]');

        // Configure email transporter using your working configuration
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            tls: {
                rejectUnauthorized: false, // Allow self-signed certificates
            },
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER || "systeminfo8962@gmail.com",
                pass: process.env.EMAIL_PASS || "ggby zfjp file qrnn",
            },
        });

        // Verify the connection configuration
        this.transporter.verify((error, success) => {
            if (error) {
                console.error('❌ Email transporter verification failed:', error.message);
            } else {
                console.log('✅ Email transporter is ready to send messages');
            }
        });
    }

    async sendEmail(options: EmailOptions): Promise<void> {
        const mailOptions = {
            from: '"Influensa" <systeminfo8962@gmail.com>',
            to: options.to,
            subject: options.subject,
            html: options.html
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.response);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email');
        }
    }

    async sendPasswordResetEmail(email: string, resetToken: string, userName: string): Promise<void> {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Password Reset Request</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .button { display: inline-block; background-color: #4f46e5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
                    .warning { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${userName},</p>
                        
                        <p>You recently requested to reset your password for your Influensa account. Click the button below to reset it:</p>
                        
                        <p style="text-align: center;">
                            <a href="${resetUrl}" class="button">Reset Your Password</a>
                        </p>
                        
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; background-color: #f1f1f1; padding: 10px; border-radius: 5px;">
                            ${resetUrl}
                        </p>
                        
                        <div class="warning">
                            <strong>Security Notice:</strong>
                            <ul>
                                <li>This link will expire in <strong>1 hour</strong></li>
                                <li>If you didn't request this password reset, please ignore this email</li>
                                <li>Your password will remain unchanged until you create a new one</li>
                            </ul>
                        </div>
                        
                        <p>If you're having trouble clicking the button, you can also reset your password by going to the login page and clicking "Forgot Password".</p>
                        
                        <p>Thanks,<br>The Influensa Team</p>
                    </div>
                    <div class="footer">
                        <p>This email was sent to ${email}. If you didn't request this password reset, you can safely ignore this email.</p>
                        <p>&copy; ${new Date().getFullYear()} Influensa. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await this.sendEmail({
            to: email,
            subject: 'Reset Your Password - Influensa',
            html: html
        });
    }
}

export default new EmailService();
