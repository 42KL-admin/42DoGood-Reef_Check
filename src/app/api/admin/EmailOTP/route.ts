import { NextRequest ,NextResponse } from 'next/server';
import AdminOTPVerification from "@/models/AdminOTPVerification";
import clientPromise from "../../../../../lib/mongodb";
import { Db } from 'mongodb';

const nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");


// create reusable transporter object using the default SMTP transport
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

async function sendEmail(to: string, subject: string, html: string) {

    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject,
            html,
        })
    }
    catch (error) {
        console.error("Error: error sending email: ", error);
        throw new Error('Failed to send email');
    }

}

function generateOTP() {
    try {
        let otp = Math.floor(100000 + Math.random() * 900000).toString();
        return otp;
    } catch (error) {
        console.error("Error generating OTP: ", error);
        throw new Error('Failed to generate OTP');
    } 
}

async function generateSalt() {
    try {
        const salt = await bcrypt.genSalt(10);
        return salt;
    } catch (error) {
        console.error("Error generating salt: ", error);
        throw new Error('Failed to generate salt');
    }
}


export async function POST(request: NextRequest)
{
    const res = await request.json();
    const otp = await generateOTP();
    const salt = await generateSalt();
    const adminOTP = new AdminOTPVerification({
        otp: await bcrypt.hash(otp, salt),
        salt: salt,
        adminEmail: res.adminEmail,
    });

    // Delete all previous OTP and Save OTP to database
    try {
        const client = await clientPromise;
        const db = client.db("42reef-check");
		await db.collection("adminOTPVerification").deleteMany({ adminEmail: res.adminEmail });
        await db.collection("adminOTPVerification").insertOne(adminOTP);
    } catch (error) {
        console.error('Error saving OTP to database:', error);
        return NextResponse.json({ message: "Failed to save OTP to database."}, {status: 400});
    }

    // Send OTP to admin email
    try {
        await sendEmail(res.adminEmail, 'Your 2FA Code', `<p>Your 2FA code is: <b>${otp}</b>.</p><p>This code <b>expires in 1 hour</b>.</p>`);
        return NextResponse.json({ message: "2FA code sent to admin email successfully."}, {status: 200});
    } catch (error) {
        console.error('Error sending 2FA code to admin email:', error);
        return NextResponse.json({ message: "Failed to send 2FA code to admin email."}, {status : 400})
    } 
}
