import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	try {
		const sessionID = request.cookies.get('sessionID');
		if (!sessionID)
			return NextResponse.redirect(new URL('/', request.url))
		const validatedResponse = await fetch(`${request.nextUrl.origin}/api/admin/SessionID`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Ensure cookies are included in the request
        });

		const valid = await validatedResponse.json();

		if (valid.status == 401)	{
			return NextResponse.redirect(new URL('/', request.url))
		}

		if (valid.status === 200) {
            return NextResponse.next();
        }
		return NextResponse.json({ message: valid.message || "Failed to validate session ID" }, { status: 500 });
	}catch{
		return NextResponse.json({ message: "Failed middleware."}, {status: 500});
	}
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/admin_dashboard',
}