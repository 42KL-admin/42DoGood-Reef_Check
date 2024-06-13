import { NextRequest ,NextResponse } from 'next/server';
import AdminSessionID from "@/models/AdminSessionID";
import clientPromise from "../../../../../lib/mongodb";
import {v4 as uuidv4} from 'uuid';
import { Db } from 'mongodb';

export async function POST(req: NextRequest)
{
	try {
		const res = await req.json();
		const sessionID = uuidv4();
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
            secure: true,
			sameSite: 'strict',
            maxAge: 60 * 60, // 1 hour
			expires: new Date(Date.now() + 60 * 60 * 1000), 
            path: '/',
        });

		return response;
    } catch (error) {
        console.error('Error creating sessionID:', error);
        return NextResponse.json({ message: "Failed to create or save sesionID to database."}, {status: 400});
    }
}

export async function DELETE(req: NextRequest)
{
	try {
		const sessionID = req.cookies.get('sessionID')?.value;

		if (!sessionID) {
			return NextResponse.json({ message: 'No session ID found' }, { status: 400 });
		}

        const client = await clientPromise;
        const db = client.db("42reef-check");
		const result = await db.collection("adminSessions").deleteMany({ sessionID });

		if (result.deletedCount === 0) {
			return NextResponse.json({ message: "SessionID not found" }, { status: 404 });
		}

		const response = NextResponse.json({ message: "SessionID deleted successfully" }, { status: 200 });
		response.cookies.set('sessionID', '', { expires: new Date(0) });
		return response;
	} catch (error) {
        console.error('Error deleting sessionID:', error);
        return NextResponse.json({ message: "Failed to delete SessionID."}, {status: 400});
    }
}

export async function GET(req: NextRequest)
{
    try {
        const client = await clientPromise;
        const db = client.db("42reef-check");
		const sessionID = req.cookies.get('sessionID')?.value;

		// console.log(sessionID);

		if (!sessionID) {
            return NextResponse.json({ message: 'No session ID found' }, { status: 401 });
        }
		
		const sessionExists = await db.collection('adminSessions').findOne({ sessionID });
		
		// console.log('Query:', { sessionID });
		// console.log('Result:', sessionExists);

        if (!sessionExists) {
			return NextResponse.json({status: 401});  //{ message: "SessionID is invalid or expired."}, 
		}
		
		// console.log("Session Exists!!!!");

		const currentTime = new Date();
		if (sessionExists.expiresAt < currentTime) {
			return NextResponse.json({status: 440}); //SessionID on Database is expired
		}
		return NextResponse.json({status: 200}); //{ message: "SessionID is valid."}, 
    } catch (error) {
        console.error('Error validating sessionID to database:', error);
        return NextResponse.json({ message: "Failed to validate sessionID."}, {status: 500});
    }
}
