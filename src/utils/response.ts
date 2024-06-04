export function generateResponse(data: object, status: number, error?: string) {
    const responseBody = error ? { ...data, error } : data;
    return new Response(JSON.stringify(responseBody), {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }