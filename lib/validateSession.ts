import clientPromise from './mongodb';

export async function validateSession(sessionID: string | undefined) {
  try {
    const client = await clientPromise;
    const db = client.db("42reef-check");

    if (!sessionID) {
      return { status: 401, message: 'No session ID found' };
    }

    const sessionData = await db.collection('adminSessions').findOne({ sessionID });
    if (!sessionData) {
      return { status: 401, message: "SessionID is invalid or expired." };
    }

    const currentTime = new Date();
    if (sessionData.expiresAt < currentTime) {
      await db.collection('adminSessions').deleteOne({ sessionID });
      return { status: 440, message: "SessionID has expired." };
    }

    return { status: 200, message: "SessionID is valid." };
  } catch (error) {
    console.error('Error validating sessionID to database:', error);
    return { status: 500, message: "Failed to validate sessionID." };
  }
}
