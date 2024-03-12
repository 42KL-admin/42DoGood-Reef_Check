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
            return NextResponse.json({ message: "Invalid email" }, { status: 400 });
        return NextResponse.json({ message: "Proceeding with email: " + data.email }, { status: 200 });
    } catch (e) {
        console.error(e);
    }
}