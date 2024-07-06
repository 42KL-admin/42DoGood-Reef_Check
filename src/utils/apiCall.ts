type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export async function apiCall(
  url: string,
  method: HTTPMethod,
  body?: any,
  isCustomedHeader?: any,
  isFormData: boolean = false,
) {
  const headers = isCustomedHeader ? isCustomedHeader : {};

  const options: RequestInit = {
    method,
    headers:
      isFormData && isCustomedHeader
        ? headers
        : { 'Content-Type': 'application/json' },
    // credentials: 'include',
    body: isFormData ? body : JSON.stringify(body),
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(
      `API request failed with status ${response.status}, url: ${url}`,
    );
  }

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    return response.blob(); // Return blob data directly
  }
}
