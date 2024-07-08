// Just using a custom api call to obtain blob
export async function customApiCall(
  data: RequestBody.UploadTemplateFromBlobStorage
) {
  const options: RequestInit = {
    method: data.method,
    headers: data?.customHeader,
  };

  const response = await fetch(data.blobUrl, options);

  if (!response.ok) {
    throw new Error(
      `API request failed with status ${response.status}, url: ${data.blobUrl}`,
    );
  }

  return response.blob();
}
