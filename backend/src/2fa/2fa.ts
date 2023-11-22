import { authenticator, totp } from 'otplib';
import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.resolve(__dirname, '../../.env') });

export function generateSecret(): string {
  return authenticator.generateSecret();
}

export function generateTotpCode(secret: string): string {
  totp.options = { step: 120 };
  return totp.generate(secret);
}

export function verifyTFA(secret: string, code: string): boolean {
  return totp.verify({ secret, token: code });
}

export async function sendEmail(email: string, code: string) {
  try {
    console.log('path', process.env.EMAIL_USER);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: 'ft_transcendence <ft.transcendence1337@gmail.com>',
      to: email,
      subject: '2FA of ft_transcendence.',
      text: `Here is your 6-digit code: ${code}
It expires in 2 minutes, Hurry up!`,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email: ', error);
    throw new Error('Failed to send email');
  }
}
