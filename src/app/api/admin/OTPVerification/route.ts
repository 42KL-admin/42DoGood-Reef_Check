import { NextRequest ,NextResponse } from 'next/server';
import AdminOTPVerification from "@/models/AdminOTPVerification";
import clientPromise from "../../../../../lib/mongodb";
const bcrypt = require('bcryptjs');

export async function POST(request: NextRequest, response: NextResponse)
{
    try {
        const { adminEmail, otp } = await request.json();
        const client = await clientPromise;
        const db = client.db("42reef-check");
        const admin = await db.collection("adminOTPVerification").findOne({ adminEmail: adminEmail});

        
        if (!adminEmail || !otp) {
            throw new Error('Missing required fields');
        }
        if (!admin) {
            throw new Error("Admin doesn't exist in database");
        }

        // To check whether is OTP is expired or not
        if (admin.expiresAt < Date.now()) {
            await db.collection("adminOTPVerification").deleteMany({ adminEmail: adminEmail });
            throw new Error("OTP expired. Please request a new OTP.");
        } else {
            console.log(otp);
            const hashedOTP = await bcrypt.hash(otp, admin.salt);
            const valid = await bcrypt.compare(hashedOTP, admin.otp);

            // If OTP is invalid
            if (!valid) {
                await db.collection("adminOTPVerification").deleteMany({ adminEmail: adminEmail });
                return NextResponse.json({ message: "Admin is verified successfully"}, {status: 200});
            } else {
                throw new Error("Invalid OTP.");
            }
        }
    } catch (error) {
        return NextResponse.json({ message: "" + error}, {status: 400});
    }
}