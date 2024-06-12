import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { validateSession } from '../lib/validateSession';

export async function middleware(request: NextRequest) {
	try {
		console.log("Entering Middleware");
		const sessionID = request.cookies.get('sessionID')?.value;

		const validationResult = await validateSession(sessionID);

		console.log('path is', request.nextUrl.pathname); //debugged purposes
		
		if (request.nextUrl.pathname == '/' || request.nextUrl.pathname == '/admin_2FA') {
			console.log("Attempt to enter / or /admin_2FA")
			if (validationResult.status == 200) {
				console.log("redirecting to admin_dashboard");
				return NextResponse.redirect(new URL('/admin_dashboard', request.url))
			}
			return NextResponse.next();
		}

		if (request.nextUrl.pathname.endsWith('/admin_dashboard')) {

			console.log("checking api")

			if (validationResult.status == 200) {
				return NextResponse.next();
			}
			
			if (validationResult.status == 440) {
				return NextResponse.redirect(new URL('/', request.url))
			}
			else {
				console.log("api access denied");
				NextResponse.json({ message: "Access to api denied" }, { status: 401 });
			}
		}

		if (validationResult.status == 401)	{
			return NextResponse.redirect(new URL('/', request.url))
		}

		if (validationResult.status === 200) {
			console.log("Middleware is happy");
            return NextResponse.next();
        }

		return NextResponse.json({ message: validationResult.message || "Failed to validate session ID" }, { status: 500 });
	}catch{
		return NextResponse.json({ message: "Failed middleware."}, {status: 500});
	}
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
	'/',
	'/admin_2FA',
	'/admin_dashboard',
	'/api/admin/Dashboard'
  ],
}