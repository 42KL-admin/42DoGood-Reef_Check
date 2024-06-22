import { apiCall } from "@/utils/apiCall";

const dashboardApiUrl = `/api/admin/Dashboard`

export async function getEmailList() {
  try {
    const response = await apiCall(dashboardApiUrl, "GET");
    return response;
  } catch (e: any) {
    throw new Error("getEmailList error", e.message);
  }
}