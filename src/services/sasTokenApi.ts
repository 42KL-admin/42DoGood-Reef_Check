import { apiCall } from "@/utils/apiCall";

const sasTokenApiUrl = `api/sasToken`;

export async function checkSasToken() {
  try {
    const response = apiCall(sasTokenApiUrl, "GET");
  } catch (e: any) {
    throw new Error("getNewSasToken error", e.message);
  }
}
