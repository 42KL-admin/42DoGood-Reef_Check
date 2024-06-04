import { NextRequest ,NextResponse } from 'next/server';
import AdminSessionID from "@/models/AdminSessionID";
import clientPromise from "../../../../../lib/mongodb";
import {v4 as uuidv4} from 'uuid';
import { Db } from 'mongodb';

const bcrypt = require("bcryptjs");


// function generateSessionID() {
//     try {
//         let sessionID = Math.floor(100000 + Math.random() * 900000).toString();
//         return sessionID;
//     } catch (error) {
//         console.error("Error generating SessionID: ", error);
//         throw new Error('Failed to generate SessionID');
//     } 
// }

// async function generateSalt() {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         return salt;
//     } catch (error) {
//         console.error("Error generating salt: ", error);
//         throw new Error('Failed to generate salt');
//     }
// }


export async function POST(req: NextRequest)
{
	try {
		const res = await req.json();
		const sessionID = uuidv4();
		// const salt = await generateSalt();
		const adminOTP = new AdminSessionID({
			sessionID,
			adminEmail: res.adminEmail,
			createdAt: new Date(),
			expiresAt: new Date(Date.now() + 60 * 60 * 1000), 
		});

        const client = await clientPromise;
        const db = client.db("42reef-check");
		await db.collection("adminSessions").deleteMany({ adminEmail: res.adminEmail });
        await db.collection("adminSessions").insertOne(adminOTP);

		const response = NextResponse.json({ message: 'Logged in successfully' });
        response.cookies.set('sessionID', sessionID, {
            httpOnly: true,
            // secure: true,
			sameSite: 'none',
            // maxAge: 60 * 60, // 1 hour
			expires: new Date(Date.now() + 60 * 60 * 1000), 
            path: '/',
        });

		return response;
    } catch (error) {
        console.error('Error creating sessionID:', error);
        return NextResponse.json({ message: "Failed to create or save sesionID to database."}, {status: 400});
    }
}

export async function GET(req: NextRequest)
{
    try {
        const client = await clientPromise;
        const db = client.db("42reef-check");
		const sessionID = req.cookies.get('sessionID');

		if (!sessionID) {
            return NextResponse.json({ message: 'No session ID found' }, { status: 401 });
        }
		
		const sesionExists = await db.collection('adminSessions').findOne({ sessionID });
        if (sesionExists)
			return NextResponse.json({ message: "SessionID is valid."}, {status: 200});
		else
			return NextResponse.json({ message: "SessionID is invalid or expired."}, {status: 401}); 
    } catch (error) {
        console.error('Error validating sessionID to database:', error);
        return NextResponse.json({ message: "Failed to validate sessionID."}, {status: 500});
    }
}
