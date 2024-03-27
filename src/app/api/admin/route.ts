import { NextRequest ,NextResponse } from 'next/server';
const nodemailer = require('nodemailer')

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

async function sendEmail(to: string, subject: string, text: string) {

    try {
        await transporter.sendMail({
            from: "mailtrap@demomailtrap.com",
            to,
            subject,
            text,
        })
    }
    catch (error) {
        console.error("Error: error sending email: ", error);
        throw new Error('Failed to send email');
    }

}

export async function POST(request: NextRequest)
{
    const res = await request.json();
    try {
        await sendEmail(res.adminEmail, 'Your 2FA Code', `Your 2FA code is: ${res.code}`);
        return NextResponse.json({ message: "2FA code sent to admin email successfully."}, {status: 200});
    } catch (error) {
        console.error('Error sending 2FA code to admin email:', error);
        return NextResponse.json({ message: "Failed to send 2FA code to admin email."}, {status : 400})
    } 
}
