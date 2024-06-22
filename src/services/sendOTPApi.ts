import { apiCall } from "@/utils/apiCall";

const sendOTPApiUrl = `api/admin/EmailOTP`;

export async function sendOTP(adminEmail: string) {
  try {
    const response = await apiCall(sendOTPApiUrl, 'POST', { adminEmail });
    return response;
  } catch (e: any) {
    throw new Error('Error:', e.message);
  }
}