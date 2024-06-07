import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	console.log('middleware firing!')
	// console.log(request)
	console.log(request.cookies, Date.now())
	try {
		const sessionID = request.cookies.get('sessionID');
		if (!sessionID) {
			console.log('the redirect happening?')
			return NextResponse.redirect(new URL('/', request.url))
		}

		// think the idea is trying to check if it's a valid session/sessionID
		// however,
		// two things!!
		// 1) it's... sending a request here, from the middleware... (server side?)
		//    and... cookies are not included (since it's a new/different request) :joy:
		// 2) could just... fire to MongoDB/call the check sessionID service directly!
		const validatedResponse = await fetch(`${request.nextUrl.origin}/api/admin/SessionID`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // Ensure cookies are included in the request
        });

		const valid = await validatedResponse.json();
		// this always return 'No session ID found'!
		console.log({ valid })

		if (valid.status == 401)	{
			console.log('is it re-directing over here')
			return NextResponse.redirect(new URL('/', request.url))
		}

		if (valid.status === 200) {
			console.log('middleware going next!')
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