import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import clientPromise from '../lib/mongodb';
// import { validateAdminSession } from '../lib/middleware/validateSession';

const adminApi = [
	'/api/admin/Dashboard',
];

const adminPaths = [
	'/',
	'/admin_2FA',
	'/admin_dashboard',
	'/api/admin/Dashboard',
];

const userPaths = [
];

function removeUser(request: NextRequest) {
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.delete('sessionID')
	response.cookies.delete('RCUserCookie')
	console.log("Removing user");
    return response;
}

export async function validateAdminSession(request: NextRequest) {
try {
	// console.log("Validating Session");
	const path = request.nextUrl.pathname;
	const sessionID = request.cookies.get('sessionID')?.value;


	if (!sessionID) { // If sessionID is missing
		if (path == '/' || path == '/admin_2FA') {
			return NextResponse.next();
		}
		return NextResponse.redirect(new URL('/', request.url))
	}

	const sessionValid = await fetch(`${request.nextUrl.origin}/api/admin/SessionID`, {
		method: "GET",
		headers: {
			'Content-Type': 'application/json',
			'Cookie': `sessionID=${sessionID}`
		},
		credentials: 'include' // Ensure cookies are included in the request
	});

	if (path == '/admin_dashboard' || adminApi.includes(path)) {
		
		// console.log("Dashboard stuff");

		if (sessionValid.status == 200) {
			return NextResponse.next();
		}
		
		console.log("api access denied");
		return removeUser(request);
	}

	if (path == '/' || path == '/admin_2FA') {
		// console.log("Attempt to enter / or /admin_2FA")
		if (sessionValid.status == 200) {
			console.log("redirecting to admin_dashboard");
			return NextResponse.redirect(new URL('/admin_dashboard', request.url))
		}
		else {
			console.log("incorrect SessionID");
			return removeUser(request);
		}
	}

	return NextResponse.next();
} catch (error) {
	console.error('Error validating sessionID to database:', error);
	return { status: 500, message: "Failed to validate sessionID." };
}
}
  

export async function middleware(request: NextRequest) {
	try {
		console.log("\n\nEntering Middleware");
		const path = request.nextUrl.pathname;
    	console.log('Path is', path); // Debugging purposes

		if (adminPaths.includes(path)) {
			// console.log("Admin path matched, validating admin session");
			const validationResult = await validateAdminSession(request);
			return validationResult;
		}
		// console.log("no redirects");
		return NextResponse.next(); // TODO Can redirect random urls to home page
	}catch{
		return NextResponse.json({ message: "Failed middleware."}, {status: 500});
	}
}

export const config = {
  matcher: [
	'/:path*',
],
}
// '/',
// '/admin_2FA',
// '/admin_dashboard',
// '/api/admin/Dashboard'