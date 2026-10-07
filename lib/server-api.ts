import { resolveApiBaseUrl } from "@/lib/api-utils";

export function getApiBaseUrl(): string {
  return resolveApiBaseUrl(
    process.env.BLOG_API_URL,
    process.env.NEXT_PUBLIC_BLOG_API_URL,
  );
}

export function getClientApiBaseUrl(): string {
  return resolveApiBaseUrl(process.env.NEXT_PUBLIC_BLOG_API_URL);
}
