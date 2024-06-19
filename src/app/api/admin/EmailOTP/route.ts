import { NextRequest, NextResponse } from 'next/server';
import AdminOTPVerification, { IAdminOTPVerification } from '@/models/AdminOTPVerification';
import clientPromise from '../../../../../lib/mongodb';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import { generateResponse } from '../../../../utils/response';

// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
});

// Function to send email
async function sendEmail(to: string, subject: string, html: string) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error('Failed to send email');
    }
}

// Function to generate OTP
function generateOTP() {
    try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    } catch (error) {
        console.error("Error generating OTP:", error);
        throw new Error('Failed to generate OTP');
    }
}

// Function to generate salt
async function generateSalt() {
    try {
        const salt = await bcrypt.genSalt(10);
        return salt;
    } catch (error) {
        console.error("Error generating salt:", error);
        throw new Error('Failed to generate salt');
    }
}

// Function to save OTP to database
async function saveOTPToDatabase(adminOTP: typeof AdminOTPVerification, adminEmail: string) {
    try {
        const client = await clientPromise;
        const db = client.db("42reef-check");

        // Delete all previous OTPs and save the new OTP to the database
        await db.collection("adminOTPVerification").deleteMany({ adminEmail });
        await db.collection("adminOTPVerification").insertOne(adminOTP);
    } catch (error) {
        console.error('Error saving OTP to database:', error);
        throw new Error('Failed to save OTP to database');
    }
}

// POST request handler
export async function POST(request: NextRequest) {
    try {
        const { adminEmail } = await request.json();

        if (!adminEmail) {
            return generateResponse({ error: "Admin email is required" }, 400);
        }

        const otp = generateOTP();
        const salt = await generateSalt();
        const hashedOtp = await bcrypt.hash(otp, salt);

        const adminOTP = new AdminOTPVerification({
            otp: hashedOtp,
            salt,
            adminEmail
        });

        // Save OTP to the database
        await saveOTPToDatabase(adminOTP, adminEmail);

        // Send OTP to admin email
        await sendEmail(adminEmail, 'Your 2FA Code', `<p>Your 2FA code is: <b>${otp}</b>.</p><p>This code <b>expires in 1 hour</b>.</p>`);

        return generateResponse({ message: "2FA code sent to admin email successfully." }, 200);
    } catch (error) {
        console.error('Error processing request:', error);
        return generateResponse({ error: "Failed to process request." }, 500);
    }
}
