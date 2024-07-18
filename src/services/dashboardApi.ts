import { EmailRole } from "@/stores/types";
import { apiCall } from "@/utils/apiCall";

const dashboardApiUrl = `/api/admin/Dashboard`

export async function getEmailList() {
  try {
    const response = await apiCall(dashboardApiUrl, "GET");
    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function inviteUser(email: string, role: EmailRole) {
  try {
    const response = await apiCall(dashboardApiUrl, "POST", { email, role });
    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function deleteUser(email: string) {
  try {
    const response = await apiCall(dashboardApiUrl, "DELETE", { email });
    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}

export async function updateUserRole(email: string, role: EmailRole) {
  try {
    const response = await apiCall(dashboardApiUrl, "PUT", { email, role });
    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}