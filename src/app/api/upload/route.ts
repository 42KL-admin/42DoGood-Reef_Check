import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";


export async function POST(request : NextRequest) {

    try {
        const client = await clientPromise;
        const db = client.db("42reef-check");
        const file = request.body;
        console.log(file);

        db.collection("users")
        .insertOne({ file: file })
        .then((result) => {
            console.log(result);
        })
        .catch(err => {
            return NextResponse.json({ message: "error input files"}, { status: 400 });
        })
        return NextResponse.json({ message: "success input files"}, { status: 200 });
    } catch (e: any) {
        console.error(e);
    }
}