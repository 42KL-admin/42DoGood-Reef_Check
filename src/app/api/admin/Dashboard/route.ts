import { NextRequest ,NextResponse } from 'next/server';
import clientPromise from "../../../../../lib/mongodb";
const bcrypt = require('bcryptjs');

// Fetches all users in the format of {email, role} to display on Dashboard
export async function GET(req: NextRequest) {
	try {
	  const client = await clientPromise;
	  const db = client.db('42reef-check');
	  const users = await db.collection('users').find({}, { projection: { email: 1, role: 1 } }).toArray();
  
	  // Map the documents to the desired structure
	  const emails = users.map(({ email, role }) => ({
		email,
		role: role || 'can edit', // Assign 'can edit' if role is not present
	  }));
  
	  return NextResponse.json({ success: true, data: emails }, { status: 200 });
	} catch (error) {
	  console.error('Error fetching emails:', error);
	  return NextResponse.json({ success: false, message: 'Failed to fetch emails' }, { status: 500 });
	}
}

// Creates a new user on the data base, only adds a role if admin. Ohterwise only email
export async function POST(req: NextRequest) {
	try {
	  const client = await clientPromise;
	  const db = client.db('42reef-check');
	  const { email, role } = await req.json();
  
	  // Check if the email already exists
	  const emailExist = await db.collection('users').findOne({ email });
	  if (emailExist) {
		return NextResponse.json({ message: 'Email already exists' }, { status: 400 });
	  }

	  // Prepare the document to be inserted
	  if (role === "admin")
		await db.collection('users').insertOne({email, role});
	  else
	  	await db.collection('users').insertOne({email});
	//   if (role === 'admin') {
	// 	document.role = 'admin';
	//   }
  
	  // Insert the new email and role (if provided) into the database
	//   await db.collection('users').insertOne(document);
  
	  return NextResponse.json({ message: `Email ${email} invited successfully` }, { status: 200 });
	} catch (error) {
	  console.error('Error inviting email:', error);
	  return NextResponse.json({ success: false, message: 'Failed to invite email' }, { status: 500 });
	}
}

// Searches for an email and changes the role by adding the admin role or dleeting the role
export async function PUT(request: NextRequest, response: NextResponse) {
    try {
        const { email, role} = await request.json();
        const client = await clientPromise;
        const db = client.db('42reef-check');
        
        if (role === 'can edit') {
            // Removes the role from the admin
            await db.collection('users').updateOne(
                { email: email },
                { $unset: { role: role } }
            );
        } else if (role === 'admin') {
            // Add the role to the admin
            await db.collection('users').updateOne(
                { email: email },
                { $set: { role } }
            );
        } else {
            throw new Error("Invalid role specified");
        }

        return NextResponse.json({ message: "Role updated successfully" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "" + error }, { status: 400 });
    }
}

// Searches for an email and deletes it
export async function DELETE(request: NextRequest, response: NextResponse) {
    try {
        const { email} = await request.json();
        const client = await clientPromise;
        const db = client.db('42reef-check');
        
		const emailExist = await db.collection('users').findOne({ email });
		// checks if the email is present in the database
		if (!emailExist) {
		  return NextResponse.json({ message: 'Email does not exist' }, { status: 400 });
		}
		// Deletes all the user with the matching email
		await db.collection('users').deleteMany({ email: email });
    	return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
	}
    catch (error) {
        return NextResponse.json({ message: "" + error }, { status: 400 });
    }
}
