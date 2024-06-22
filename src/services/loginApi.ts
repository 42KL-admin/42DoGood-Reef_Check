import { apiCall } from '@/utils/apiCall';

const loginApiUrl = `api/login`;

interface LoginUser {
  _id: string;
  email: string;
  role: "admin" | "user";
}

export interface LoginResponse {
  message: string;
  user: LoginUser;
}

export async function login(email: string) {
  try {
    const response = await apiCall(loginApiUrl, 'POST', { email });
    return response as LoginResponse;
  } catch (e: any) {
    throw new Error('login error', e.message);
  }
}
