import { NextRequest ,NextResponse } from 'next/server';
import AdminOTPVerification from '@/models/AdminOTPVerification';
const bcrypt = require('bcryptjs');

export async function POST(request: NextRequest, response: NextResponse)
{
    try {
        const { adminEmail, otp } = await request.json();
        if (!adminEmail || !otp) {
            console.log('Missing required fields')
            throw new Error('Missing required fields');
        }

        const admin = await AdminOTPVerification.findOne({ 'adminEmail': adminEmail});

        if (!admin) {
            console.log('Admin does not exist in database')
            throw new Error("Admin doesn't exist in database");
        }

        // To check whether is OTP is expired or not
        const expiresAt = new Date(admin.expiresAt);
        const now = new Date();
        if (expiresAt.getTime() < now.getTime()) {
            await AdminOTPVerification.deleteMany({ adminEmail: adminEmail });
            throw new Error("OTP expired. Please request a new OTP.");
        } else {
            const hashedOTP = await bcrypt.hash(otp, admin.salt);
			const valid = hashedOTP == admin.otp;
			console.log('hashedOTP:', hashedOTP);
			console.log('admin.otp:', admin.otp);
			console.log('valid:', valid);

            // If OTP is invalid
            if (valid == true) {
                await AdminOTPVerification.deleteMany({ adminEmail: adminEmail });
                return NextResponse.json({ message: "Admin is verified successfully"}, {status: 200});
            } else {
                throw new Error("Invalid OTP.");
            }
        }
    } catch (error) {
        return NextResponse.json({ message: "" + error}, {status: 400});
    }
}