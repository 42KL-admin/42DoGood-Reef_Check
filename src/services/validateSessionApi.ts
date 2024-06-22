import { apiCall } from "@/utils/apiCall";

const validateSessionApiUrl = `/api/admin/SessionID`;

export async function validateSessionId() {
    try {
        const response = await apiCall(validateSessionApiUrl, 'GET');
        return response;
    } catch (e: any) {
        throw new Error('validateSessionId error', e.message);
    }
}