import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

const adminApi = ['/api/admin/Dashboard'];

const adminPaths = [
  '/',
  '/admin_2FA',
  '/admin_dashboard',
  '/api/admin/Dashboard',
];

const userPaths = [];

function removeUser(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.delete('sessionID');
  response.cookies.delete('RCUserCookie');
  return response;
}

async function isSessionValid(request: NextRequest, sessionID: string) {
  const sessionValid = await fetch(
    `${request.nextUrl.origin}/api/admin/SessionID`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `sessionID=${sessionID}`,
      },
      credentials: 'include',
    },
  );
  return sessionValid.status === 200;
}

async function validateAdminSession(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const sessionID = request.cookies.get('sessionID')?.value;

  if (!sessionID) {
    // Allow unauthenticated access to these paths
    if (path === '/' || path === '/admin_2FA') {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const sessionValid = await isSessionValid(request, sessionID);

    // Handle access to dashboard and API routes
    if (path === '/admin_dashboard' || adminApi.includes(path)) {
      return sessionValid ? NextResponse.next() : removeUser(request);
    }

    if (path == '/' || path == '/admin_2FA') {
      return sessionValid
        ? NextResponse.redirect(new URL('/admin_dashboard', request.url))
        : removeUser(request);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error validating sessionID:', error);
    return NextResponse.error();
  }
}

export async function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    const userCookie = request.cookies.get('RCUserCookie')?.value;

    // redirect user to upload page if logged in or has cookie
    if (userCookie && path === '/') {
      return NextResponse.redirect(new URL('/upload', request.url));
    }

		// proceed API routes
		if (path.startsWith('/api/')) {
			return NextResponse.next();
		}

		// for all the user, if there's no cookie, redirect to login
		if (!userCookie && path !== '/') {
			const url = new URL('/', request.url);
			url.searchParams.set('status', '401');
			return NextResponse.redirect(url);
		}

		// begin admin routes validation
    if (adminPaths.includes(path)) {
      const validationResult = await validateAdminSession(request);
      return validationResult;
    }

    // Default behavior: allow access to all other routes
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.json(
      { message: 'Failed middleware.' },
      { status: 500 },
    );
  }
}

// exclude static and resources route
export const config = {
  matcher: ['/((?!.*\\.).*)'],
};
