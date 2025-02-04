export async function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(await data), {
    status,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export function errorCode(e: unknown) {
  if (e instanceof HttpError) {
    return e.status;
  }
  return 500;
}

export class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
  }
}
