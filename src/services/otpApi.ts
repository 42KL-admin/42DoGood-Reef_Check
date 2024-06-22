import { apiCall } from "@/utils/apiCall";

const sendOTPApiUrl = `api/admin/EmailOTP`;
const otpVerficationApiUrl = `/api/admin/OTPVerification`;

interface OTPVerification {
  adminEmail: string;
  otp: string;
}

export async function sendOTP(adminEmail: string) {
  try {
    const response = await apiCall(sendOTPApiUrl, 'POST', { adminEmail });
    return response;
  } catch (e: any) {
    throw new Error('Error:', e.message);
  }
}

export async function verifyOTP(data: OTPVerification) {
  try {
    const response = await apiCall(otpVerficationApiUrl, "POST", data);
    return response;
  } catch (e: any) {
    throw new Error('verifyOTP error', e.message);
  }
}