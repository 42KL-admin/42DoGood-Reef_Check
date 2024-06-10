import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import clientPromise from "..//lib/mongodb";

// export async function validate_SessionID(req: NextRequest) // attempt to validate sessionID directly in Middleware
// {
//     try {
//         const client = await clientPromise;
//         const db = client.db("42reef-check");
// 		const sessionID = req.cookies.get('sessionID')?.value;

// 		// console.log(sessionID);

// 		if (!sessionID) {
//             return NextResponse.json({ message: 'No session ID found' }, { status: 401 });
//         }
		
// 		const sessionExists = await db.collection('adminSessions').findOne({ sessionID });
		
// 		// console.log('Query:', { sessionID });
// 		// console.log('Result:', sessionExists);

//         if (!sessionExists) {
// 			return NextResponse.json({ message: "SessionID is invalid or expired."}, {status: 401});  //{ message: "SessionID is invalid or expired."}, 
// 		}
// 		const currentTime = new Date();
// 		// console.log("Session Exists!!!!");
// 		if (sessionExists.expiresAt < currentTime) {
// 			return NextResponse.json({ message: "SessionID expired."}, {status: 440}); //SessionID on Database is expired
// 		}
// 		else {
// 			return NextResponse.json({ message: "SessionID is valid."}, {status: 200}); //{ message: "SessionID is valid."},
// 		}
		
//     } catch (error) {
//         console.error('Error validating sessionID to database:', error);
//         return NextResponse.json({ message: "Failed to validate sessionID."}, {status: 500});
//     }
// }


// const validatedResponse = await validate_SessionID(request); // uses the validation function above

// console.log('ValidatedResponse=', validatedResponse)


// if (validatedResponse.status !== 200) {
// 	console.log('Validation failed:', validatedResponse.message);
// 	return NextResponse.redirect(new URL('/', request.url));
// }

// return NextResponse.next();



// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	try {
		console.log("Entering Middleware");
		const sessionID = request.cookies.get('sessionID')?.value;

		// if (request.nextUrl.pathname == '/') { //prevents middleware to be called multiple times for login page
		// 	return NextResponse.next();
		// }
		// if (!sessionID) {
		// }

		const validatedResponse = await fetch(`${request.nextUrl.origin}/api/admin/SessionID`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
				'Cookie': `sessionID=${sessionID}`
            },
            credentials: 'include' // Ensure cookies are included in the request
        });
		const valid = await validatedResponse.json();

		console.log('path is', request.nextUrl.pathname); //debugged purposes
		
		if (request.nextUrl.pathname == '/' || request.nextUrl.pathname == '/admin_2FA') {
			console.log("Attempt to enter / or /admin_2FA")
			if (valid.status == 200) {
				console.log("redirecting to admin_dashboard");
				return NextResponse.redirect(new URL('/admin_dashboard', request.url))
			}
			return NextResponse.next();
		}

		if (request.nextUrl.pathname.endsWith('/admin_dashboard')) {

			console.log("checking api")

			if (valid.status == 200) {
				return NextResponse.next();
			}
			
			if (valid.status == 440) {
				return NextResponse.redirect(new URL('/', request.url))
			}
			else {
				console.log("api access denied");
				NextResponse.json({ message: "Access to api denied" }, { status: 401 });
			}
		}

		if (valid.status == 401)	{
			return NextResponse.redirect(new URL('/', request.url))
		}

		if (valid.status === 200) {
			console.log("Middleware is happy");
            return NextResponse.next();
        }

		return NextResponse.json({ message: valid.message || "Failed to validate session ID" }, { status: 500 });
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