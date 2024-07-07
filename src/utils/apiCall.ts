type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export async function apiCall(url: string, method: HTTPMethod, body?: any, isFormData: boolean = false) {
  const options: RequestInit = {
    method,
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: isFormData ? body : JSON.stringify(body),
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}, url: ${url}`);
  }

  return response.json();
}