type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export async function apiCall(url: string, method: HTTPMethod, body?: any) {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    // throw the error message that the server sent
    throw new Error(`API request failed with status ${response.status}, url: ${url}`);
  }

  return response.json();
}