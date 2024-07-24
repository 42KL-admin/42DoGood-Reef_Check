import { apiCall } from '@/utils/apiCall';

const sessionApiUrl = `/api/admin/SessionID`;

export async function validateSessionId() {
  try {
    const response = await apiCall(sessionApiUrl, 'GET');
    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function createSession(adminEmail: string) {
    try {
      const response = await apiCall(sessionApiUrl, 'POST', { adminEmail });
      return response;
    } catch (e: any) {
      throw new Error(e.message);
    }
}

export async function deleteSession() {
  try {
    const response = await apiCall(sessionApiUrl, 'DELETE');
    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
