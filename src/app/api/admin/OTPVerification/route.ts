import { NextRequest, NextResponse } from 'next/server';
import AdminOTPVerification from '@/models/AdminOTPVerification';
import bcrypt from 'bcryptjs';

async function validateRequest(request: NextRequest) {
    const { adminEmail, otp } = await request.json();
    if (!adminEmail || !otp) {
        console.error('Missing required fields');
        throw new Error('Missing required fields');
    }
    return { adminEmail, otp };
}

async function findAdmin(adminEmail: string) {
    const admin = await AdminOTPVerification.findOne({ adminEmail });
    if (!admin) {
        console.error('Admin does not exist in database');
        throw new Error("Admin doesn't exist in database");
    }
    return admin;
}

function checkOTPExpiry(admin: any) {
    const expiresAt = new Date(admin.expiresAt);
    const now = new Date();
    if (expiresAt.getTime() < now.getTime()) {
        throw new Error('OTP expired. Please request a new OTP.');
    }
}

async function verifyOTP(otp: string, hashedOTP: string) {
    const valid = await bcrypt.compare(otp, hashedOTP);
    if (!valid) {
        console.error('Invalid OTP');
        throw new Error('Invalid OTP');
    }
}

async function handleVerificationSuccess(adminEmail: string) {
    await AdminOTPVerification.deleteMany({ adminEmail });
    return NextResponse.json({ message: 'Admin is verified successfully' }, { status: 200 });
}

async function handleVerificationFailure(error: Error) {
    return NextResponse.json({ message: `Error: ${error.message}` }, { status: 400 });
}

export async function POST(request: NextRequest, response: NextResponse) {
    try {
        const { adminEmail, otp } = await validateRequest(request);
        const admin = await findAdmin(adminEmail);
        checkOTPExpiry(admin);
        await verifyOTP(otp, admin.otp);
        return await handleVerificationSuccess(adminEmail);
    } catch (error: any) {
        if (error.message.includes('OTP expired')) {
            await AdminOTPVerification.deleteMany({ adminEmail: error.message.split(' ')[0] });
        }
        return await handleVerificationFailure(error);
    }
}
