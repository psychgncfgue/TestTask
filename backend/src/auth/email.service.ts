import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    async sendConfirmationEmail(email: string, token: string) {
        const confirmationLink = `http://localhost:3000/auth/confirm-email?token=${token}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Confirm your registration',
            text: `Please confirm your registration by clicking the following link: ${confirmationLink}`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Email sending failed');
        }
    }

    async sendPasswordResetCode(email: string, code: string) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code',
            text: `Ваш код для сброса пароля: ${code}`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error sending password reset code email:', error);
            throw new Error('Failed to send password reset code');
        }
    }
}