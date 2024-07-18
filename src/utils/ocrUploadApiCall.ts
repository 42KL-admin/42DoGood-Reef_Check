export async function ocrUploadApiCall(data: RequestBody.OcrProcessUrl) {
  const options: RequestInit = {
    method: data.method,
    headers: data?.header,
    body: JSON.stringify(data.body),
  };

  const response = await fetch(data.apiUrl, options);

  console.log('response: ', response);

  if (!response.ok) {
    throw new Error(
      `API request failed with status ${response.status}, url: ${data.apiUrl}`,
    );
  }

  return response;
}
