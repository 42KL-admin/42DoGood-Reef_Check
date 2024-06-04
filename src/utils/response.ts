interface ResponseBody {
  message?: string;
  error?: string;
  [key: string]: any;
}

export function generateResponse(data: ResponseBody, status: number): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
