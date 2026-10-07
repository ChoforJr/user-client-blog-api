import { getApiError } from "@/lib/api-utils";

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export async function apiRequest<T>(
  baseUrl: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  if (!baseUrl) {
    throw new Error(
      "The Blog API URL is not configured. Set BLOG_API_URL and NEXT_PUBLIC_BLOG_API_URL.",
    );
  }
  const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
    cache: "no-store",
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok) {
    throw new ApiRequestError(
      getApiError(payload, `The Blog API returned status ${response.status}.`),
      response.status,
    );
  }
  return payload as T;
}
