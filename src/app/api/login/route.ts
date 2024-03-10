import { NextResponse } from "next/server";

export async function POST(request: Request) {
    let data = await request.json();
    if (data.email === "admin@gmail.com")
        return NextResponse.redirect(new URL('/upload', request.url));
    else
        return NextResponse.json({ error: "Invalid email" });
}