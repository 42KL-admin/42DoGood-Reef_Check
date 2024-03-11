import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function POST(request: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("42reef-check");
        let data = await request.json();

        const emailExist = await db
            .collection("users")
            .countDocuments({ email: data.email });
        if (!emailExist)
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        return NextResponse.redirect(new URL('/upload', request.url));
    } catch (e) {
        console.error(e);
    }
}