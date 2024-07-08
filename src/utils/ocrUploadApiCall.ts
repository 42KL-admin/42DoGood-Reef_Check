export async function ocrUploadApiCall(data: RequestBody.OcrProcessUrl) {
  const options: RequestInit = {
    method: data.method,
    headers: data?.header,
  };

  const response = await fetch(data.apiUrl, options);

  if (!response.ok) {
    throw new Error(
      `API request failed with status ${response.status}, url: ${data.apiUrl}`,
    );
  }

  return response;
}
