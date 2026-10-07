export function resolveApiBaseUrl(
  publicUrl?: string,
  serverUrl?: string,
): string {
  return (publicUrl?.trim() || serverUrl?.trim() || "").replace(/\/+$/, "");
}

interface ApiFailure {
  errors?: string | string[] | { message?: string }[];
  message?: string;
}

export function upsertById<T extends { id: string }>(
  items: readonly T[],
  item: T,
): T[] {
  return [...items.filter((current) => current.id !== item.id), item];
}

export function deduplicateById<T extends { id: string }>(
  items: readonly T[],
): T[] {
  const uniqueItems = new Map<string, T>();
  for (const item of items) uniqueItems.set(item.id, item);
  return [...uniqueItems.values()];
}

export function getApiError(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const failure = payload as ApiFailure;
    if (typeof failure.message === "string") return failure.message;
    if (Array.isArray(failure.errors)) {
      return failure.errors
        .map((error) =>
          typeof error === "string" ? error : error?.message ?? "",
        )
        .filter(Boolean)
        .join(" ");
    }
    if (typeof failure.errors === "string") return failure.errors;
  }
  return fallback;
}
