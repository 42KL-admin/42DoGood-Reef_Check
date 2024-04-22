import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function POST(request: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db("42reef-check");
        let data = await request.json();

        const emailExist = await db
            .collection("users")
            .findOne({ email: data.email });
        if (!emailExist)
            return NextResponse.json({ message: "Invalid email" }, { status: 404 });
        return NextResponse.json({ message: "Proceeding with email: " + data.email, user: emailExist}, { status: 200 });
    } catch (e) {
        console.error(e);
    }
}