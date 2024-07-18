import { apiCall } from '@/utils/apiCall';

const sasTokenApiUrl = 'api/excelTemplateSasToken';

// wrapper function to ask server for a new SAS token
export async function getExcelTemplateSasTokenCookie() {
  try {
    const response = await apiCall(sasTokenApiUrl, 'GET');

    return response;
  } catch (e: any) {
    throw new Error(e.message);
  }
}
