// Just using a custom api call to obtain slates
export async function getSlatesApiCall(data: RequestBody.OcrProcessUrl) {
  const options: RequestInit = {
    method: data.method,
    headers: data?.header,
    body: JSON.stringify(data.body),
  };

  console.log(options);

  const response = await fetch(data.apiUrl, options);

  if (!response.ok) {
    throw new Error(
      `API request failed with status ${response.status}, url: ${data.apiUrl}`,
    );
  }

  return response.blob();
}
