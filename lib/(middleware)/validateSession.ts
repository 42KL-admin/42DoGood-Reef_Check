import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function validateAdminSession(request: NextRequest) {
  try {
	console.log("Validating Session");
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

	if (path == '/admin_dashboard' || path.startsWith('/api/admin')) {

		if (sessionValid.status == 200) {
			return NextResponse.next();
		}
		
		if (sessionValid.status == 440) {
			return NextResponse.redirect(new URL('/', request.url))
		}
		console.log("api access denied");
		return NextResponse.redirect(new URL('/', request.url))
	}

    if (path == '/' || path == '/admin_2FA') {
		console.log("Attempt to enter / or /admin_2FA")
		if (sessionValid.status == 200) {
			console.log("redirecting to admin_dashboard");
			return NextResponse.redirect(new URL('/admin_dashboard', request.url))
		}
	}

	return NextResponse.next();
  } catch (error) {
    console.error('Error validating sessionID to database:', error);
    return { status: 500, message: "Failed to validate sessionID." };
  }
}
