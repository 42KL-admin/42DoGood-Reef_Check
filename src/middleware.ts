import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import clientPromise from '../lib/mongodb';
import { validateAdminSession } from '../lib/middleware/validateSession';

const adminPaths = [
	'/',
	'/admin_2FA',
	'/admin_dashboard',
	'/api/admin',
  ];
  
  const userPaths = [
  ];

export async function middleware(request: NextRequest) {
	try {
		console.log("Entering Middleware");
		const path = request.nextUrl.pathname;
    	console.log('path is', path); // Debugging purposes

		if (adminPaths.includes(path) || path.startsWith('/api/admin')) {
			console.log("Admin path matched, validating admin session");
			const validationResult = await validateAdminSession(request);
			return validationResult;
		}
		// console.log("no redirects");
		return NextResponse.next(); // TODO Can redirect random urls to home page
	}catch{
		return NextResponse.json({ message: "Failed middleware."}, {status: 500});
	}
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
	'/:path*',
],
}
// '/',
// '/admin_2FA',
// '/admin_dashboard',
// '/api/admin/Dashboard'